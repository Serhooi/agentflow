'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'agent',
    company: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await signUp(
      formData.email,
      formData.password,
      formData.full_name,
      formData.role,
      formData.company
    );

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Failed to register user');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fc] px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">AgentFlow</h1>
      <h2 className="text-xl font-semibold mb-1">Create your account</h2>
      <p className="mb-4 text-gray-600">Already have an account? <a href="/auth/login" className="text-blue-600 underline">Sign in</a></p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">I am a</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="agent">Mortgage Agent</option>
            <option value="broker">Mortgage Broker</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          {isLoading ? 'Creating...' : 'Create Account'}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          By creating an account, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
        </p>
      </form>
    </div>
  );
}
