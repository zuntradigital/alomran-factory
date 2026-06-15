import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false, user: null, loading: true,
  login: async () => false, loginGoogle: async () => false,
  logout: () => {}, token: null,
})

async function exchangeForJWT(firebaseUser: User): Promise<string | null> {
  try {
    const idToken = await firebaseUser.getIdToken()
    const res = await fetch(`${API}/auth/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.token ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,  setUser]  = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('alomran_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const snap = await getDoc(doc(db, 'users', fbUser.uid)).catch(() => null)
        const data = snap?.data()

        if (data?.active === false) {
          await fbSignOut(auth)
          setUser(null); setToken(null)
          localStorage.removeItem('alomran_token')
          setLoading(false); return
        }

        const role = data?.role ?? 'viewer'
        const jwt  = await exchangeForJWT(fbUser)
        if (jwt) {
          localStorage.setItem('alomran_token', jwt)
          setToken(jwt)
        }

        setUser({ uid: fbUser.uid, email: fbUser.email, displayName: data?.displayName ?? fbUser.displayName, role })
      } else {
        setUser(null); setToken(null)
        localStorage.removeItem('alomran_token')
        localStorage.removeItem('alomran_user')
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch {
      return false
    }
  }

  const loginGoogle = async (): Promise<boolean> => {
    try {
      await signInWithPopup(auth, googleProvider)
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    await fbSignOut(auth)
    localStorage.removeItem('alomran_token')
    localStorage.removeItem('alomran_user')
    setUser(null); setToken(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, loading, login, loginGoogle, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
