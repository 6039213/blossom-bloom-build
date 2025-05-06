
export async function POST(req: Request) {
  // Extract the Claude API key from environment variables
  const API_KEY = process.env.VITE_CLAUDE_API_KEY || "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";
  
  try {
    // Parse request body
    const body = await req.json();
    
    // Forward the request to Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version'
      },
      body: JSON.stringify(body)
    });
    
    // Get response data
    const data = await claudeResponse.json();
    
    // Return the response with CORS headers
    return new Response(JSON.stringify(data), {
      status: claudeResponse.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error proxying request to Claude API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to proxy request to Claude API' }),
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function OPTIONS() {
  // Handle CORS preflight requests
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version'
    }
  });
}
