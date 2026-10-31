import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

const linkClass = 'text-indigo-100 hover:text-white font-medium transition'

export default function App() {
  return (
    <Router>
      <nav
        className="text-white px-6 py-4 flex flex-wrap gap-y-2 justify-between items-center shadow-lg"
        style={{ background: 'linear-gradient(90deg, #1e1b4b, #4338ca)' }}
      >
        <Link to="/" className="text-xl font-extrabold tracking-wide">⚡ HackOS</Link>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <Link to="/dashboard" className={linkClass}>Dashboard</Link>
          <Link to="/team" className={linkClass}>Team</Link>
          <Link to="/submit" className={linkClass}>Submit</Link>
          <Link to="/organizer" className={linkClass}>Organizer</Link>
          <Link to="/judge" className={linkClass}>Judge</Link>
          <Link to="/leaderboard" className={linkClass}>Leaderboard</Link>
          <Link to="/audit" className={linkClass}>Audit</Link>
          <Link to="/login" className="bg-white text-indigo-700 px-3 py-1 rounded font-semibold">Login</Link>
          <Link to="/register" className="bg-indigo-500 px-3 py-1 rounded font-semibold hover:bg-indigo-400">Register</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ParticipantDashboard />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/submit" element={<Submission />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/judge" element={<JudgePage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/audit" element={<AuditLog />} />
      </Routes>
    </Router>
  );
}