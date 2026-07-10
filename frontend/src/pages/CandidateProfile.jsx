import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [currentFields, setCurrentFields] = useState({});

  useEffect(() => {
    api.get('auth/candidate-profile/')
      .then(res => {
        setProfile(res.data);
        setCurrentFields({
          current_title: res.data.current_title || '',
          company: res.data.company || '',
          skills: res.data.skills || '',
          bio: res.data.bio || '',
          portfolio_url: res.data.portfolio_url || '',
          experience_years: res.data.experience_years || 0,
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(currentFields).forEach((k) => formData.append(k, currentFields[k]));
      if (resumeFile) formData.append('resume', resumeFile);
      if (pictureFile) formData.append('profile_picture', pictureFile);

      await api.put('auth/candidate-profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Profile updated');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || 'Update failed');
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">Candidate Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div className="flex gap-4 items-center">
          <div>
            {profile?.resume && <a className="text-blue-600" href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${profile.resume}`} target="_blank" rel="noreferrer">View Current Resume</a>}
          </div>
        </div>

        <div>
          <label className="block text-sm">Resume (PDF)</label>
          <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
        </div>

        <div>
          <label className="block text-sm">Profile Picture</label>
          <input type="file" accept="image/*" onChange={(e) => setPictureFile(e.target.files[0])} />
        </div>

        <div>
          <label className="block text-sm">Current Title</label>
          <input value={currentFields.current_title} onChange={(e) => setCurrentFields({ ...currentFields, current_title: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Company</label>
          <input value={currentFields.company} onChange={(e) => setCurrentFields({ ...currentFields, company: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Skills (comma-separated)</label>
          <input value={currentFields.skills} onChange={(e) => setCurrentFields({ ...currentFields, skills: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Experience (years)</label>
          <input type="number" value={currentFields.experience_years} onChange={(e) => setCurrentFields({ ...currentFields, experience_years: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Portfolio URL</label>
          <input value={currentFields.portfolio_url} onChange={(e) => setCurrentFields({ ...currentFields, portfolio_url: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Bio</label>
          <textarea value={currentFields.bio} onChange={(e) => setCurrentFields({ ...currentFields, bio: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Profile</button>
      </form>
    </div>
  );
}
