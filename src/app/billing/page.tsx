'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthContext';

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  maxAgents?: number;
}

export default function BillingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Mock plans data - in a real app, this would come from the API
  const plans: Plan[] = [
    {
      id: 'price_solo',
      name: 'Solo Plan',
      price: '$39',
      description: 'Perfect for individual mortgage agents',
      features: [
        'Unlimited content generation',
        'PDF export',
        'Email delivery',
        'Generation history'
      ]
    },
    {
      id: 'price_team_5',
      name: 'Team 5',
      price: '$149',
      description: 'For small brokerages with up to 5 agents',
      features: [
        'All Solo Plan features',
        'Up to 5 agent accounts',
        'Team analytics',
        'Brand customization'
      ],
      isPopular: true,
      maxAgents: 5
    },
    {
      id: 'price_team_15',
      name: 'Team 15',
      price: '$299',
      description: 'For medium brokerages with up to 15 agents',
      features: [
        'All Team 5 features',
        'Up to 15 agent accounts',
        'Priority support',
        'Advanced analytics'
      ],
      maxAgents: 15
    },
    {
      id: 'price_custom',
      name: 'Custom',
      price: 'Contact us',
      description: 'For large brokerages with custom requirements',
      features: [
        'All Team 15 features',
        'Unlimited agent accounts',
        'Dedicated account manager',
        'Custom integrations'
      ]
    }
  ];

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Call the API to create a checkout session
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/billing?subscription=canceled`,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Call the API to create a billing portal session
      const response = await fetch(`/api/billing?returnUrl=${encodeURIComponent(window.location.href)}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create billing portal session');
      }
      
      // Redirect to Stripe Billing Portal
      window.location.href = data.url;
      
    } catch (err: any) {
      console.error('Error creating billing portal session:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Subscription Plans
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Choose the plan that best fits your needs.
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button 
                variant="outline" 
                onClick={handleManageBilling}
                isLoading={isLoading}
              >
                Manage Subscription
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-lg border ${
                  plan.isPopular ? 'border-blue-600' : 'border-gray-200'
                } bg-white p-6 shadow-sm`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                      Popular
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-4 text-2xl font-bold text-gray-900">{plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Button 
                    variant="default" 
                    fullWidth={true}
                    isLoading={isLoading}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {plan.id === 'price_custom' ? 'Contact Sales' : 'Subscribe'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Subscription FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Do you offer a free trial?</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Yes, all plans come with a 7-day free trial. You can cancel anytime during the trial period and you won't be charged.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Can I change plans later?</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Yes, you can upgrade or downgrade your plan at any time. Changes will be applied immediately, and your billing will be prorated accordingly.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">How does team billing work?</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Team plans are billed to the broker who can then invite agents to join their team. The broker is responsible for all payments.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
