import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ParticipantDashboard from './pages/ParticipantDashboard';
import Submission from './pages/Submission';
import OrganizerDashboard from './pages/OrganizerDashboard';
import JudgePage from './pages/JudgePage';
import Leaderboard from './pages/Leaderboard';
import TeamPage from './pages/TeamPage';

export default function App() {
  return (
    <Router>
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">HackOS WhyCode4U</h1>
        <div className="space-x-6">
          <Link to="/dashboard" className="hover:text-yellow-400 font-medium transition">Dashboard</Link>
          <Link to="/team" className="hover:text-cyan-400 font-medium transition">Team</Link>
          <Link to="/submit" className="hover:text-purple-400 font-medium transition">Submit</Link>
          <Link to="/organizer" className="hover:text-pink-400 font-medium transition">Organizer</Link>
          <Link to="/judge" className="hover:text-orange-400 font-medium transition">Judge</Link>
          <Link to="/leaderboard" className="hover:text-teal-400 font-medium transition">Leaderboard</Link>
          <Link to="/login" className="hover:text-blue-400 font-medium transition">Login</Link>
          <Link to="/register" className="hover:text-green-400 font-medium transition">Register</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ParticipantDashboard />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/submit" element={<Submission />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/judge" element={<JudgePage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}