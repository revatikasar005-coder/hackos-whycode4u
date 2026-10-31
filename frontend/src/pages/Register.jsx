import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Fake "already registered" list. Baad mein Anuma ki API se aayegi.
const existingUsers = [
  { email: 'test@example.com', phone: '9876543210' },
  { email: 'anuma@example.com', phone: '9123456780' },
]

const cleanPhone = (p) => p.replace(/\D/g, '').slice(-10)

export default function Register() {
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
    navigate('/team')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-80 space-y-4">
        <h1 className="text-2xl font-bold text-center">HackOS Register</h1>
        {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</p>}
        <input name="name" className="w-full border p-2 rounded" placeholder="Full name"
          value={form.name} onChange={handleChange} />
        <input name="email" className="w-full border p-2 rounded" placeholder="Email"
          value={form.email} onChange={handleChange} />
        <input name="phone" className="w-full border p-2 rounded" placeholder="Phone"
          value={form.phone} onChange={handleChange} />
        <input name="password" type="password" className="w-full border p-2 rounded" placeholder="Password"
          value={form.password} onChange={handleChange} />
        <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  )
}