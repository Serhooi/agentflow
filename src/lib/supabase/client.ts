import { createClient } from '@supabase/supabase-js';

// Check for environment variables and provide meaningful error messages during build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_REAL_URL;
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_REAL_URL is not defined. Please check your environment variables.');
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_REAL_ANON_KEY;
if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_REAL_ANON_KEY is not defined. Please check your environment variables.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Helper function to get user session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return data.session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return data.user;
};