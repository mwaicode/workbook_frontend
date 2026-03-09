import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types';

interface Props { roles: Role[]; children: React.ReactNode }

export const RoleGuard = ({ roles, children }: Props) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="text-ink/40 font-mono text-sm">Loading...</div></div>
  // if (!user) return <Navigate to="/login" replace />
  if (!user) return <Navigate to="/welcome" replace />
  if (!roles.includes(user.role)) return <Navigate to="/unauthorized" replace />
  return <>{children}</>
}

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="text-ink/40 font-mono text-sm">Loading...</div></div>
  // if (!user) return <Navigate to="/login" replace />
  if (!user) return <Navigate to="/welcome" replace />
  return <>{children}</>
}