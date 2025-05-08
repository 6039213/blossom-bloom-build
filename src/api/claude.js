
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Set up CORS
app.use(cors());
app.use(express.json());

// Get API key from environment variables
const CLAUDE_API_KEY = process.env.VITE_CLAUDE_API_KEY;
const CLAUDE_MODEL = process.env.VITE_CLAUDE_MODEL || 'claude-3-7-sonnet-20240229';

if (!CLAUDE_API_KEY) {
  console.error('Missing CLAUDE_API_KEY environment variable');
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
});

app.post('/api/claude', async (req, res) => {
  try {
    const { prompt, system, temperature = 0.7, max_tokens = 4000, files = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Calling Claude API with model: ${CLAUDE_MODEL}`);
    console.log(`System prompt: ${system.substring(0, 50)}...`);
    console.log(`User prompt: ${prompt.substring(0, 50)}...`);

    // Format the files context
    const fileContext = Object.entries(files)
      .map(([path, content]) => `File: ${path}\n\`\`\`\n${content}\n\`\`\`\n`)
      .join('\n');
    
    // Prepare messages for Claude API
    const messages = [
      {
        role: 'system',
        content: system || 'You are a helpful AI assistant.'
      },
      {
        role: 'user',
        content: fileContext ? `${fileContext}\n\n${prompt}` : prompt
      }
    ];

    // Call Claude API
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: max_tokens,
      temperature: temperature,
      messages: messages
    });

    // Send response to client
    res.json({
      content: response.content[0].text
    });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Claude API proxy server is running on port ${port}`);
});

export default app;
