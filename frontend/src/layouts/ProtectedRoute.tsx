import { Navigate, Outlet } from 'react-router-dom'
import { Loader } from '../components/common/Loader'
import { useAuth } from '../context/AuthContext'
import type { RoleName } from '../types/auth'

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function RoleRoute({ allowed }: { allowed: RoleName[] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export function PublicRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
