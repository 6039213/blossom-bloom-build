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
  // Use the constant from lib/constants or fallback
  const apiKey = ANTHROPIC_API_KEY;
  
  try {
    // Create a proxy URL to avoid CORS issues
    const proxyUrl = 'https://claude-proxy.lovable-worker.workers.dev/v1/messages';
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Anthropic API error: ${errorData.error?.message || response.statusText}`);
    }

    let diff = '';
    const filesChanged: string[] = [];
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonString = line.slice(6);
            
            // End of stream marker
            if (jsonString === "[DONE]") break;
            
            try {
              const data = JSON.parse(jsonString);
              
              // Extract the content delta if it exists
              if (data.type === 'content_block_delta' && data.delta?.text) {
                const text = data.delta.text;
                onToken(text);
                diff += text;
                
                // Check for file changes
                if (text.includes('// FILE:') || text.includes('```')) {
                  // Extract filename from content like "// FILE: src/path/to/file.tsx"
                  const fileRegex = /\/\/ FILE: ([^\n]+)/g;
                  let match;
                  while ((match = fileRegex.exec(text)) !== null) {
                    filesChanged.push(match[1]);
                  }
                  
                  // Also check for ```typescript filename or ```tsx filename patterns
                  const codeBlockRegex = /```(?:typescript|tsx|jsx|js) ([^\n]+)/g;
                  while ((match = codeBlockRegex.exec(text)) !== null) {
                    filesChanged.push(match[1]);
                  }
                }
                
                // Yield the processed chunk
                yield { diff: text, filesChanged };
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    }
    
    // Final yield to indicate completion
    yield { done: true, filesChanged };
    return true;
  } catch (error) {
    console.error("Error streaming from Claude:", error);
    onToken(`Error connecting to Claude: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    // Return null to indicate we should fall back to Gemini
    return null;
  }
}

// Stream generator for Gemini API (original implementation)
async function* streamFromGemini(
  prompt: string,
  onToken: (token: string) => void
) {
  // Use constant from lib/constants
  const apiKey = GEMINI_API_KEY;
  
  if (!apiKey || !genAI) {
    onToken("Error: No Gemini API key found. Using Claude instead.");
    yield { done: true, filesChanged: [], error: true };
    return;
  }
  
  try {
    // Get the model - specifically use gemini-2.5-flash-preview
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview' });
    
    // Generate content stream - using the correct format for content generation
    const generationConfig = {
      temperature: 0.7,
      topP: 1,
      topK: 40,
      maxOutputTokens: 2048,
    };
    
    // Create the stream
    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig
    });
    
    let diff = '';
    const filesChanged: string[] = [];
    
    // Process each chunk from the stream
    for await (const chunk of result.stream) {
      const text = chunk.text();
      onToken(text);
      diff += text;
      
      // Check for file changes
      if (text.includes('// FILE:') || text.includes('```')) {
        // Extract filename from content like "// FILE: src/path/to/file.tsx"
        const fileRegex = /\/\/ FILE: ([^\n]+)/g;
        let match;
        while ((match = fileRegex.exec(text)) !== null) {
          filesChanged.push(match[1]);
        }
        
        // Also check for ```typescript filename or ```tsx filename patterns
        const codeBlockRegex = /```(?:typescript|tsx|jsx|js) ([^\n]+)/g;
        while ((match = codeBlockRegex.exec(text)) !== null) {
          filesChanged.push(match[1]);
        }
      }
      
      // Yield the extracted diff and changed files
      yield { diff: text, filesChanged };
    }
    
    // Final yield to indicate completion
    yield { done: true, filesChanged };
  } catch (error) {
    console.error("Error streaming from Gemini:", error);
    onToken(`Error streaming from Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
    yield { done: true, filesChanged: [], error: true };
  }
}
