import config from '../config';

// Use proper CORS headers to avoid issues with cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
  'Content-Type': 'application/json'
};

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    
    // Format messages for Claude API
    let messages = [];
    
    // Add system message
    messages.push({
      role: 'system',
      content: body.system || "You are an AI that generates React + Tailwind web applications and modifies existing code. Return only modified files as JSON. No explanations, no markdown, no text outside JSON."
    });
    
    // Add the user's prompt as a message
    messages.push({
      role: 'user',
      content: `Prompt: ${body.prompt || ''}`
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
      model: config.claudeModel,
      temperature: body.temperature || 0.7,
      max_tokens: body.max_tokens || 4000,
      messages
    });
    
    // Forward the request to Claude API
    const claudeResponse = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': config.claudeApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: config.claudeModel,
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 4000,
        messages
      })
    });
    
    // Check if the response is successful
    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error("Claude API error response:", errorText);
      
      // Check if the error response contains HTML (common error case)
      if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
        return new Response(
          JSON.stringify({ 
            error: "Claude API returned HTML instead of JSON", 
            details: "The response appears to be an HTML page rather than the expected JSON" 
          }), 
          { 
            status: claudeResponse.status,
            headers: corsHeaders
          }
        );
      }
      
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
    
    // Try to extract JSON from the response text
    try {
      // Look for a JSON object in the text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("No valid JSON found in Claude's response");
        console.log("Response text:", responseText);
        
        return new Response(
          JSON.stringify({ 
            error: "No valid JSON found in Claude's response",
            rawResponse: responseText 
          }), 
          { 
            status: 500,
            headers: corsHeaders
          }
        );
      }
      
      // Parse the JSON to verify it's valid
      const parsedJson = JSON.parse(jsonMatch[0]);
      
      // Return the parsed JSON
      return new Response(
        JSON.stringify({ content: parsedJson }), 
        { 
          status: 200,
          headers: corsHeaders
        }
      );
    } catch (parseError) {
      console.error("Failed to parse Claude's response as JSON:", parseError);
      console.log("Response text:", responseText);
      
      // Return the raw response text as a fallback
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse Claude's response as JSON",
          rawResponse: responseText
        }), 
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }
    
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
