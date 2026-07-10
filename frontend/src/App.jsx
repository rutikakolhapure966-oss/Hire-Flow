import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import CandidateProfile from './pages/CandidateProfile';
import RecruiterApplicants from './pages/RecruiterApplicants';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="font-bold">HireFlow</Link>
          <div className="flex gap-4">
            <Link to="/">Home</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/recruiter/applicants">Applicants</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<h2>Welcome to HireFlow — build out the UI</h2>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:slug" element={<JobDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<CandidateProfile />} />
          <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
        </Routes>
      </main>
    </div>
  );
}
