import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold">
          <Link to={`/jobs/${job.slug}`}>{job.title}</Link>
        </h3>
        <p className="text-sm text-gray-600">{job.company?.name} • {job.location}</p>
        <div className="mt-2 text-sm">
          <span className="mr-3">{job.employment_type}</span>
          <span className="mr-3">{job.experience_level}</span>
          {job.salary_min && job.salary_max && (
            <span className="mr-3">{job.currency} {job.salary_min} - {job.salary_max}</span>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Link to={`/jobs/${job.slug}`} className="text-blue-600">View</Link>
        <span className="text-xs text-gray-500">Posted: {new Date(job.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
