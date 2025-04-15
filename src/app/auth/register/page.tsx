'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

/**
 * useAuth is a custom React hook for handling user sign-up with Supabase.
 * It manages registration and inserts profile details into the 'profiles' table.
 * Returns the signUp function and isLoading state.
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Registers a new user using Supabase Auth and stores additional user profile data.
   *
   * @param email - User's email address
   * @param password - User's chosen password
   * @param full_name - User's full name
   * @param role - User's selected role (e.g., agent or broker)
   * @param company - Name of the company the user belongs to
   * @returns Promise with success status and optional error message
   */
  const signUp = async (
    email: string,
    password: string,
    full_name: string,
    role: string,
    company: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Step 1: Sign up the user with email and password
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError || !data.user) {
        return {
          success: false,
          error: signUpError?.message || 'Sign up failed'
        };
      }

      const user = data.user;

      // Step 2: Insert user profile data into the 'profiles' table
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email,
            full_name,
            role,
            company
          }
        ]);

      if (insertError) {
        return {
          success: false,
          error: insertError.message
        };
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
