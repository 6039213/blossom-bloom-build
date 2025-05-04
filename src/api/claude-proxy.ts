
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Extract the Claude API key from environment or request
  const API_KEY = "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";
  
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
      body: JSON.stringify(body)
    });
    
    // Get response data
    const data = await claudeResponse.json();
    
    // Return the response with CORS headers
    return NextResponse.json(data, {
      status: claudeResponse.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version'
      }
    });
  } catch (error) {
    console.error('Error proxying request to Claude API:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to Claude API' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // Handle CORS preflight requests
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version'
    }
  });
}
