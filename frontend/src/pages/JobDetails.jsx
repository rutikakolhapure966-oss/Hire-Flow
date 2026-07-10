import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { jobService } from '../services/jobService'
import { applicationService } from '../services/applicationService'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaDollarSign, FaBriefcase, FaCalendar, FaCheckCircle } from 'react-icons/fa'
import { formatDate, formatCurrency } from '../utils/helpers'

const JobDetails = () => {
  const { slug } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [hasApplied, setHasApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobService.getJobBySlug(slug)
        setJob(response.data)
      } catch (error) {
        console.error('Failed to fetch job:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [slug])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    setApplying(true)
    try {
      await applicationService.createApplication(job.id, { cover_letter: coverLetter })
      setHasApplied(true)
      setCoverLetter('')
      setSaveMessage('Applied successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage(error.response?.data?.error || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  const handleSaveJob = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      if (isSaved) {
        const savedJobs = await applicationService.getSavedJobs()
        const savedJob = savedJobs.data.results?.find(item => item.job.id === job.id)
        if (savedJob) await applicationService.removeSavedJob(savedJob.id)
        setIsSaved(false)
      } else {
        await applicationService.saveJob(job.id)
        setIsSaved(true)
      }
      setSaveMessage(isSaved ? 'Removed from saved jobs' : 'Added to saved jobs')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Failed to save job')
    }
  }

  if (loading) return <Spinner size="lg" />
  if (!job) return <MainLayout><div className="text-center py-20">Job not found</div></MainLayout>

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-xl text-gray-600">{job.company.name}</p>
              </div>
              {job.company.logo && (
                <img src={job.company.logo} alt={job.company.name} className="w-20 h-20 rounded" />
              )}
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <FaMapMarkerAlt className="text-blue-500" />
                {job.location}
              </div>
              {job.salary_min && (
                <div className="flex items-center gap-2 text-gray-700">
                  <FaDollarSign className="text-green-500" />
                  {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-700">
                <FaBriefcase className="text-purple-500" />
                {job.employment_type}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaCalendar className="text-orange-500" />
                {formatDate(job.created_at)}
              </div>
            </div>

            {user?.role === 'candidate' && (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveJob}
                  variant={isSaved ? 'primary' : 'outline'}
                  className="flex-1"
                >
                  {isSaved ? '❤️ Saved' : '🖤 Save Job'}
                </Button>
                {!hasApplied && (
                  <Button className="flex-1" onClick={() => document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' })}>
                    Apply Now
                  </Button>
                )}
                {hasApplied && (
                  <Button variant="secondary" className="flex-1" disabled>
                    <FaCheckCircle className="inline mr-2" /> Already Applied
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">About the Role</h2>
                <div className="prose max-w-none text-gray-700">
                  {job.description}
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {job.responsibilities}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Benefits</h2>
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {job.benefits}
                  </div>
                </div>
              )}

              {/* Skills */}
              {job.skills_required && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.split(',').map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {/* Company Info */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">About Company</h3>
                <p className="text-gray-600 mb-4">{job.company.description}</p>
                {job.company.website && (
                  <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Visit Website →
                  </a>
                )}
              </div>

              {/* Apply Form */}
              {user?.role === 'candidate' && !hasApplied && (
                <form onSubmit={handleApply} id="apply-form" className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold mb-4">Apply for this job</h3>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Write a cover letter (optional)..."
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  />
                  <Button type="submit" disabled={applying} className="w-full">
                    {applying ? <Spinner size="sm" /> : 'Submit Application'}
                  </Button>
                  {saveMessage && (
                    <p className="text-green-600 text-sm mt-2 text-center">{saveMessage}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default JobDetails
