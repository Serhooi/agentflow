# AgentFlow Testing Guide

This guide provides instructions for testing the AgentFlow web application functionality.

## Prerequisites

Before testing, ensure you have:

1. Set up all environment variables in your `.env.local` file
2. Installed all dependencies with `npm install`
3. Started the development server with `npm run dev`

## Testing Checklist

### Authentication

- [ ] User Registration
  - [ ] Test registration with valid credentials
  - [ ] Test validation for required fields
  - [ ] Test error handling for duplicate email

- [ ] User Login
  - [ ] Test login with valid credentials
  - [ ] Test error handling for invalid credentials
  - [ ] Test "Remember me" functionality

- [ ] Authentication Protection
  - [ ] Test protected routes redirect to login when not authenticated
  - [ ] Test role-based access control (agent, broker, admin)

### Content Generation

- [ ] Content Generation Form
  - [ ] Test form validation
  - [ ] Test audience selection
  - [ ] Test goal and tone selection

- [ ] Content Generation API
  - [ ] Test API response format
  - [ ] Test error handling
  - [ ] Test performance with various inputs

- [ ] Generated Content Display
  - [ ] Test social media posts display
  - [ ] Test Instagram story ideas display
  - [ ] Test video script display
  - [ ] Test CTA suggestions display

- [ ] Content Export
  - [ ] Test PDF export functionality
  - [ ] Test copy-to-clipboard functionality

### Billing and Subscription

- [ ] Subscription Plans
  - [ ] Test plan display
  - [ ] Test subscription checkout flow
  - [ ] Test redirect after successful subscription

- [ ] Billing Management
  - [ ] Test current subscription display
  - [ ] Test invoice history display
  - [ ] Test subscription cancellation
  - [ ] Test payment method management

- [ ] Stripe Webhooks
  - [ ] Test subscription created event
  - [ ] Test subscription updated event
  - [ ] Test subscription deleted event
  - [ ] Test payment succeeded event
  - [ ] Test payment failed event

### User Management

- [ ] Dashboard
  - [ ] Test content history display
  - [ ] Test user statistics

- [ ] Broker Dashboard
  - [ ] Test team member display
  - [ ] Test team member invitation
  - [ ] Test team settings

- [ ] Admin Dashboard
  - [ ] Test user management
  - [ ] Test system statistics
  - [ ] Test user role management

## Performance Testing

- [ ] Test page load times
- [ ] Test content generation response time
- [ ] Test application under load

## Cross-Browser Testing

Test the application in the following browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Mobile Responsiveness

Test the application on the following devices:
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile phone

## Security Testing

- [ ] Test authentication security
- [ ] Test API endpoint security
- [ ] Test role-based access control

## Reporting Issues

When reporting issues, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots if applicable
5. Browser/device information
