import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem('alomran_admin') === 'true'
  )

  const login = (email: string, password: string): boolean => {
    if (email === 'admin@alomranprecast.com' && password === 'alomran2024') {
      localStorage.setItem('alomran_admin', 'true')
      setIsLoggedIn(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('alomran_admin')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
