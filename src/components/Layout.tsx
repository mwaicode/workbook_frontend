import type { ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, LogOut, User } from 'lucide-react'

interface Props { children: ReactNode }

const roleColor = { DIRECTOR: 'badge-director', TEACHER: 'badge-teacher', STUDENT: 'badge-student' }
const roleLinks = {
  DIRECTOR: [
    { to: '/director', label: 'Workbook' },
    { to: '/director/grades', label: 'Grade Approvals' },
  ],
  TEACHER: [
    { to: '/teacher', label: 'Workbook' },
    { to: '/teacher/grading', label: 'Grading' },
  ],
  STUDENT: [
    { to: '/student', label: 'My Workbook' },
    { to: '/student/grades', label: 'My Grades' },
  ],
}

export const Layout = ({ children }: Props) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => { await logout(); navigate('/login') }
  // const links = user ? roleLinks[user.role] : []

  // To this:
const links = user ? (roleLinks[user.role as keyof typeof roleLinks] ?? []) : []

  return (
    <div className="min-h-screen">
      <header className="border-b border-rule bg-cream/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen size={18} className="text-ink" />
              <span className="font-display font-bold text-lg tracking-tight">Workbook</span>
            </Link>
            <nav className="flex items-center gap-1">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-1 text-sm font-mono transition-colors ${
                    location.pathname === l.to
                      ? 'text-ink font-medium'
                      : 'text-ink/50 hover:text-ink'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className={roleColor[user.role]}>{user.role}</span>
              <div className="flex items-center gap-2 text-sm">
                <User size={14} className="text-ink/40" />
                <span className="font-medium">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="text-ink/40 hover:text-ink transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}