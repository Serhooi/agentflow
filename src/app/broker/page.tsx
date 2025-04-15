'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
  contentCount: number;
}

export default function BrokerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch agents
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        // This will be replaced with actual API call in backend implementation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockAgents: Agent[] = [
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            status: 'active',
            lastActive: 'Today at 10:45 AM',
            contentCount: 12
          },
          {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.chen@example.com',
            status: 'active',
            lastActive: 'Yesterday at 3:20 PM',
            contentCount: 8
          },
          {
            id: '3',
            name: 'Jessica Williams',
            email: 'jessica.williams@example.com',
            status: 'pending',
            lastActive: 'Never',
            contentCount: 0
          }
        ];
        
        setAgents(mockAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleInviteAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    
    try {
      // This will be replaced with actual API call in backend implementation
      console.log('Inviting agent:', inviteEmail);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add mock invited agent to the list
      const newAgent: Agent = {
        id: `${agents.length + 1}`,
        name: 'New Agent',
        email: inviteEmail,
        status: 'pending',
        lastActive: 'Never',
        contentCount: 0
      };
      
      setAgents([...agents, newAgent]);
      setInviteEmail('');
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Error inviting agent:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Broker Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your team of mortgage agents and monitor their activity.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link href="/broker/settings">
              <Button variant="outline">Team Settings</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Team Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>Summary of your team's activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{agents.filter(a => a.status === 'active').length}</p>
                  <p className="text-sm text-gray-500">Active Agents</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{agents.reduce((sum, agent) => sum + agent.contentCount, 0)}</p>
                  <p className="text-sm text-gray-500">Total Content</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{agents.filter(a => a.status === 'pending').length}</p>
                  <p className="text-sm text-gray-500">Pending Invites</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">5</p>
                  <p className="text-sm text-gray-500">Team Capacity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invite Agent Card */}
          <Card>
            <CardHeader>
              <CardTitle>Invite Agent</CardTitle>
              <CardDescription>Add a new agent to your team</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInviteAgent} className="space-y-4">
                <Input
                  id="inviteEmail"
                  label="Agent Email"
                  type="email"
                  placeholder="agent@example.com"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button 
                  type="submit" 
                  fullWidth={true} 
                  isLoading={isInviting}
                  disabled={isInviting || !inviteEmail}
                >
                  Send Invitation
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current plan details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Team 5 Plan</h3>
                <p className="mt-1 text-sm text-gray-500">$149/month</p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="mt-2 text-xs text-gray-500">3 of 5 agent seats used</p>
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

        {/* Agents Table */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Agents</CardTitle>
              <CardDescription>Manage and monitor your team members</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-12 text-center">
                  <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Loading your agents...</p>
                </div>
              ) : agents.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-500">You haven't added any agents yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agent
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Content Generated
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {agents.map((agent) => (
                        <tr key={agent.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-medium">{agent.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                                <div className="text-sm text-gray-500">{agent.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              agent.status === 'active' ? 'bg-green-100 text-green-800' : 
                              agent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {agent.lastActive}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {agent.contentCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/broker/agents/${agent.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                              View
                            </Link>
                            {agent.status === 'pending' ? (
                              <button className="text-red-600 hover:text-red-900">
                                Resend
                              </button>
                            ) : (
                              <button className="text-red-600 hover:text-red-900">
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Brand Assets Card */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Brand Assets</CardTitle>
              <CardDescription>Customize your team's branding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Logo</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload your company logo
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Upload Logo
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Colors</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-blue-600 mr-2"></div>
                        <Input
                          id="primaryColor"
                          type="text"
                          value="#2563EB"
                          readOnly
                        />
                        <Button variant="outline" size="sm" className="ml-2">
                          Change
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-gray-800 mr-2"></div>
                        <Input
                          id="secondaryColor"
                          type="text"
                          value="#1F2937"
                          readOnly
                        />
                        <Button variant="outline" size="sm" className="ml-2">
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Brand Settings</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
