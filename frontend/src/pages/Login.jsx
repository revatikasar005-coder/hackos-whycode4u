import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'; // api.js ka path apne structure ke hisaab se dekh lena

const homeFor = { participant: '/dashboard', organizer: '/organizer', judge: '/judge' }

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('participant')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email aur password dono daalo')
      return
    }
    setError('')
    setLoading(true)

    try {
      // Anuma ke backend API par request bhej rahe hain
      const response = await api.post('/auth/login', { email, password, role })
      
      console.log("Login Success:", response.data)
      
      // Agar backend se role ya success aaye toh onlogin aur navigate chalega
      const userRole = response.data.role || role
      onLogin(userRole)
      navigate(homeFor[userRole] || '/dashboard')
    } catch (err) {
      console.error("Login Error:", err)
      setError(err.response?.data?.message || 'Login fail ho gaya! Details check karo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex items-center justify-center px-4"
      style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #e0e7ff, #f5f3ff)' }}
    >
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
        <div className="text-center">
          <div className="text-4xl">🔐</div>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">Welcome back</h1>
          <p className="text-sm text-slate-500">Login to HackOS</p>
        </div>
        {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</p>}
        <input className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select className="w-full border border-slate-300 p-2.5 rounded-lg" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="participant">Login as Participant</option>
          <option value="organizer">Login as Organizer</option>
          <option value="judge">Login as Judge</option>
        </select>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}