'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

interface ContentItem {
  id: string;
  date: string;
  type: string;
  title: string;
  preview: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentHistory, setContentHistory] = useState<ContentItem[]>([]);

  useEffect(() => {
    // Simulate API call to fetch content history
    const fetchContentHistory = async () => {
      setIsLoading(true);
      try {
        // This will be replaced with actual API call in backend implementation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData: ContentItem[] = [
          {
            id: '1',
            date: 'April 12, 2025',
            type: 'Social Media',
            title: 'First-Time Home Buyers Campaign',
            preview: '7 posts, 3 stories, 1 video script'
          },
          {
            id: '2',
            date: 'April 10, 2025',
            type: 'Social Media',
            title: 'Mortgage Refinancing Benefits',
            preview: '7 posts, 3 stories, 1 video script'
          },
          {
            id: '3',
            date: 'April 5, 2025',
            type: 'Social Media',
            title: 'Self-Employed Mortgage Options',
            preview: '7 posts, 3 stories, 1 video script'
          }
        ];
        
        setContentHistory(mockData);
      } catch (error) {
        console.error('Error fetching content history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Generate new content or view your previous generations.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link href="/dashboard/generate">
              <Button>Generate New Content</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Content Generation History</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your previously generated content is available here.
            </p>
          </div>
          
          {isLoading ? (
            <div className="px-4 py-12 text-center">
              <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500">Loading your content history...</p>
            </div>
          ) : contentHistory.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-gray-500">You haven't generated any content yet.</p>
              <div className="mt-6">
                <Link href="/dashboard/generate">
                  <Button>Generate Your First Content</Button>
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {contentHistory.map((item) => (
                <li key={item.id}>
                  <Link href={`/dashboard/content/${item.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-blue-600 truncate">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.type} • {item.preview}</p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {item.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Your content generation usage this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600">3</p>
                <p className="mt-2 text-sm text-gray-500">generations used</p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <p className="mt-2 text-xs text-gray-500">3 of 20 included in your plan</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Get the most out of AgentFlow</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Be specific about your target audience for better results
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Try different tones to see what resonates with your audience
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Download your content as PDF for easy reference
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/help" className="text-sm text-blue-600 hover:text-blue-500">
                View all tips →
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current plan details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Solo Plan</h3>
                <p className="mt-1 text-sm text-gray-500">$39/month</p>
                <p className="mt-4 text-xs text-gray-500">Renews on May 13, 2025</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/billing">
                <Button variant="outline" size="sm">Manage Subscription</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
