import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function JobDetail() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    api.get(`jobs/${slug}/`)
      .then(res => setJob(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleApply = async () => {
    try {
      await api.post('applications/applications/', { job_id: job.id, cover_letter: coverLetter });
      alert('Applied successfully');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || 'Apply failed');
    }
  };

  const handleSave = async () => {
    try {
      await api.post('applications/saved-jobs/', { job_id: job.id });
      alert('Job saved');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || 'Save failed');
    }
  };

  if (loading) return <div>Loading job...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <p className="text-sm text-gray-600">{job.company?.name} • {job.location}</p>
        <p className="mt-4">{job.description}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={handleApply} className="bg-green-600 text-white px-4 py-2 rounded">Apply</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Responsibilities</h3>
        <p>{job.responsibilities}</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Requirements</h3>
        <p>{job.requirements}</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Apply</h3>
        <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="w-full border p-2 rounded" placeholder="Write a short cover letter (optional)" />
        <div className="mt-2">
          <button onClick={handleApply} className="bg-green-600 text-white px-4 py-2 rounded">Submit Application</button>
        </div>
      </div>
    </div>
  );
}
