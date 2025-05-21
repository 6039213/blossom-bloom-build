
export default async function handler(req: Request) {
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only process POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    // Get prompt from request body
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the API key from environment variables or prompt the user
    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          message: 'Please set up your AI API key in the project settings'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Prepare system message and prompt
    const systemMessage = `You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS.
Generate a complete, functional website based on the user's prompt.
Respond with clear, properly formatted code blocks for each file using the format:
\`\`\`jsx src/components/ComponentName.jsx
// Code here
\`\`\`
Create clean, well-structured components with proper imports and exports.`;

    // Call the Claude API through our proxy
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20240229',
        max_tokens: 4000,
        system: systemMessage,
        prompt: `Create a beautiful, responsive website with React and Tailwind CSS for: ${prompt}. Include all necessary components and styling.`
      })
    });

    // Get the response as text first
    const text = await response.text();
    let data;
    
    // Safely parse the JSON
    try {
      data = response.headers.get('content-type')?.includes('json')
        ? JSON.parse(text)
        : { error: text };
    } catch (error) {
      console.error('Failed to parse response:', text.substring(0, 200));
      return new Response(
        JSON.stringify({ error: `Invalid JSON response: ${text.substring(0, 100)}...` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for API errors
    if (data.error) {
      console.error('API Error:', data.error);
      return new Response(
        JSON.stringify({ error: data.error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the generated content
    return new Response(
      JSON.stringify({ content: data.content[0].text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Generate website error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate website: ' + (error instanceof Error ? error.message : 'Unknown error') }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Handle OPTIONS method for CORS
export function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
