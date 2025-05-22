
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSelectedModel } from '@/lib/llm/modelSelection';
import { ANTHROPIC_API_KEY, GEMINI_API_KEY } from '@/lib/constants';

// Initialize the Generative AI with the API key (even though we're always preferring Claude)
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Stream generator for Claude / Gemini API
export async function* geminiStream(
  prompt: string,
  onToken: (token: string) => void
) {
  const modelProvider = getSelectedModel();
  
  try {
    // Always try Claude first
    if (modelProvider.name === 'claude') {
      const modelResult = await streamFromClaude(prompt, onToken);
      if (modelResult) {
        yield* modelResult;
        return;
      }
    }
    
    // Only use Gemini as fallback if specifically selected or Claude failed
    // Note: In this version of the app, we're only using Claude so this is just for error handling
    if (genAI) {
      yield* streamFromGemini(prompt, onToken);
    } else {
      throw new Error("No AI model available");
    }
  } catch (error) {
    console.error("Error in AI stream:", error);
    onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    // Final yield to indicate completion even with error
    yield { done: true, filesChanged: [], error: true };
  }
}

// Stream generator for Claude API
async function* streamFromClaude(
  prompt: string,
  onToken: (token: string) => void
) {
  try {
    // Call our proxy endpoint
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 4096,
        stream: true,
      }),
    });

    // Get the response text first
    const text = await response.text();
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${text}`);
    }
    
    // Safely parse the JSON response
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse response as JSON:", text.substring(0, 200));
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
    }
    
    if (data.content && data.content[0] && data.content[0].text) {
      onToken(data.content[0].text);
      yield { done: false, filesChanged: [], error: false };
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error("Unexpected response format from Claude API");
    }
    
    // Final yield to indicate completion
    yield { done: true, filesChanged: [], error: false };
  } catch (error) {
    console.error("Error streaming from Claude:", error);
    onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    yield { done: true, filesChanged: [], error: true };
  }
}

// Stream generator for Gemini API (fallback)
async function* streamFromGemini(
  prompt: string,
  onToken: (token: string) => void
) {
  if (!genAI) {
    throw new Error("Gemini API not configured");
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        onToken(text);
        yield { done: false, filesChanged: [], error: false };
      }
    }
    
    // Final yield to indicate completion
    yield { done: true, filesChanged: [], error: false };
  } catch (error) {
    console.error("Error streaming from Gemini:", error);
    onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    yield { done: true, filesChanged: [], error: true };
  }
}
