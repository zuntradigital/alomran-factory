import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return null
  return isLoggedIn ? <>{children}</> : <Navigate to="/admin/login" replace />
}
