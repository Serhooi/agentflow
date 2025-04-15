'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['agent', 'broker', 'admin'] 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication check is complete and user is not logged in
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
    
    // If user is logged in but doesn't have the required role
    if (!isLoading && user && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect based on role
        if (user.role === 'agent') {
          router.push('/dashboard');
        } else if (user.role === 'broker') {
          router.push('/broker');
        } else if (user.role === 'admin') {
          router.push('/admin');
        }
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated and has the required role, render children
  if (user && (allowedRoles.length === 0 || allowedRoles.includes(user.role))) {
    return <>{children}</>;
  }

  // Otherwise, render nothing (will be redirected by the useEffect)
  return null;
}
