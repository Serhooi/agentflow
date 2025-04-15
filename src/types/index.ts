// Types for user roles
export type UserRole = 'agent' | 'broker' | 'admin';

// Types for subscription plans
export type SubscriptionPlan = 'solo' | 'team-5' | 'team-15' | 'custom';

// Types for content generation
export type ContentGoal = 'leads' | 'education' | 'trust' | 'referrals';
export type ContentTone = 'friendly' | 'expert' | 'educational' | 'motivational';
export type TargetAudience = 'first-time-buyers' | 'investors' | 'self-employed' | 'refinance';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  createdAt: string;
  lastActive?: string;
  plan?: SubscriptionPlan;
  stripeCustomerId?: string;
  teamId?: string;
}

// Team interface (for brokers)
export interface Team {
  id: string;
  name: string;
  brokerId: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt: string;
  updatedAt: string;
}

// Team member interface
export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  status: 'active' | 'pending' | 'inactive';
  invitedAt: string;
  joinedAt?: string;
}

// Content generation request interface
export interface ContentGenerationRequest {
  id: string;
  userId: string;
  region: string;
  audience: TargetAudience[];
  goal: ContentGoal;
  tone: ContentTone;
  createdAt: string;
}

// Generated content interface
export interface GeneratedContent {
  id: string;
  requestId: string;
  userId: string;
  socialPosts: string[];
  storyIdeas: string[];
  videoScript: string;
  ctaSuggestions: string[];
  createdAt: string;
}

// Subscription interface
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  createdAt: string;
  updatedAt: string;
}

// Invoice interface
export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl: string;
  invoicePdf: string;
  stripeInvoiceId: string;
  createdAt: string;
}
