import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './layouts/PrivateRoute'
import './index.css'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import Profile from './pages/Profile'
import Applications from './pages/Applications'
import SavedJobs from './pages/SavedJobs'
import Dashboard from './pages/Dashboard'
import PostJob from './pages/PostJob'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:slug" element={<JobDetails />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <PrivateRoute allowedRoles={['candidate', 'recruiter']}>
                <Applications />
              </PrivateRoute>
            }
          />
          <Route
            path="/saved-jobs"
            element={
              <PrivateRoute allowedRoles={['candidate']}>
                <SavedJobs />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['recruiter', 'candidate']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <PrivateRoute allowedRoles={['recruiter']}>
                <PostJob />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
