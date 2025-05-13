
// Use proper CORS headers to avoid issues with cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
  'Content-Type': 'application/json'
};

export async function POST(req: Request) {
  // Extract the Claude API key from environment variables
  const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
  const MODEL = import.meta.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229";
  
  try {
    // Parse request body
    const body = await req.json();
    
    // Format messages for Claude API
    let messages = [];
    
    // Add system message
    messages.push({
      role: 'system',
      content: body.system || "You are an AI that generates React + Tailwind webapps. Return modified files as JSON. No explanation, no markdown, only JSON."
    });
    
    // Add the user's prompt as a message
    messages.push({
      role: 'user',
      content: `${body.prompt || ''}`
    });
    
    // Include existing files context if provided
    if (body.files && typeof body.files === 'object' && Object.keys(body.files).length > 0) {
      // Format files for the context
      const filesContext = Object.entries(body.files)
        .map(([path, content]) => `${path}:\n${content}`)
        .join('\n\n');
      
      // Add files context as a separate user message
      messages.push({
        role: 'user',
        content: `Existing files:\n${filesContext}`
      });
    }
    
    console.log("Calling Claude API with request:", {
      model: MODEL,
      temperature: body.temperature || 0.7,
      max_tokens: body.max_tokens || 4000,
      messages
    });
    
    // Forward the request to Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true' // Add CORS header
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 4000,
        messages
      })
    });
    
    // Check if the response is successful
    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error("Claude API error response:", errorText);
      
      return new Response(
        JSON.stringify({ error: `Claude API error: ${claudeResponse.status} ${claudeResponse.statusText}`, details: errorText }), 
        { 
          status: claudeResponse.status,
          headers: corsHeaders
        }
      );
    }
    
    // Get response data
    const data = await claudeResponse.json();
    console.log("Claude API response status:", claudeResponse.status);
    
    // Check if the response contains text content
    if (!data.content || !data.content[0] || data.content[0].type !== 'text') {
      return new Response(
        JSON.stringify({ error: "Invalid response format from Claude API" }), 
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }
    
    // Extract the text content
    const responseText = data.content[0].text;
    
    // Return the raw response
    return new Response(
      JSON.stringify({ content: responseText }), 
      { 
        status: 200,
        headers: corsHeaders
      }
    );
    
  } catch (error) {
    console.error('Error proxying request to Claude API:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to proxy request to Claude API', 
        details: error.message,
        stack: error.stack
      }),
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
