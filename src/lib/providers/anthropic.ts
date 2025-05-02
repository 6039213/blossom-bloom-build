
import type { LLMProvider } from "../types";

// Always use the hardcoded API key
const apiKey = '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';

export const anthropicProvider: LLMProvider = {
  name: "claude",
  models: ["claude-3-7-sonnet-20250219"], // Only use Claude 3.7 Sonnet model
  async stream(opts: any) {
    try {
      let tokens = 0;
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: "claude-3-7-sonnet-20250219",
          messages: opts.messages.map((m: any) => ({ 
            role: m.role === 'user' ? 'user' : 'assistant', 
            content: m.content 
          })),
          max_tokens: 4096, // Limit to 4096 tokens as specified
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Anthropic API error: ${errorData.error?.message || response.statusText}`);
      }

      // Process the SSE stream
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
                  const textContent = data.delta.text;
                  opts.onToken(textContent);
                  tokens += 1; // Increment token count (rough approximation)
                }
                
                // Using the usage field to track tokens more accurately when available
                if (data.usage) {
                  tokens = data.usage.output_tokens || tokens;
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      }
      
      // Calculate credits used (1 token = 10 credits)
      const creditsUsed = tokens * 10;
      console.log(`Used ${tokens} tokens (${creditsUsed} credits)`);
      
    } catch (error) {
      console.error("Error streaming from Claude:", error);
      opts.onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error connecting to Claude'}`);
    }
  },
  
  async generateStream(prompt: string, onToken: (token: string) => void, options = {}) {
    try {
      let tokens = 0;
      console.log("Starting Claude 3.7 Sonnet API call...");
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: "claude-3-7-sonnet-20250219",
          messages: [{ role: 'user', content: prompt }],
          max_tokens: options?.maxOutputTokens || 4096,
          temperature: options?.temperature || 0.7,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Anthropic API error: ${errorData.error?.message || response.statusText}`);
      }

      // Process the SSE stream
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
                  const textContent = data.delta.text;
                  onToken(textContent);
                  tokens += 1; // Increment token count (rough approximation)
                }
                
                // Using the usage field to track tokens more accurately when available
                if (data.usage) {
                  tokens = data.usage.output_tokens || tokens;
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      }
      
      console.log(`Claude 3.7 Sonnet response completed with ${tokens} tokens`);
      return {
        tokens,
        creditsUsed: tokens * 10, // 1 token = 10 credits
        complete: true
      };
      
    } catch (error) {
      console.error("Error streaming from Claude:", error);
      onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error connecting to Claude'}`);
      throw error;
    }
  }
};
