'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useAuth() {
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: string,
    company: string
  ) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }

    // Ждём пока появится сессия
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setIsLoading(false);
      return { success: false, error: 'Auth session missing!' };
    }

    const user = session.user;

    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      email,
      full_name: fullName,
      role,
      company,
    });

    setIsLoading(false);

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return { success: true };
  };

  return { signUp, isLoading };
}
