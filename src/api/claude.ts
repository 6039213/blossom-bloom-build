
// Use proper CORS headers to avoid issues with cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
  'Content-Type': 'application/json'
};

export async function POST(req: Request) {
  // Extract the Claude API key from environment variables
  const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || 
                  "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";
  const MODEL = import.meta.env.VITE_CLAUDE_MODEL || "claude-3-sonnet-20240229";
  
  try {
    // Parse request body
    const body = await req.json();
    
    // Add the existing files to the system prompt if provided
    const systemPrompt = "Je bent een AI die React + Tailwind webapps genereert en bestaande code aanpast. Geef alleen gewijzigde bestanden terug als JSON. Geen uitleg, geen markdown, geen tekst buiten JSON.";
    
    // Create messages array with files context if provided
    let messages = [];
    
    // Add the user's prompt as the first message
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
        content: `Bestaande bestanden:\n${filesContext}`
      });
    }
    
    console.log("Calling Claude API with request:", {
      model: MODEL,
      temperature: body.temperature || 0.7,
      max_tokens: body.max_tokens || 4000,
      system: systemPrompt,
      messages
    });
    
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
        system: systemPrompt,
        messages
      })
    });
    
    // Check if the response is successful
    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error("Claude API error response:", errorText);
      return new Response(
        JSON.stringify({ error: `Claude API error: ${claudeResponse.status} ${claudeResponse.statusText}` }), 
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
        throw new Error("No valid JSON found in Claude's response");
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
      
      // Check if the response contains HTML (common error case)
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        return new Response(
          JSON.stringify({ 
            error: "Claude API returned HTML instead of JSON", 
            details: "The response appears to be an HTML page rather than the expected JSON" 
          }), 
          { 
            status: 500,
            headers: corsHeaders
          }
        );
      }
      
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
      JSON.stringify({ error: 'Failed to proxy request to Claude API', details: error.message }),
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
