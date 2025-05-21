import { ANTHROPIC_API_KEY } from '../lib/constants';

// Use proper CORS headers to avoid issues with cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
  'Content-Type': 'application/json'
};

export interface ClaudeRequest {
  prompt: string;
  system?: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ClaudeResponse {
  content?: string;
  error?: string;
}

export async function callClaude(request: ClaudeRequest): Promise<ClaudeResponse> {
  if (!ANTHROPIC_API_KEY) {
    return { error: 'Claude API key not configured' };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: request.model || 'claude-3-sonnet-20240229',
        max_tokens: request.max_tokens || 4096,
        temperature: request.temperature || 0.7,
        messages: [
          ...(request.system ? [{ role: 'system', content: request.system }] : []),
          { role: 'user', content: request.prompt }
        ],
        stream: request.stream || false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return { error: `Claude API error (${response.status}): ${errorData}` };
    }

    const data = await response.json();
    return { content: data.content[0].text };
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await callClaude({
      prompt: body.prompt,
      system: body.system,
      model: body.model,
      max_tokens: body.max_tokens,
      temperature: body.temperature,
      stream: body.stream
    });

    return new Response(
      JSON.stringify(response),
      { 
        status: response.error ? 500 : 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders
  });
}
