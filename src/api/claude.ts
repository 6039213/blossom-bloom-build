
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
  const MODEL = process.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20250219";
  
  try {
    // Parse request body
    const body = await req.json();
    
    console.log("Calling Claude API with body:", JSON.stringify(body));
    
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
        temperature: 0.7,
        max_tokens: 4000,
        system: body.system || "You are an AI that generates React web applications using React and Tailwind CSS. Always return your response as a JSON object where keys are file paths and values are file contents. Do not include any explanations or markdown - ONLY JSON. Example format: {\"App.jsx\": \"import React from 'react'...\"}. For component files, use JSX extension. Follow React best practices.",
        messages: body.messages || []
      })
    });
    
    // Get response data
    const data = await claudeResponse.json();
    console.log("Claude API response status:", claudeResponse.status);
    
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
