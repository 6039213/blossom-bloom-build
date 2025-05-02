import type { LLMProvider } from "../types";

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

// Get API key
const apiKey = getApiKey();
const modelName = import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-7-sonnet-20250219';

export const callClaude = async (prompt: string) => {
  try {
    const res = await fetch("https://claude-proxy.lovable-worker.workers.dev/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000
      })
    });
    
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
    } catch (error) {
      console.error("Error connecting to AI:", error);
      opts.onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error connecting to AI'}`);
    }
  },
  
  async generateStream(prompt: string, onToken: (token: string) => void, options = {}) {
    try {
      // Configure the prompt to return a JSON structure
      const structuredPrompt = `
      I need you to generate a complete web application based on this description:
      
      "${prompt}"
      
      Return ONLY a JSON array of files with path and content, like this:
      [
        { "path": "src/pages/Home.tsx", "content": "// React code here" },
        { "path": "src/components/Header.tsx", "content": "// Component code here" }
      ]
      
      Generate all necessary files for a complete, functional React + Vite + Tailwind CSS application.
      Include:
      - All necessary pages in src/pages
      - Components in src/components
      - Utility functions
      - Types
      - CSS files if needed
      
      Make sure all code is complete, well-structured, and follows best practices.
      DO NOT include any explanations outside the JSON array.
      `;
      
      onToken("Blossom is building your application...");
      
      // Make the API call
      const currentApiKey = getApiKey();
      if (!currentApiKey) {
        onToken("\nError: API key is not set. Please add your Claude API key in API Settings.");
        return {
          tokens: 0,
          creditsUsed: 0,
          complete: false
        };
      }
      
      // Call Claude API using the proxy endpoint
      const response = await fetch("https://claude-proxy.lovable-worker.workers.dev/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": currentApiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: "user", content: structuredPrompt }],
          max_tokens: 4096,
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
      
      if (reader) {
        onToken("\nGenerating files:");
        
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
                  fullResponse += text;
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      }
      
      return {
        tokens: fullResponse.length / 4, // Approximate token count
        creditsUsed: fullResponse.length / 4 * 10, // Approximate credits used
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
