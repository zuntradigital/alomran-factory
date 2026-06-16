import { createContext, useContext, useState, useEffect, type Dispatch, type SetStateAction, type ReactNode } from 'react'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '')

interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  role: string
}

interface AuthContextType {
  isLoggedIn: boolean
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginGoogle: () => Promise<boolean>
  logout: () => Promise<void>
  token: string | null
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false, user: null, loading: true,
  login: async () => false, loginGoogle: async () => false,
  logout: async () => {}, token: null,
})

// ── Role / display-name cache ────────────────────────────────────
const roleKey  = (uid: string) => `alomran_role_${uid}`
const dnameKey = (uid: string) => `alomran_dname_${uid}`

function getCachedRole(uid: string)        { return localStorage.getItem(roleKey(uid))  ?? 'viewer' }
function getCachedName(uid: string)        { return localStorage.getItem(dnameKey(uid)) }
function setCached(uid: string, role: string, displayName?: string | null) {
  localStorage.setItem(roleKey(uid), role)
  if (displayName) localStorage.setItem(dnameKey(uid), displayName)
}

// ── Background JWT exchange (non-blocking) ───────────────────────
function refreshJWT(firebaseUser: User): void {
  firebaseUser.getIdToken()
    .then(idToken =>
      fetch(`${API}/api/auth/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
    )
    .then(async res => {
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('alomran_token', data.token)
      }
    })
    .catch(() => { /* silent — existing token still valid */ })
}

// ── Background Firestore sync (non-blocking) ─────────────────────
function syncFromFirestore(
  uid: string,
  setUser: Dispatch<SetStateAction<AuthUser | null>>
): void {
  getDoc(doc(db, 'users', uid))
    .then(snap => {
      if (!snap.exists()) return
      const data = snap.data()

      if (data.active === false) {
        fbSignOut(auth)
        localStorage.removeItem('alomran_token')
        setUser(null)
        return
      }

      const role        = data.role        ?? 'viewer'
      const displayName = data.displayName ?? null
      setCached(uid, role, displayName)
      updateDoc(doc(db, 'users', uid), { lastLogin: new Date().toISOString() }).catch(() => {})

      setUser(prev => {
        if (!prev || prev.uid !== uid) return prev
        if (prev.role === role && prev.displayName === displayName) return prev
        return { ...prev, role, displayName: displayName ?? prev.displayName }
      })
    })
    .catch(() => { /* Firestore unavailable — cached values stay */ })
}

// ── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null)
  const [token,   setToken]   = useState<string | null>(() => localStorage.getItem('alomran_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        localStorage.removeItem('alomran_token')
        setUser(null)
        setToken(null)
        setLoading(false)
        return
      }

      // ① Instantly unblock the UI using cached role — zero network wait
      setUser({
        uid:         fbUser.uid,
        email:       fbUser.email,
        displayName: getCachedName(fbUser.uid) ?? fbUser.displayName,
        role:        getCachedRole(fbUser.uid),
      })
      setLoading(false)

      // ② Refresh JWT in background (updates localStorage token)
      refreshJWT(fbUser)

      // ③ Sync fresh role / active-status from Firestore in background
      syncFromFirestore(fbUser.uid, setUser)
    })
    return unsub
  }, [])

  // Email / password login with 10s timeout guard
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10_000)
      )
      await Promise.race([signInWithEmailAndPassword(auth, email, password), timeout])
      return true
    } catch {
      return false
    }
  }

  // Google popup login — provisions new users in Firestore background
  const loginGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const { uid, email, displayName } = result.user

      getDoc(doc(db, 'users', uid)).then(snap => {
        if (!snap.exists()) {
          return setDoc(doc(db, 'users', uid), {
            uid, email, displayName,
            role:      'viewer',
            active:    true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          })
        }
        return updateDoc(doc(db, 'users', uid), { lastLogin: new Date().toISOString() })
      }).catch(() => {})

      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    await fbSignOut(auth)
    localStorage.removeItem('alomran_token')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, loading, login, loginGoogle, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
