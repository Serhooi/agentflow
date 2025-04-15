import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateContent } from '@/lib/openai/client';
import { ContentGenerationRequest, GeneratedContent } from '@/types';

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json();
    const { region, audience, goal, tone } = body;
    
    // Validate required fields
    if (!region || !audience || !goal || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createServerSupabaseClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Generate content using OpenAI
    const generatedContent = await generateContent(region, audience, goal, tone);
    
    // Save the content generation request to the database
    const { data: requestData, error: requestError } = await supabase
      .from('content_generation_requests')
      .insert({
        user_id: user.id,
        region,
        audience,
        goal,
        tone,
      })
      .select()
      .single();
    
    if (requestError) {
      console.error('Error saving content generation request:', requestError);
      return NextResponse.json(
        { error: 'Failed to save content generation request' },
        { status: 500 }
      );
    }
    
    // Save the generated content to the database
    const { data: contentData, error: contentError } = await supabase
      .from('generated_contents')
      .insert({
        request_id: requestData.id,
        user_id: user.id,
        social_posts: generatedContent.socialPosts,
        story_ideas: generatedContent.storyIdeas,
        video_script: generatedContent.videoScript,
        cta_suggestions: generatedContent.ctaSuggestions,
      })
      .select()
      .single();
    
    if (contentError) {
      console.error('Error saving generated content:', contentError);
      return NextResponse.json(
        { error: 'Failed to save generated content' },
        { status: 500 }
      );
    }
    
    // Return the generated content
    return NextResponse.json({
      success: true,
      data: {
        id: contentData.id,
        requestId: requestData.id,
        socialPosts: generatedContent.socialPosts,
        storyIdeas: generatedContent.storyIdeas,
        videoScript: generatedContent.videoScript,
        ctaSuggestions: generatedContent.ctaSuggestions,
      }
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
