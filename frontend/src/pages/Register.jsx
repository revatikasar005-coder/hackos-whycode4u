import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Fake "already registered" list. Baad mein Anuma ki API se aayegi.
const existingUsers = [
  { email: 'test@example.com', phone: '9876543210' },
  { email: 'anuma@example.com', phone: '9123456780' },
]

const cleanPhone = (p) => p.replace(/\D/g, '').slice(-10)

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Saari fields bharo')
      return
    }

    const dupEmail = existingUsers.find(
      (u) => u.email.toLowerCase() === form.email.toLowerCase()
    )
    const dupPhone = existingUsers.find(
      (u) => cleanPhone(u.phone) === cleanPhone(form.phone)
    )

    if (dupEmail || dupPhone) {
      setError(
        'Ye ' + (dupEmail ? 'email' : 'phone number') + ' already registered hai. Login karo ya organizer se baat karo.'
      )
      return
    }

    setError('')
    onLogin('participant')
    navigate('/team')
  }

  const inputClass =
    'w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400'

  return (
    <div
      className="flex items-center justify-center px-4"
      style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #e0e7ff, #f5f3ff)' }}
    >
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
        <div className="text-center">
          <div className="text-4xl">📝</div>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">Create your account</h1>
          <p className="text-sm text-slate-500">Register for WhyCode4U Hackathon</p>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</p>}

        <input name="name" className={inputClass} placeholder="Full name"
          value={form.name} onChange={handleChange} />
        <input name="email" className={inputClass} placeholder="Email"
          value={form.email} onChange={handleChange} />
        <input name="phone" className={inputClass} placeholder="Phone"
          value={form.phone} onChange={handleChange} />
        <input name="password" type="password" className={inputClass} placeholder="Password"
          value={form.password} onChange={handleChange} />

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg font-semibold">
          Register
        </button>
      </form>
    </div>
  )
}