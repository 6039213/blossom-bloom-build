
/**
 * Claude API Client for Anthropic's Claude models
 */

// Check for API key in environment or localStorage
const getApiKey = (): string => {
  // First check localStorage
  const localKey = localStorage.getItem('CLAUDE_API_KEY');
  if (localKey) return localKey;
  
  // Then check environment variable (may be empty in browser context)
  const envKey = import.meta.env.VITE_CLAUDE_API_KEY;
  return envKey || '';
};

export interface ClaudeRequestOptions {
  temperature?: number;
  maxTokens?: number;
  system?: string;
  files?: Record<string, string>;
}

/**
 * Generate text using Claude API
 */
export const generateWithClaude = async (
  prompt: string, 
  options: ClaudeRequestOptions = {}
): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("Claude API key not found. Please set it in the settings.");
  }

  try {
    // Prepare request body
    const requestBody = {
      model: import.meta.env.VITE_CLAUDE_MODEL || "claude-3-sonnet-20240229",
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    };
    
    // Add system message if provided
    if (options.system) {
      requestBody.messages.unshift({
        role: "system", 
        content: options.system
      });
    }
    
    // Call Anthropic API directly
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errorData}`);
    }

    const data = await response.json();
    
    return data.content[0].text;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};

/**
 * Stream text generation from Claude API
 */
export const streamWithClaude = async (
  prompt: string,
  onToken: (token: string) => void,
  options: ClaudeRequestOptions = {}
): Promise<void> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    onToken("Error: Claude API key not found. Please set it in the settings.");
    return;
  }

  try {
    // Prepare request body with streaming enabled
    const requestBody = {
      model: import.meta.env.VITE_CLAUDE_MODEL || "claude-3-sonnet-20240229",
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7,
      stream: true,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    };
    
    // Add system message if provided
    if (options.system) {
      requestBody.messages.unshift({
        role: "system", 
        content: options.system
      });
    }
    
    onToken("Connecting to Claude...");
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      onToken(`\nError: Anthropic API error (${response.status}): ${errorData}`);
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      onToken("\nError: Response body is not readable.");
      return;
    }
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          
          // End of stream marker
          if (jsonStr === "[DONE]") break;
          
          try {
            const data = JSON.parse(jsonStr);
            if (data.type === 'content_block_delta' && data.delta?.text) {
              onToken(data.delta.text);
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error streaming from Claude API:", error);
    onToken(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
