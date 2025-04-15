import { supabase } from '@/lib/supabase/client';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (
    email: string,
    password: string,
    full_name: string,
    role: string,
    company: string
  ) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error || !data.user) {
      setIsLoading(false);
      return { success: false, error: error?.message };
    }

    const user = data.user;

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

    setIsLoading(false);

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return { success: true };
  };

  return { signUp, isLoading };
};
