import type { NextApiRequest, NextApiResponse } from 'next';

// Define standard types instead of using Next.js types
interface CustomRequest {
  method: string;
  headers: {
    [key: string]: string | undefined;
  };
  body: any;
}

interface CustomResponse {
  status: (code: number) => CustomResponse;
  json: (data: any) => void;
  setHeader?: (name: string, value: string) => CustomResponse;
}

/**
 * Claude API handler function
 * Works with both NextJS API routes and standard HTTP handlers
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey, ...body } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch from Claude API');
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in Claude API proxy:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
