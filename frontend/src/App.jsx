import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ParticipantDashboard from './pages/ParticipantDashboard';
import Submission from './pages/Submission';
import OrganizerDashboard from './pages/OrganizerDashboard';
import JudgePage from './pages/JudgePage';
import Leaderboard from './pages/Leaderboard';
import TeamPage from './pages/TeamPage';
import AuditLog from './pages/AuditLog';
import Scanner from './pages/Scanner';

const linkClass = 'text-indigo-100 hover:text-white font-medium transition'

const menu = {
  participant: [['/dashboard', 'Dashboard'], ['/team', 'Team'], ['/submit', 'Submit'], ['/leaderboard', 'Leaderboard']],
  organizer: [['/organizer', 'Organizer'], ['/scan', 'Scan QR'], ['/audit', 'Audit'], ['/leaderboard', 'Leaderboard']],
  judge: [['/judge', 'Judge'], ['/leaderboard', 'Leaderboard']],
}

function Guard({ role, allow, children }) {
  return allow.includes(role) ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [role, setRole] = useState(localStorage.getItem('role'))

  const handleLogin = (r) => {
    localStorage.setItem('role', r)
    setRole(r)
  }
  const handleLogout = () => {
    localStorage.removeItem('role')
    setRole(null)
  }

  return (
    <Router>
      <nav
        className="text-white px-6 py-4 flex flex-wrap gap-y-2 justify-between items-center shadow-lg"
        style={{ background: 'linear-gradient(90deg, #1e1b4b, #4338ca)' }}
      >
        <Link to="/" className="text-xl font-extrabold tracking-wide">⚡ HackOS</Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          {role && menu[role].map(([path, label]) => (
            <Link key={path} to={path} className={linkClass}>{label}</Link>
          ))}
          {role ? (
            <>
              <span className="bg-indigo-800 px-2 py-1 rounded text-xs capitalize">{role}</span>
              <Link to="/login" onClick={handleLogout} className="bg-white text-indigo-700 px-3 py-1 rounded font-semibold">Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-white text-indigo-700 px-3 py-1 rounded font-semibold">Login</Link>
              <Link to="/register" className="bg-indigo-500 px-3 py-1 rounded font-semibold hover:bg-indigo-400">Register</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Guard role={role} allow={['participant']}><ParticipantDashboard /></Guard>} />
        <Route path="/team" element={<Guard role={role} allow={['participant']}><TeamPage /></Guard>} />
        <Route path="/submit" element={<Guard role={role} allow={['participant']}><Submission /></Guard>} />
        <Route path="/organizer" element={<Guard role={role} allow={['organizer']}><OrganizerDashboard /></Guard>} />
        <Route path="/scan" element={<Guard role={role} allow={['organizer']}><Scanner /></Guard>} />
        <Route path="/audit" element={<Guard role={role} allow={['organizer']}><AuditLog /></Guard>} />
        <Route path="/judge" element={<Guard role={role} allow={['judge']}><JudgePage /></Guard>} />
        <Route path="/leaderboard" element={<Guard role={role} allow={['participant', 'organizer', 'judge']}><Leaderboard /></Guard>} />
      </Routes>
    </Router>
  );
}