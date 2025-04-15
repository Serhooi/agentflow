import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createCheckoutSession, createBillingPortalSession } from '@/lib/stripe/client';

// Create a checkout session for subscription
export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json();
    const { priceId, successUrl, cancelUrl } = body;
    
    // Validate required fields
    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the user's Stripe customer ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();
    
    if (userError || !userData?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'User not found or missing Stripe customer ID' },
        { status: 404 }
      );
    }
    
    // Create a checkout session
    const session = await createCheckoutSession(
      userData.stripe_customer_id,
      priceId,
      successUrl,
      cancelUrl
    );
    
    // Return the session URL
    return NextResponse.json({
      success: true,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Create a billing portal session
export async function GET(request: Request) {
  try {
    // Get the return URL from query params
    const { searchParams } = new URL(request.url);
    const returnUrl = searchParams.get('returnUrl');
    
    if (!returnUrl) {
      return NextResponse.json(
        { error: 'Missing return URL' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the user's Stripe customer ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();
    
    if (userError || !userData?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'User not found or missing Stripe customer ID' },
        { status: 404 }
      );
    }
    
    // Create a billing portal session
    const session = await createBillingPortalSession(
      userData.stripe_customer_id,
      returnUrl
    );
    
    // Return the session URL
    return NextResponse.json({
      success: true,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}
