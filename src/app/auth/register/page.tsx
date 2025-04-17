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
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">Create your account</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" required className="w-full px-3 py-2 border rounded" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full px-3 py-2 border rounded" />
        <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" required className="w-full px-3 py-2 border rounded" />
        <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="Confirm Password" required className="w-full px-3 py-2 border rounded" />
        <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="w-full px-3 py-2 border rounded" />

        <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded">
          <option value="agent">Mortgage Agent</option>
          <option value="broker">Mortgage Broker</option>
        </select>

        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {isLoading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
