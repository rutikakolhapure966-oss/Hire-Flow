import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import PrivateRoute from '../layouts/PrivateRoute'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import { motion } from 'framer-motion'
import { FaCamera, FaDownload } from 'react-icons/fa'

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const endpoint = user?.role === 'candidate' ? 'candidate-profile' : 'recruiter-profile'
      const response = await api.get(`/auth/${endpoint}/`)
      setProfile(response.data)
      setFormData(response.data)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] instanceof File) {
          data.append(key, formData[key])
        } else if (formData[key] !== null) {
          data.append(key, formData[key])
        }
      })

      const endpoint = user?.role === 'candidate' ? 'candidate-profile' : 'recruiter-profile'
      await api.put(`/auth/${endpoint}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage('Profile updated successfully!')
      setEditing(false)
      fetchProfile()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner size="lg" />

  return (
    <PrivateRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">My Profile</h1>
                <Button
                  onClick={() => setEditing(!editing)}
                  variant={editing ? 'danger' : 'primary'}
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {message && (
                <div className={`px-4 py-3 rounded mb-4 ${
                  message.includes('successfully')
                    ? 'bg-green-100 text-green-700 border border-green-400'
                    : 'bg-red-100 text-red-700 border border-red-400'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {profile?.user?.profile_picture ? (
                      <img src={profile.user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FaCamera className="text-4xl text-gray-400" />
                    )}
                  </div>
                  {editing && (
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
                      <input
                        type="file"
                        name="profile_picture"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={profile?.user?.first_name || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          user: { ...prev.user, first_name: e.target.value }
                        }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-600">{profile?.user?.first_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={profile?.user?.last_name || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          user: { ...prev.user, last_name: e.target.value }
                        }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-600">{profile?.user?.last_name}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <p className="text-gray-600">{profile?.user?.email}</p>
                </div>

                {/* Candidate Specific */}
                {user?.role === 'candidate' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Current Title</label>
                        {editing ? (
                          <input
                            type="text"
                            name="current_title"
                            value={formData.current_title || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-600">{profile?.current_title || 'Not set'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                        {editing ? (
                          <input
                            type="number"
                            name="experience_years"
                            value={formData.experience_years || 0}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-600">{profile?.experience_years || 0} years</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                      {editing ? (
                        <textarea
                          name="skills"
                          value={formData.skills || ''}
                          onChange={handleChange}
                          placeholder="React, Node.js, MongoDB..."
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-600">{profile?.skills || 'Not set'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Resume</label>
                      {profile?.resume && (
                        <a href={profile.resume} download className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                          <FaDownload /> Download Current Resume
                        </a>
                      )}
                      {editing && (
                        <input
                          type="file"
                          name="resume"
                          onChange={handleFileChange}
                          accept=".pdf"
                          className="w-full mt-2"
                        />
                      )}
                    </div>
                  </>
                )}

                {/* Recruiter Specific */}
                {user?.role === 'recruiter' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                        {editing ? (
                          <input
                            type="text"
                            name="department"
                            value={formData.department || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-600">{profile?.department || 'Not set'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                        {editing ? (
                          <input
                            type="text"
                            name="designation"
                            value={formData.designation || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-600">{profile?.designation || 'Not set'}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                    {editing ? (
                      <input
                        type="url"
                        value={profile?.user?.linkedin_url || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          user: { ...prev.user, linkedin_url: e.target.value }
                        }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <a href={profile?.user?.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        {profile?.user?.linkedin_url || 'Not set'}
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub URL</label>
                    {editing ? (
                      <input
                        type="url"
                        value={profile?.user?.github_url || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          user: { ...prev.user, github_url: e.target.value }
                        }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <a href={profile?.user?.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        {profile?.user?.github_url || 'Not set'}
                      </a>
                    )}
                  </div>
                </div>

                {editing && (
                  <Button type="submit" disabled={saving} className="w-full">
                    {saving ? <Spinner size="sm" /> : 'Save Changes'}
                  </Button>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    </PrivateRoute>
  )
}

export default Profile
