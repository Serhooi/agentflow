# Production Deployment Guide for AgentFlow

This document provides instructions for deploying the AgentFlow application to production with real API keys and environment variables.

## Prerequisites

Before deploying to production, ensure you have the following:

1. A Supabase account with a project set up
2. An OpenAI API key
3. Stripe account with API keys (publishable and secret)
4. A Vercel account for deployment

## Environment Variables

Update the `.env.production` file with the following real values:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-real-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-real-supabase-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=your-real-openai-api-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-real-stripe-publishable-key
STRIPE_SECRET_KEY=your-real-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-real-stripe-webhook-secret

# App Configuration
NEXT_PUBLIC_APP_URL=your-production-app-url
```

## Database Setup

1. Import the database schema from `database_schema.sql` into your Supabase project
2. Set up the appropriate row-level security policies as defined in the schema

## Stripe Configuration

1. Create products and price plans in your Stripe dashboard that match the pricing tiers in the application
2. Update the price IDs in the application code if necessary
3. Set up a webhook endpoint in your Stripe dashboard pointing to `your-production-app-url/api/webhook/stripe`

## Deployment Steps

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy the application

## Post-Deployment Verification

After deployment, verify the following:

1. User registration and login functionality
2. Content generation with OpenAI
3. Subscription management with Stripe
4. Team management for brokers
5. Admin dashboard functionality

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Vercel build logs for errors
2. Verify that all environment variables are correctly set
3. Ensure that the Supabase and Stripe configurations are correct
4. Check the browser console for client-side errors
5. Review server logs for API route errors

## Support

For additional support, please contact the development team.
