import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Function to generate content using OpenAI
export async function generateContent(
  region: string,
  audience: string[],
  goal: string,
  tone: string
) {
  try {
    // Format the audience array into a comma-separated string
    const audienceString = audience.join(', ');
    
    // Construct the prompt based on the requirements
    const prompt = `You are a Canadian mortgage marketing expert.

Generate the following for this agent:

Location: ${region}
Target audience: ${audienceString}
Goal: ${goal}
Tone: ${tone}

Output:
1. 7 social media posts (short, specific, engaging)
2. 3 Instagram story ideas (including questions or polls)
3. 1 short video script idea (for Reels or TikTok)
4. CTA suggestions

Make content relevant for a Canadian audience and mortgage industry. Avoid repetition. Each post should be different and practical.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a Canadian mortgage marketing expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Parse the response
    const content = response.choices[0]?.message?.content || '';
    
    // Process the content to extract the different sections
    const sections = processGeneratedContent(content);
    
    return sections;
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}

// Helper function to process the generated content
function processGeneratedContent(content: string) {
  // Initialize result object
  const result = {
    socialPosts: [] as string[],
    storyIdeas: [] as string[],
    videoScript: '',
    ctaSuggestions: [] as string[]
  };

  // Split content by sections
  const lines = content.split('\n');
  
  let currentSection = '';
  
  for (const line of lines) {
    if (line.includes('social media posts') || line.match(/^1\./)) {
      currentSection = 'socialPosts';
      continue;
    } else if (line.includes('Instagram story ideas') || line.match(/^2\./)) {
      currentSection = 'storyIdeas';
      continue;
    } else if (line.includes('video script') || line.match(/^3\./)) {
      currentSection = 'videoScript';
      continue;
    } else if (line.includes('CTA suggestions') || line.match(/^4\./)) {
      currentSection = 'ctaSuggestions';
      continue;
    }

    // Skip empty lines
    if (!line.trim()) continue;

    // Process based on current section
    if (currentSection === 'socialPosts') {
      // Check if line starts with a number or bullet point
      if (line.match(/^(\d+\.|\-|\*)/)) {
        const post = line.replace(/^(\d+\.|\-|\*)\s*/, '').trim();
        if (post) result.socialPosts.push(post);
      }
    } else if (currentSection === 'storyIdeas') {
      if (line.match(/^(\d+\.|\-|\*)/)) {
        const story = line.replace(/^(\d+\.|\-|\*)\s*/, '').trim();
        if (story) result.storyIdeas.push(story);
      }
    } else if (currentSection === 'videoScript') {
      result.videoScript += line + '\n';
    } else if (currentSection === 'ctaSuggestions') {
      if (line.match(/^(\d+\.|\-|\*)/)) {
        const cta = line.replace(/^(\d+\.|\-|\*)\s*/, '').trim();
        if (cta) result.ctaSuggestions.push(cta);
      }
    }
  }

  // Trim video script
  result.videoScript = result.videoScript.trim();

  return result;
}

export default openai;
