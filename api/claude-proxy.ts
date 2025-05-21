
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_CLAUDE_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    
    // Get response as text first
    const text = await upstream.text();
    
    // Parse as JSON if possible, otherwise return text as error
    let payload;
    try {
      payload = JSON.parse(text);
    } catch (e) {
      // If it's not valid JSON, return the text as an error
      return res.status(upstream.status).json({ 
        error: `Invalid JSON from Claude API: ${text.substring(0, 100)}...` 
      });
    }
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Return parsed JSON with the original status code
    res.status(upstream.status).json(payload);
  } catch (err) {
    // Ensure error is always returned as JSON
    res.status(500).json({ error: (err as Error).message });
  }
}
