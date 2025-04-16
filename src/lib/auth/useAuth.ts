'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (
    email: string,
    password: string,
    full_name: string,
    role: string,
    company: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError || !data.user) {
        return { success: false, error: signUpError?.message || 'Sign up failed' };
      }

      // Подпишемся на auth state
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                email,
                full_name,
                role,
                company,
              },
            ]);

          if (insertError) {
            console.error('Insert profile error:', insertError.message);
          }

          // Обязательно отписка
          subscription.unsubscribe();
        }
      });

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
