import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email aur password dono daalo')
      return
    }
    // Abhi fake login. Anuma ki API ready hone par yahan asli login aayega.
    setError('')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow w-80 space-y-4">
        <h1 className="text-2xl font-bold text-center">HackOS Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="w-full border p-2 rounded" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  )
}