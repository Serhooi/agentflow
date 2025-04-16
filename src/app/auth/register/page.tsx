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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" required />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" required />
      <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="Confirm Password" required />
      <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" />
      
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="agent">Mortgage Agent</option>
        <option value="broker">Mortgage Broker</option>
      </select>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  );
}
