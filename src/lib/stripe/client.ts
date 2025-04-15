import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Use the latest API version
});

// Function to create a customer in Stripe
export async function createCustomer(email: string, name: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'agentflow',
      },
    });
    
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create customer in Stripe');
  }
}

// Function to create a subscription
export async function createSubscription(
  customerId: string,
  priceId: string,
  trialDays: number = 7
) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialDays,
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });
    
    return subscription;
  } catch (error) {
    console.error('Error creating Stripe subscription:', error);
    throw new Error('Failed to create subscription');
  }
}

// Function to create a checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        trial_period_days: 7,
      },
    });
    
    return session;
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

// Function to create a billing portal session
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    return session;
  } catch (error) {
    console.error('Error creating Stripe billing portal session:', error);
    throw new Error('Failed to create billing portal session');
  }
}

// Function to cancel a subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    
    return subscription;
  } catch (error) {
    console.error('Error canceling Stripe subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

// Function to reactivate a subscription
export async function reactivateSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    
    return subscription;
  } catch (error) {
    console.error('Error reactivating Stripe subscription:', error);
    throw new Error('Failed to reactivate subscription');
  }
}

// Function to get a subscription
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving Stripe subscription:', error);
    throw new Error('Failed to retrieve subscription');
  }
}

// Function to get a customer
export async function getCustomer(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error('Error retrieving Stripe customer:', error);
    throw new Error('Failed to retrieve customer');
  }
}

// Function to get invoices for a customer
export async function getInvoices(customerId: string) {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 10,
    });
    
    return invoices;
  } catch (error) {
    console.error('Error retrieving Stripe invoices:', error);
    throw new Error('Failed to retrieve invoices');
  }
}

// Export Stripe instance for direct use
export { stripe };
