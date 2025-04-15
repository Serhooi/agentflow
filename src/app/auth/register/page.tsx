'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/useAuth'; // ✅ вот отсюда ты вызываешь хук

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'agent',
    company: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      setError(result.error || 'Failed to register');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">Sign in</Link>
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 text-red-700 bg-red-100 p-2 rounded">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="full_name" label="Full Name" value={formData.full_name} onChange={handleChange} required />
              <Input name="email" type="email" label="Email" value={formData.email} onChange={handleChange} required />
              <Input name="password" type="password" label="Password" value={formData.password} onChange={handleChange} required />
              <Input name="confirmPassword" type="password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
              <Select name="role" label="I am a" value={formData.role} onChange={handleChange}
                options={[
                  { value: 'agent', label: 'Mortgage Agent' },
                  { value: 'broker', label: 'Mortgage Broker' }
                ]}
              />
              <Input name="company" label="Company" value={formData.company} onChange={handleChange} />
              <Button type="submit" fullWidth isLoading={isLoading}>Create Account</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
