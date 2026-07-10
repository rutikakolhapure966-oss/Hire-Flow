import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('auth/register/', data);
      const { access, refresh } = res.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Create an account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" {...register('email', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.email && <span className="text-red-500">Email is required</span>}
        </div>
        <div>
          <label className="block text-sm">First name</label>
          <input {...register('first_name')} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Last name</label>
          <input {...register('last_name')} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" {...register('password', { required: true, minLength: 8 })} className="w-full border px-3 py-2 rounded" />
          {errors.password && <span className="text-red-500">Password is required (min 8)</span>}
        </div>
        <div>
          <label className="block text-sm">Confirm Password</label>
          <input type="password" {...register('password_confirm', { required: true, minLength: 8 })} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Role</label>
          <select {...register('role', { required: true })} className="w-full border px-3 py-2 rounded">
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Create Account</button>
      </form>
    </div>
  );
}
