import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <Router>
      {/* Clean & Professional Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">HackOS WhyCode4U</h1>
        <div className="space-x-6">
          <Link to="/login" className="hover:text-blue-400 font-medium transition">Login</Link>
          <Link to="/register" className="hover:text-green-400 font-medium transition">Register</Link>
        </div>
      </nav>

      {/* Routes setup */}
      <Routes>
        {/* Jab bhi koi website khole, seedha /login par redirect ho jaye */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}