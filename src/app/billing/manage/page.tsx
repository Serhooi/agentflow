'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthContext';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
  invoiceUrl: string;
}

export default function BillingManagementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Fetch subscription and invoices data
    const fetchBillingData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch subscription data
        const subResponse = await fetch('/api/billing/subscription');
        if (!subResponse.ok) {
          throw new Error('Failed to fetch subscription data');
        }
        const subData = await subResponse.json();
        setSubscription(subData.subscription);
        
        // Fetch invoices data
        const invResponse = await fetch('/api/billing/invoices');
        if (!invResponse.ok) {
          throw new Error('Failed to fetch invoices data');
        }
        const invData = await invResponse.json();
        setInvoices(invData.invoices);
        
      } catch (err: any) {
        console.error('Error fetching billing data:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBillingData();
  }, []);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getPlanName = (planId: string) => {
    const planNames: Record<string, string> = {
      'solo': 'Solo Plan',
      'team-5': 'Team 5',
      'team-15': 'Team 15',
      'custom': 'Custom Plan'
    };
    
    return planNames[planId] || planId;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Billing & Subscription
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your subscription, payment methods, and billing history.
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button 
                onClick={() => router.push('/billing')}
                variant="outline"
                className="mr-2"
              >
                View Plans
              </Button>
              <Button 
                onClick={handleManageBilling}
                isLoading={isLoading}
              >
                Manage Payment Methods
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-12 text-center">
              <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500">Loading your billing information...</p>
            </div>
          ) : (
            <>
              {/* Current Subscription */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription>Your current subscription details</CardDescription>
                </CardHeader>
                <CardContent>
                  {subscription ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{getPlanName(subscription.plan)}</h3>
                          <p className="mt-1 text-sm text-gray-500">Status: <span className="font-medium capitalize">{subscription.status}</span></p>
                          {subscription.cancelAtPeriodEnd && (
                            <p className="mt-1 text-sm text-red-500">
                              Your subscription will be canceled on {formatDate(subscription.currentPeriodEnd)}
                            </p>
                          )}
                        </div>
                        <div className="mt-4 md:mt-0">
                          <p className="text-sm text-gray-500">
                            Next billing date: {formatDate(subscription.currentPeriodEnd)}
                          </p>
                          <div className="mt-2 flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleManageBilling}
                            >
                              {subscription.cancelAtPeriodEnd ? 'Reactivate Subscription' : 'Cancel Subscription'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">You don't have an active subscription.</p>
                      <Button 
                        className="mt-4"
                        onClick={() => router.push('/billing')}
                      >
                        View Subscription Plans
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View your past invoices and payment history</CardDescription>
                </CardHeader>
                <CardContent>
                  {invoices.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(invoice.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {invoice.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a 
                                  href={invoice.invoiceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  View Invoice
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No billing history available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
