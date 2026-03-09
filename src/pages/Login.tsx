import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen } from 'lucide-react'

export const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(form.email, form.password)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const routes: Record<string, string> = { DIRECTOR: '/director', TEACHER: '/teacher', STUDENT: '/student' }
      navigate(routes[user.role] || '/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-ink">
              <BookOpen size={24} className="text-paper" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Workbook</h1>
          <p className="text-sm text-ink/50 mt-1 font-mono">Collaborative Learning Platform</p>
        </div>

        <div className="bg-cream border border-rule p-8">
          <h2 className="font-display text-xl font-bold mb-6">Sign In</h2>
          {error && <p className="text-red-700 text-sm mb-4 bg-red-50 border border-red-200 p-3">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label block mb-1.5">Email</label>
              <input className="input-field" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label block mb-1.5">Password</label>
              <input className="input-field" type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm mt-4 text-ink/50">
            No account?{' '}
            <Link to="/register" className="text-ink underline">Register</Link>
          </p>
        </div>

        <div className="mt-4 p-4 bg-cream border border-rule text-xs font-mono text-ink/50 space-y-1">
          <p className="font-medium text-ink/70 mb-1">Demo credentials:</p>
          <p>Director: director@school.com / director123</p>
          <p>Teacher: teacher@school.com / teacher123</p>
          <p>Student: student@school.com / student123</p>
        </div>
      </div>
    </div>
  )
}