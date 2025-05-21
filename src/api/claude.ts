// Standard CORS headers to avoid issues with cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
  'Content-Type': 'application/json'
};

export async function POST(req: Request) {
  // Extract the Claude API key from environment variables
  const API_KEY = process.env.VITE_CLAUDE_API_KEY;
  const MODEL = process.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229";
  
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: "API key not configured" }), 
      { 
        status: 401,
        headers: corsHeaders
      }
    );
  }
  
  try {
    // Parse request body
    const body = await req.json();
    
    // Forward the request to Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 4000,
        messages: body.messages || [
          { role: 'system', content: body.system || "You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS." },
          { role: 'user', content: body.prompt || '' }
        ]
      })
    });
    
    // Get response as text first
    const text = await claudeResponse.text();
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // If not valid JSON, return the text as an error message
      return new Response(
        JSON.stringify({ error: `Invalid JSON from Claude API: ${text.substring(0, 100)}...` }),
        { 
          status: claudeResponse.status,
          headers: corsHeaders
        }
      );
    }
    
    // Return the response with CORS headers
    return new Response(JSON.stringify(data), {
      status: claudeResponse.status,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error proxying request to Claude API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to proxy request to Claude API' }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function OPTIONS() {
  // Handle CORS preflight requests
  return new Response(null, {
    headers: corsHeaders
  });
}
