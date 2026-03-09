import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen } from 'lucide-react'

const ROLES = ['DIRECTOR', 'TEACHER', 'STUDENT'] as const

export const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await register(form)
      const routes: Record<string, string> = { DIRECTOR: '/director', TEACHER: '/teacher', STUDENT: '/student' }
      navigate(routes[form.role] || '/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-ink"><BookOpen size={24} className="text-paper" /></div>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Workbook</h1>
          <p className="text-sm text-ink/50 mt-1 font-mono">Collaborative Learning Platform</p>
        </div>

        <div className="bg-cream border border-rule p-8">
          <h2 className="font-display text-xl font-bold mb-6">Create Account</h2>
          {error && <p className="text-red-700 text-sm mb-4 bg-red-50 border border-red-200 p-3">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label block mb-1.5">Full Name</label>
              <input className="input-field" type="text" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label block mb-1.5">Email</label>
              <input className="input-field" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label block mb-1.5">Password</label>
              <input className="input-field" type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
            </div>
            <div>
              <label className="label block mb-1.5">Role</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => (
                  <button key={r} type="button"
                    onClick={() => setForm(f => ({ ...f, role: r }))}
                    className={`py-2 text-xs font-mono uppercase tracking-wider border transition-colors ${
                      form.role === r ? 'bg-ink text-paper border-ink' : 'border-rule hover:bg-cream'
                    }`}
                  >{r}</button>
                ))}
              </div>
            </div>
            <button className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm mt-4 text-ink/50">
            Have an account? <Link to="/login" className="text-ink underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}