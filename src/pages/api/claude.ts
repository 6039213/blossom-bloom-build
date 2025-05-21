
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Claude API key not configured' });
    }

    const { prompt, system, model = 'claude-3-7-sonnet-20240229', temperature = 0.7, max_tokens = 4000 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt }
        ],
        temperature,
        max_tokens
      })
    });

    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse Claude API response as JSON:', text.substring(0, 200));
      return res.status(500).json({ error: `Invalid JSON response from Claude API: ${text.substring(0, 100)}...` });
    }

    if (!response.ok) {
      console.error('Claude API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Claude API error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in Claude proxy:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
