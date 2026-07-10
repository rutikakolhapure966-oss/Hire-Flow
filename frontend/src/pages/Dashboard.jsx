import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('auth/user/')
      .then(res => {
        const role = res.data.role;
        if (role === 'recruiter') return api.get('dashboard/recruiter/');
        return api.get('dashboard/candidate/');
      })
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!data) return <div>No dashboard data</div>;

  const appsPerMonth = data.applications_per_month || [];
  const appsByStatusObj = data.applications_by_status || {};
  const appsByStatus = Object.keys(appsByStatusObj).map((k, i) => ({ name: k, value: appsByStatusObj[k], color: COLORS[i % COLORS.length] }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Total Jobs</h4>
          <div className="text-2xl font-bold">{data.total_jobs ?? data.total_applications ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Active Jobs</h4>
          <div className="text-2xl font-bold">{data.active_jobs ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Applications</h4>
          <div className="text-2xl font-bold">{data.total_applications ?? data.total_applications ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow" style={{ height: 320 }}>
          <h4 className="mb-2">Applications Per Month</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={appsPerMonth.reverse()} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow" style={{ height: 320 }}>
          <h4 className="mb-2">Applications by Status</h4>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={appsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {appsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
