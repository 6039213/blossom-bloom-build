
// Use proper CORS headers to avoid issues with cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
  'Content-Type': 'application/json'
};

export async function POST(req: Request) {
  // Extract the Claude API key from environment variables
  const API_KEY = process.env.VITE_CLAUDE_API_KEY || 
                  "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";
  const MODEL = process.env.VITE_CLAUDE_MODEL || "claude-3-sonnet-20240229";
  
  try {
    // Parse request body
    const body = await req.json();
    
    // Add the existing files to the system prompt if provided
    const systemPrompt = body.system || "Je bent een programmeerassistent. Je genereert en wijzigt React + Tailwind componenten. Geef alleen gewijzigde bestanden als JSON terug, geen uitleg.";
    
    // Create messages array with files context if provided
    let messages = body.messages || [];
    
    // Include existing files context if provided
    if (body.files && Array.isArray(body.files) && body.files.length > 0) {
      // Format files for the context
      const filesContext = body.files.map(file => 
        `${file.path}:\n${file.content}`
      ).join('\n\n');
      
      // Add files context to the first user message if it exists
      if (messages.length > 0 && messages[0].role === 'user') {
        messages[0].content = `Bestaande bestanden:\n${filesContext}\n\nPrompt: ${messages[0].content}`;
      }
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
    
    // Get response data
    const data = await claudeResponse.json();
    console.log("Claude API response status:", claudeResponse.status);
    
    // Validate the response is valid JSON
    if (data.content && data.content[0]?.type === 'text') {
      try {
        // Try to parse the response as JSON to ensure it's valid
        const responseText = data.content[0].text;
        // Look for JSON objects in the text (ignore any markdown or explanations)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          JSON.parse(jsonMatch[0]);
          console.log("Successfully validated response as JSON");
        }
      } catch (parseError) {
        console.warn("Claude did not return valid JSON:", parseError);
        // We don't throw here, we'll let the front end handle this
      }
    }
    
    // Return the response with CORS headers
    return new Response(JSON.stringify(data), {
      status: claudeResponse.status,
      headers: corsHeaders
    });
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
