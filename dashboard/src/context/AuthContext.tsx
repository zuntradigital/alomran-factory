import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  type User,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '')

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  role: string
  firebaseUser: User
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateDisplayName: (name: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  getToken: () => Promise<string>
}

const AuthContext = createContext<AuthContextType | null>(null)

// ── Role cache helpers ───────────────────────────────────────────
const ROLE_CACHE_KEY  = (uid: string) => `alomran_role_${uid}`
const DNAME_CACHE_KEY = (uid: string) => `alomran_dname_${uid}`

function getCachedRole(uid: string): string {
  return localStorage.getItem(ROLE_CACHE_KEY(uid)) ?? 'viewer'
}
function setCachedRole(uid: string, role: string, displayName?: string) {
  localStorage.setItem(ROLE_CACHE_KEY(uid), role)
  if (displayName) localStorage.setItem(DNAME_CACHE_KEY(uid), displayName)
}
function getCachedDisplayName(uid: string): string | null {
  return localStorage.getItem(DNAME_CACHE_KEY(uid))
}

// ── Fire-and-forget JWT exchange ─────────────────────────────────
function refreshJWT(firebaseUser: User): void {
  firebaseUser.getIdToken().then(idToken =>
    fetch(`${API}/api/auth/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
  ).then(async res => {
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
  }).catch(() => { /* silent — fallback token in localStorage still works */ })
}

// ── Background Firestore sync ────────────────────────────────────
function syncUserFromFirestore(uid: string, setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>) {
  getDoc(doc(db, 'users', uid)).then(snap => {
    if (!snap.exists()) return
    const data = snap.data()

    if (data.active === false) {
      fbSignOut(auth)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      return
    }

    const role        = data.role        ?? 'viewer'
    const displayName = data.displayName ?? null

    setCachedRole(uid, role, displayName ?? undefined)
    updateDoc(doc(db, 'users', uid), { lastLogin: new Date().toISOString() }).catch(() => {})

    // Patch user state with fresh values (non-blocking)
    setUser(prev => {
      if (!prev || prev.uid !== uid) return prev
      if (prev.role === role && prev.displayName === displayName) return prev
      return { ...prev, role, displayName: displayName ?? prev.displayName }
    })
  }).catch(() => { /* Firestore unavailable — cached role stays */ })
}

// ── AuthProvider ─────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setLoading(false)
        return
      }

      // ① Unblock UI immediately with cached role — zero network wait
      const cachedRole  = getCachedRole(firebaseUser.uid)
      const cachedDName = getCachedDisplayName(firebaseUser.uid)

      setUser({
        uid:         firebaseUser.uid,
        email:       firebaseUser.email,
        displayName: cachedDName ?? firebaseUser.displayName,
        role:        cachedRole,
        firebaseUser,
      })
      setLoading(false)   // ← UI unblocks here, before any network call

      // ② Background: refresh JWT (non-blocking)
      refreshJWT(firebaseUser)

      // ③ Background: sync fresh role/status from Firestore (non-blocking)
      syncUserFromFirestore(firebaseUser.uid, setUser)
    })

    return unsubscribe
  }, [])

  // ── signIn with 10s timeout ────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), 10_000)
    )
    await Promise.race([
      signInWithEmailAndPassword(auth, email, password),
      timeout,
    ])
    // lastLogin is written by the background sync, not here
  }

  // ── Google sign-in: fire-and-forget Firestore ops ─────────────
  const signInGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    const uid    = result.user.uid

    // Provision new Google users in the background — don't block redirect
    getDoc(doc(db, 'users', uid)).then(snap => {
      if (!snap.exists()) {
        return setDoc(doc(db, 'users', uid), {
          uid,
          email:       result.user.email,
          displayName: result.user.displayName,
          role:        'viewer',
          active:      true,
          createdAt:   new Date().toISOString(),
          lastLogin:   new Date().toISOString(),
        })
      }
      return updateDoc(doc(db, 'users', uid), { lastLogin: new Date().toISOString() })
    }).catch(() => {})
  }

  const signOut = async () => {
    await fbSignOut(auth)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email)

  const getToken = async (): Promise<string> => {
    if (user?.firebaseUser) {
      try { return await user.firebaseUser.getIdToken() } catch { /* fall through */ }
    }
    return localStorage.getItem('token') ?? ''
  }

  const updateDisplayName = async (name: string) => {
    if (!user?.firebaseUser) throw new Error('Not signed in')
    await updateProfile(user.firebaseUser, { displayName: name })
    updateDoc(doc(db, 'users', user.uid), { displayName: name }).catch(() => {})
    setCachedRole(user.uid, user.role, name)
    setUser(prev => prev ? { ...prev, displayName: name } : prev)
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.firebaseUser || !user.email) throw new Error('Not signed in')
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user.firebaseUser, credential)
    await updatePassword(user.firebaseUser, newPassword)
  }

  return (
    <AuthContext.Provider value={{
      user, loading, signIn, signInGoogle, signOut,
      resetPassword, updateDisplayName, changePassword, getToken,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
