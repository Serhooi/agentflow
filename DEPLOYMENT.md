# AgentFlow Deployment Guide

This guide provides instructions for deploying the AgentFlow web application to Vercel.

## Prerequisites

Before deploying, you'll need:

1. A Vercel account
2. A Supabase account with a project set up
3. An OpenAI API key
4. A Stripe account with API keys

## Environment Variables

Set up the following environment variables in your Vercel project:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-vercel-app-url.vercel.app
```

## Supabase Database Setup

Create the following tables in your Supabase database:

1. `users` - Store user information
2. `teams` - Store team information for brokers
3. `team_members` - Store team member relationships
4. `content_generation_requests` - Store content generation requests
5. `generated_contents` - Store generated content
6. `subscriptions` - Store subscription information
7. `invoices` - Store invoice information

## Deployment Steps

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the application:
   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

## Stripe Webhook Setup

After deployment, set up a Stripe webhook pointing to:
```
https://your-vercel-app-url.vercel.app/api/webhook/stripe
```

Add the following events to the webhook:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Post-Deployment Verification

After deployment, verify the following:

1. User registration and login functionality
2. Content generation
3. Subscription management
4. Webhook handling

## Troubleshooting

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Check Supabase database tables and permissions
4. Verify Stripe webhook configuration
