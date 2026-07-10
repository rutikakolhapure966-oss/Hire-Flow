import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import PrivateRoute from '../layouts/PrivateRoute'
import { useAuth } from '../context/AuthContext'
import { applicationService } from '../services/applicationService'
import Spinner from '../components/Spinner'
import { motion } from 'framer-motion'
import { FaBriefcase, FaCalendar, FaCheckCircle } from 'react-icons/fa'
import { formatDate } from '../utils/helpers'

const Applications = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await applicationService.getApplications()
      let apps = response.data.results || response.data
      
      if (filter !== 'all') {
        apps = apps.filter(app => app.status === filter)
      }
      
      setApplications(apps)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus)
      fetchApplications()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-purple-100 text-purple-800',
    interview_scheduled: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-green-100 text-green-800'
  }

  if (loading) return <Spinner size="lg" />

  return (
    <PrivateRoute>
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-6">Applications</h1>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-4 rounded-lg">
                {['all', 'applied', 'shortlisted', 'interview_scheduled', 'rejected', 'hired'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                <p className="text-xl">No applications found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {applications.map((app) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{app.job.title}</h3>
                        <p className="text-gray-600">{app.job.company.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[app.status]}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaBriefcase /> {app.job.employment_type}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaCalendar /> Applied on {formatDate(app.created_at)}
                      </div>
                    </div>

                    {app.cover_letter && (
                      <div className="bg-gray-50 p-4 rounded mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Cover Letter</p>
                        <p className="text-gray-600 text-sm line-clamp-3">{app.cover_letter}</p>
                      </div>
                    )}

                    {user?.role === 'recruiter' && (
                      <div className="flex gap-2 mt-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlist</option>
                          <option value="interview_scheduled">Schedule Interview</option>
                          <option value="rejected">Reject</option>
                          <option value="hired">Hire</option>
                        </select>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </MainLayout>
    </PrivateRoute>
  )
}

export default Applications
