import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createCustomer } from '@/lib/stripe/client';

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json();
    const { email, password, name, role, company } = body;
    
    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createServerSupabaseClient();
    
    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          company,
        },
      },
    });
    
    if (authError) {
      console.error('Error registering user:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }
    
    // Create a Stripe customer
    const customer = await createCustomer(email, name);
    
    // Save the user to the database with Stripe customer ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
        email,
        name,
        role,
        company,
        stripe_customer_id: customer.id,
      })
      .select()
      .single();
    
    if (userError) {
      console.error('Error saving user to database:', userError);
      return NextResponse.json(
        { error: 'Failed to save user to database' },
        { status: 500 }
      );
    }
    
    // If the user is a broker, create a team
    if (role === 'broker') {
      const teamName = company || `${name}'s Team`;
      
      const { error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamName,
          broker_id: authData.user?.id,
        });
      
      if (teamError) {
        console.error('Error creating team:', teamError);
        return NextResponse.json(
          { error: 'Failed to create team' },
          { status: 500 }
        );
      }
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
