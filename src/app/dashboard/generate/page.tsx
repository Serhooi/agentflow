'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthContext';
import { ContentGoal, ContentTone, TargetAudience } from '@/types';
import { jsPDF } from 'jspdf';

export default function GenerateContentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    region: '',
    audience: [] as string[],
    goal: 'leads' as ContentGoal,
    tone: 'friendly' as ContentTone,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAudienceChange = (audience: string) => {
    setFormData(prev => {
      const currentAudiences = [...prev.audience];
      
      if (currentAudiences.includes(audience)) {
        return {
          ...prev,
          audience: currentAudiences.filter(a => a !== audience)
        };
      } else {
        return {
          ...prev,
          audience: [...currentAudiences, audience]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setGeneratedContent(null);
    
    // Validate form
    if (!formData.region) {
      setError('Please enter your region');
      return;
    }
    
    if (formData.audience.length === 0) {
      setError('Please select at least one target audience');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call the API to generate content
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }
      
      setSuccess(true);
      setGeneratedContent(data.data);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err: any) {
      console.error('Error generating content:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const handleExportPDF = () => {
    if (!generatedContent) return;

    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);

    // Add title
    doc.setFontSize(18);
    doc.text('AgentFlow Generated Content', margin, yPos);
    yPos += lineHeight * 2;

    // Add metadata
    doc.setFontSize(12);
    doc.text(`Region: ${formData.region}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Audience: ${formData.audience.join(', ')}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Goal: ${formData.goal}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Tone: ${formData.tone}`, margin, yPos);
    yPos += lineHeight * 2;

    // Social Media Posts
    doc.setFontSize(16);
    doc.text('Social Media Posts', margin, yPos);
    yPos += lineHeight * 1.5;
    doc.setFontSize(10);

    generatedContent.socialPosts.forEach((post: string, index: number) => {
      const splitText = doc.splitTextToSize(post, contentWidth);
      
      // Check if we need a new page
      if (yPos + (splitText.length * lineHeight) > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.text(`${index + 1}. ${splitText.join('\n')}`, margin, yPos);
      yPos += (splitText.length * lineHeight) + lineHeight;
    });

    yPos += lineHeight;

    // Instagram Story Ideas
    doc.setFontSize(16);
    doc.text('Instagram Story Ideas', margin, yPos);
    yPos += lineHeight * 1.5;
    doc.setFontSize(10);

    generatedContent.storyIdeas.forEach((story: string, index: number) => {
      const splitText = doc.splitTextToSize(story, contentWidth);
      
      // Check if we need a new page
      if (yPos + (splitText.length * lineHeight) > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.text(`${index + 1}. ${splitText.join('\n')}`, margin, yPos);
      yPos += (splitText.length * lineHeight) + lineHeight;
    });

    yPos += lineHeight;

    // Video Script
    doc.setFontSize(16);
    doc.text('Video Script', margin, yPos);
    yPos += lineHeight * 1.5;
    doc.setFontSize(10);

    const videoScriptLines = doc.splitTextToSize(generatedContent.videoScript, contentWidth);
    
    // Check if we need a new page
    if (yPos + (videoScriptLines.length * lineHeight) > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.text(videoScriptLines, margin, yPos);
    yPos += (videoScriptLines.length * lineHeight) + lineHeight * 2;

    // CTA Suggestions
    doc.setFontSize(16);
    doc.text('Call-to-Action Suggestions', margin, yPos);
    yPos += lineHeight * 1.5;
    doc.setFontSize(10);

    generatedContent.ctaSuggestions.forEach((cta: string, index: number) => {
      const splitText = doc.splitTextToSize(cta, contentWidth);
      
      // Check if we need a new page
      if (yPos + (splitText.length * lineHeight) > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.text(`${index + 1}. ${splitText.join('\n')}`, margin, yPos);
      yPos += (splitText.length * lineHeight) + lineHeight;
    });

    // Add footer with date and user info
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    doc.setFontSize(8);
    doc.text(`Generated by AgentFlow on ${dateStr} for ${user?.name || 'User'}`, margin, doc.internal.pageSize.getHeight() - 10);

    // Save the PDF
    doc.save(`AgentFlow_Content_${dateStr.replace(/\//g, '-')}.pdf`);
  };

  const handleEmailContent = () => {
    if (!generatedContent || !user) return;
    
    // This would typically call an API endpoint to send an email
    alert('Email functionality will be implemented in the next phase.');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Generate Content
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create engaging social media posts, story ideas, and video scripts for your mortgage business.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Content Settings</CardTitle>
                  <CardDescription>
                    Customize your content to match your target audience and goals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                      {error}
                    </div>
                  )}
                  
                  {success && !error && (
                    <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                      Content generated successfully!
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      id="region"
                      name="region"
                      label="Your Region"
                      placeholder="e.g., Toronto, Vancouver, Montreal"
                      value={formData.region}
                      onChange={handleInputChange}
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Audience
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            id="audience-first-time"
                            checked={formData.audience.includes('first-time-buyers')}
                            onCheckedChange={() => handleAudienceChange('first-time-buyers')}
                          />
                          <label htmlFor="audience-first-time" className="ml-2 text-sm text-gray-700">
                            First-time Home Buyers
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <Checkbox
                            id="audience-investors"
                            checked={formData.audience.includes('investors')}
                            onCheckedChange={() => handleAudienceChange('investors')}
                          />
                          <label htmlFor="audience-investors" className="ml-2 text-sm text-gray-700">
                            Real Estate Investors
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <Checkbox
                            id="audience-self-employed"
                            checked={formData.audience.includes('self-employed')}
                            onCheckedChange={() => handleAudienceChange('self-employed')}
                          />
                          <label htmlFor="audience-self-employed" className="ml-2 text-sm text-gray-700">
                            Self-employed Borrowers
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <Checkbox
                            id="audience-refinance"
                            checked={formData.audience.includes('refinance')}
                            onCheckedChange={() => handleAudienceChange('refinance')}
                          />
                          <label htmlFor="audience-refinance" className="ml-2 text-sm text-gray-700">
                            Refinance Clients
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <Select
                      id="goal"
                      name="goal"
                      label="Content Goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      options={[
                        { value: 'leads', label: 'Generate Leads' },
                        { value: 'education', label: 'Educate Clients' },
                        { value: 'trust', label: 'Build Trust' },
                        { value: 'referrals', label: 'Get Referrals' },
                      ]}
                    />
                    
                    <Select
                      id="tone"
                      name="tone"
                      label="Content Tone"
                      value={formData.tone}
                      onChange={handleInputChange}
                      options={[
                        { value: 'friendly', label: 'Friendly & Approachable' },
                        { value: 'expert', label: 'Expert & Professional' },
                        { value: 'educational', label: 'Educational & Informative' },
                        { value: 'motivational', label: 'Motivational & Inspiring' },
                      ]}
                    />
                    
                    <Button type="submit" fullWidth={true} isLoading={isLoading}>
                      Generate Content
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <div id="results">
                {generatedContent ? (
                  <div className="space-y-8">
                    {/* Social Media Posts */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Social Media Posts</CardTitle>
                        <CardDescription>
                          Ready-to-use posts for your social media platforms.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {generatedContent.socialPosts.map((post: string, index: number) => (
                            <div key={index} className="p-4 bg-white border rounded-lg">
                              <p className="text-gray-800">{post}</p>
                              <div className="mt-2 flex justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleCopyText(post)}
                                >
                                  Copy
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Instagram Story Ideas */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Instagram Story Ideas</CardTitle>
                        <CardDescription>
                          Creative ideas for engaging Instagram stories.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {generatedContent.storyIdeas.map((story: string, index: number) => (
                            <div key={index} className="p-4 bg-white border rounded-lg">
                              <p className="text-gray-800">{story}</p>
                              <div className="mt-2 flex justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleCopyText(story)}
                                >
                                  Copy
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Video Script */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Video Script</CardTitle>
                        <CardDescription>
                          Script for a short video for Reels or TikTok.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-white border rounded-lg">
                          <p className="text-gray-800 whitespace-pre-line">{generatedContent.videoScript}</p>
                          <div className="mt-2 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCopyText(generatedContent.videoScript)}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* CTA Suggestions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Call-to-Action Suggestions</CardTitle>
                        <CardDescription>
                          Effective CTAs to drive engagement and conversions.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {generatedContent.ctaSuggestions.map((cta: string, index: number) => (
                            <div key={index} className="p-4 bg-white border rounded-lg">
                              <p className="text-gray-800">{cta}</p>
                              <div className="mt-2 flex justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleCopyText(cta)}
                                >
                                  Copy
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Export Options */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Export Options</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-4">
                          <Button onClick={handleExportPDF}>
                            Export as PDF
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={handleEmailContent}
                          >
                            Email to Me
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-900">No content generated yet</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill out the form and click "Generate Content" to create your custom mortgage content.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
