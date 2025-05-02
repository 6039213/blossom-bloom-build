
import type { LLMProvider } from "../types";
import { v4 as uuidv4 } from 'uuid';

// Try to get API key from various sources with priority
const getApiKey = () => {
  // First try localStorage
  const localStorageKey = localStorage.getItem('VITE_CLAUDE_API_KEY');
  if (localStorageKey) return localStorageKey;
  
  // Then try import.meta.env
  const envKey = import.meta.env.VITE_CLAUDE_API_KEY;
  if (envKey) return envKey;
  
  // Finally, return empty string if nothing found
  return '';
};

// Get model name
const modelName = "claude-3-7-sonnet-20250219";

interface ClaudeResponseContent {
  type: string;
  text: string;
}

interface ClaudeResponseMessage {
  id: string;
  type: string;
  role: string;
  content: ClaudeResponseContent[];
  model: string;
  stop_reason: string | null;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface ClaudeStreamingDelta {
  type: string;
  text?: string;
  index?: number;
}

interface ClaudeStreamingEvent {
  type: string;
  delta?: ClaudeStreamingDelta;
  message?: ClaudeResponseMessage;
}

export const callClaude = async (prompt: string, system?: string) => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error("No API key found. Please set your Claude API key in API Settings.");
    }
    
    const res = await fetch("https://claude-proxy.lovable-worker.workers.dev/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          { role: "user", content: prompt }
        ],
        max_tokens: 4000
      })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Claude API error: ${errorText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};

export const anthropicProvider: LLMProvider = {
  name: "claude",
  models: [modelName],
  
  async stream(opts: any) {
    try {
      console.log("Connecting to Blossom AI...");
      opts.onToken("Blossom is initializing. Please wait while we prepare to build your application.");
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error connecting to AI:", error);
      opts.onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error connecting to AI'}`);
    }
  },
  
  async generateStream(
    prompt: string, 
    onToken: (token: string) => void, 
    options: { system?: string; temperature?: number; maxOutputTokens?: number } = {}
  ) {
    try {
      // Get API key
      const apiKey = getApiKey();
      
      if (!apiKey) {
        onToken("Error: API key is not set. Please add your Claude API key in API Settings.");
        return {
          tokens: 0,
          creditsUsed: 0,
          complete: false
        };
      }
      
      // Prepare system message if provided
      const systemMessage = options.system || 
        "You are an expert web developer that writes clear, concise, clean code. Generate complete, working code for web applications. Always output all necessary files, components, and dependencies to make the application work correctly.";
      
      onToken("Connecting to Claude 3.7 Sonnet...");
      
      // Call Claude API using the proxy endpoint with streaming
      const response = await fetch("https://claude-proxy.lovable-worker.workers.dev/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: prompt }
          ],
          max_tokens: options.maxOutputTokens || 4096,
          temperature: options.temperature || 0.7,
          stream: true,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        onToken(`\nError from Claude API: ${errorText}`);
        return {
          tokens: 0,
          creditsUsed: 0,
          complete: false
        };
      }
      
      // Process the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let tokenCount = 0;
      
      if (reader) {
        onToken("\nGenerating code with Claude 3.7 Sonnet...\n\n");
        
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
                const data = JSON.parse(jsonString) as ClaudeStreamingEvent;
                
                // Extract the content delta if it exists
                if (data.type === 'content_block_delta' && data.delta?.text) {
                  const text = data.delta.text;
                  onToken(text);
                  fullResponse += text;
                  tokenCount += 1; // Approximate token count
                }
                
                // If we have a complete message, extract any metadata
                if (data.type === 'message_complete' && data.message) {
                  tokenCount = data.message.usage.output_tokens;
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      }
      
      return {
        tokens: tokenCount,
        creditsUsed: tokenCount * 0.00025, // Approximate, based on Claude 3.7 Sonnet pricing
        complete: true,
        fullResponse
      };
    } catch (error) {
      console.error("Error generating content:", error);
      onToken(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
};

export default anthropicProvider;
