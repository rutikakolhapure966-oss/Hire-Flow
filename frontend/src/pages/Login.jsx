import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('auth/login/', data);
      const { access, refresh } = res.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" {...register('email', { required: true })} className="w-full border px-3 py-2 rounded" />
          {errors.email && <span className="text-red-500">Email is required</span>}
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" {...register('password', { required: true })} className="w-full border px-3 py-2 rounded" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
