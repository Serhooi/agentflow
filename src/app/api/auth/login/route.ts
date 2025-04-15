import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json();
    const { email, password } = body;
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createServerSupabaseClient();
    
    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    // Get the user's role and other details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, role, company')
      .eq('id', data.user.id)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }
    
    // Return success response with user data
    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: data.user.email,
        name: userData.name,
        role: userData.role,
        company: userData.company,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Error signing in:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}
