'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

/**
 * useAuth is a custom React hook for handling user sign-up with Supabase.
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (
    email: string,
    password: string,
    full_name: string,
    role: string,
    company: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Create Supabase user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError || !data.user) {
        return { success: false, error: signUpError?.message || 'Sign up failed' };
      }

      // Extract user ID (required for RLS insert!)
      const userId = data.user.id;

      // Insert corresponding row into profiles table
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,          // ✅ Required for RLS!
            email,
            full_name,
            role,
            company
          }
        ]);

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      return { success: false, error: 'Unexpected error during sign up' };
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading };
};
