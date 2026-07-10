import React, { useState } from 'react';

export default function JobFilters({ onChange }) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experience, setExperience] = useState('');

  const applyFilters = () => {
    onChange({ search, location, employment_type: employmentType, experience_level: experience });
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">All types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        <select value={experience} onChange={(e) => setExperience(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">Any experience</option>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-2 rounded">Apply</button>
        <button onClick={() => { setSearch(''); setLocation(''); setEmploymentType(''); setExperience(''); onChange({}); }} className="bg-gray-200 px-4 py-2 rounded">Clear</button>
      </div>
    </div>
  );
}
