import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import PrivateRoute from '../layouts/PrivateRoute'
import { useAuth } from '../context/AuthContext'
import { applicationService } from '../services/applicationService'
import Spinner from '../components/Spinner'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaDollarSign, FaBriefcase } from 'react-icons/fa'
import { formatDate, formatCurrency } from '../utils/helpers'
import { Link } from 'react-router-dom'

const SavedJobs = () => {
  const { user } = useAuth()
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const fetchSavedJobs = async () => {
    try {
      setLoading(true)
      const response = await applicationService.getSavedJobs()
      setSavedJobs(response.data.results || response.data)
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSaved = async (id) => {
    try {
      await applicationService.removeSavedJob(id)
      setSavedJobs(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Failed to remove saved job:', error)
    }
  }

  if (loading) return <Spinner size="lg" />

  return (
    <PrivateRoute allowedRoles={['candidate']}>
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-8">Saved Jobs</h1>

            {savedJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                <p className="text-xl mb-4">No saved jobs yet</p>
                <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Browse Jobs →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedJobs.map((saved) => {
                  const job = saved.job
                  return (
                    <motion.div
                      key={saved.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <Link to={`/jobs/${job.slug}`} className="text-xl font-bold text-gray-900 hover:text-blue-600">
                            {job.title}
                          </Link>
                          <p className="text-gray-600 mt-1">{job.company.name}</p>
                        </div>
                        {job.company.logo && (
                          <img src={job.company.logo} alt={job.company.name} className="w-12 h-12 rounded" />
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-blue-500" />
                          {job.location}
                        </div>
                        {job.salary_min && (
                          <div className="flex items-center gap-2">
                            <FaDollarSign className="text-green-500" />
                            {formatCurrency(job.salary_min)}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FaBriefcase className="text-purple-500" />
                          {job.employment_type}
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex gap-2">
                        <Link
                          to={`/jobs/${job.slug}`}
                          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-center transition"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleRemoveSaved(saved.id)}
                          className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </MainLayout>
    </PrivateRoute>
  )
}

export default SavedJobs
