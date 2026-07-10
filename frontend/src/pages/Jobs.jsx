import React, { useEffect, useState } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import Pagination from '../components/Pagination';
import SkeletonJob from '../components/SkeletonJob';
import { useToast } from '../context/ToastContext';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [filters, setFilters] = useState({});
  const { addToast } = useToast();

  const fetchJobs = (params = {}) => {
    setLoading(true);
    const q = { page, ...filters, ...params };
    api.get('jobs/', { params: q })
      .then(res => {
        const data = res.data;
        setJobs(data.results || data);
        setHasNext(Boolean(data.next));
        setHasPrevious(Boolean(data.previous));
      })
      .catch(err => {
        console.error(err);
        addToast('Failed to load jobs', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  if (loading) return (
    <div>
      <h2 className="text-2xl mb-4">Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonJob />
        <SkeletonJob />
        <SkeletonJob />
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl mb-4">Jobs</h2>
      <JobFilters onChange={(f) => { setPage(1); setFilters(f); }} />
      {jobs.length === 0 ? (
        <div className="bg-white p-6 rounded shadow">No jobs found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      <Pagination page={page} setPage={setPage} hasNext={hasNext} hasPrevious={hasPrevious} />
    </div>
  );
}
