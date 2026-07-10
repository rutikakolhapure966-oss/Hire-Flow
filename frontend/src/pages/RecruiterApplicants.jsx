import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function RecruiterApplicants() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch recruiter's own jobs
    api.get('jobs/', { params: { mine: 'true' } })
      .then(res => setJobs(res.data.results || res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchApplications = (jobId) => {
    setLoading(true);
    api.get('applications/applications/', { params: { job: jobId } })
      .then(res => setApplications(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleJobChange = (e) => {
    const id = e.target.value;
    setSelectedJob(id);
    if (id) fetchApplications(id);
    else setApplications([]);
  };

  const downloadResume = (appId) => {
    api.get(`applications/applications/${appId}/download_resume/`, { responseType: 'blob' })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'resume.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(err => console.error(err));
  };

  const updateStatus = (appId, status) => {
    api.patch(`applications/applications/${appId}/update_status/`, { status })
      .then(res => {
        setApplications((prev) => prev.map(a => (a.id === res.data.id ? res.data : a)));
        alert('Status updated');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Recruiter - Applicants</h2>
      <div className="bg-white p-4 rounded shadow mb-4">
        <label className="block text-sm mb-2">Select Job</label>
        <select value={selectedJob} onChange={handleJobChange} className="w-full border px-3 py-2 rounded">
          <option value="">-- Select a job --</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>

      {loading ? <div>Loading applicants...</div> : (
        <div className="space-y-4">
          {applications.length === 0 && <div className="bg-white p-4 rounded shadow">No applicants</div>}
          {applications.map(app => (
            <div key={app.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{app.candidate.get_full_name || (app.candidate.first_name + ' ' + app.candidate.last_name)}</div>
                <div className="text-sm text-gray-600">{app.candidate.email}</div>
                <div className="text-sm">Status: {app.status}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => downloadResume(app.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Download Resume</button>
                <select defaultValue={app.status} onChange={(e) => updateStatus(app.id, e.target.value)} className="border px-2 py-1 rounded">
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
