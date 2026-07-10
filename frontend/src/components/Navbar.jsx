import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaBriefcase, FaMenu, FaTimes, FaBell } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600">
            <FaBriefcase /> HireFlow
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition">
              Jobs
            </Link>
            {isAuthenticated && user?.role === 'recruiter' && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <Link to="/post-job" className="text-gray-700 hover:text-blue-600 transition">
                  Post Job
                </Link>
              </>
            )}
            {isAuthenticated && user?.role === 'candidate' && (
              <>
                <Link to="/applications" className="text-gray-700 hover:text-blue-600 transition">
                  Applications
                </Link>
                <Link to="/saved-jobs" className="text-gray-700 hover:text-blue-600 transition">
                  Saved
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
                  Profile
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{user?.email}</span>
                  <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-3"
          >
            <Link to="/jobs" className="block text-gray-700 hover:text-blue-600">
              Jobs
            </Link>
            {isAuthenticated && user?.role === 'recruiter' && (
              <>
                <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/post-job" className="block text-gray-700 hover:text-blue-600">
                  Post Job
                </Link>
              </>
            )}
            {isAuthenticated && user?.role === 'candidate' && (
              <>
                <Link to="/applications" className="block text-gray-700 hover:text-blue-600">
                  Applications
                </Link>
                <Link to="/saved-jobs" className="block text-gray-700 hover:text-blue-600">
                  Saved Jobs
                </Link>
                <Link to="/profile" className="block text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setIsOpen(false) }}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
