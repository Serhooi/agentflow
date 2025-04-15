import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import Stripe from 'stripe';

// Use the new route segment config format
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Get the raw body
    const rawBody = await request.text();
    
    // Get the Stripe signature from headers
    const signature = request.headers.get('stripe-signature') as string;
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }
    
    // Verify the webhook signature
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createServerSupabaseClient();
    
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get the customer ID
        const customerId = subscription.customer as string;
        
        // Get the user with this Stripe customer ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();
        
        if (userError || !userData) {
          console.error('User not found for Stripe customer ID:', customerId);
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        
        // Determine the plan based on the price ID
        const priceId = subscription.items.data[0].price.id;
        let plan = 'solo';
        
        // Map price IDs to plans (these would be your actual price IDs from Stripe)
        const pricePlans: Record<string, string> = {
          'price_solo': 'solo',
          'price_team_5': 'team-5',
          'price_team_15': 'team-15',
          'price_custom': 'custom',
        };
        
        // Get the plan from the price ID mapping or default to solo
        if (priceId in pricePlans) {
          plan = pricePlans[priceId];
        }
        
        // Update the user's subscription in the database
        const { error: updateError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userData.id,
            stripe_subscription_id: subscription.id,
            plan,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });
        
        if (updateError) {
          console.error('Error updating subscription:', updateError);
          return NextResponse.json(
            { error: 'Failed to update subscription' },
            { status: 500 }
          );
        }
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get the subscription ID
        const subscriptionId = subscription.id;
        
        // Update the subscription status in the database
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
          })
          .eq('stripe_subscription_id', subscriptionId);
        
        if (updateError) {
          console.error('Error updating subscription status:', updateError);
          return NextResponse.json(
            { error: 'Failed to update subscription status' },
            { status: 500 }
          );
        }
        
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Get the customer ID
        const customerId = invoice.customer as string;
        
        // Get the user with this Stripe customer ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();
        
        if (userError || !userData) {
          console.error('User not found for Stripe customer ID:', customerId);
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        
        // Save the invoice to the database
        const { error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            user_id: userData.id,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'paid',
            invoice_url: invoice.hosted_invoice_url || '',
            invoice_pdf: invoice.invoice_pdf || '',
          });
        
        if (invoiceError) {
          console.error('Error saving invoice:', invoiceError);
          return NextResponse.json(
            { error: 'Failed to save invoice' },
            { status: 500 }
          );
        }
        
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Get the customer ID
        const customerId = invoice.customer as string;
        
        // Get the user with this Stripe customer ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();
        
        if (userError || !userData) {
          console.error('User not found for Stripe customer ID:', customerId);
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        
        // Save the invoice to the database
        const { error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            user_id: userData.id,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: 'failed',
            invoice_url: invoice.hosted_invoice_url || '',
            invoice_pdf: invoice.invoice_pdf || '',
          });
        
        if (invoiceError) {
          console.error('Error saving invoice:', invoiceError);
          return NextResponse.json(
            { error: 'Failed to save invoice' },
            { status: 500 }
          );
        }
        
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Return a success response
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    return NextResponse.json(
      { error: 'Failed to handle webhook' },
      { status: 500 }
    );
  }
}
