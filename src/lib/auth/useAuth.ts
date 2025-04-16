import { useState } from 'react';
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
    try {
      setIsLoading(true);

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) {
        return { success: false, error: signUpError.message };
      }

      // 🎯 Делаем отдельный вызов, чтобы получить текущего пользователя
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        return { success: false, error: userError?.message || 'User not found after sign up' };
      }

      const user = userData.user;

      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id, // 🎯 вот оно!
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
