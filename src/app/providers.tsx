'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
