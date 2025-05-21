/**
 * Claude API Client for Anthropic's Claude models
 */

// Check for API key in environment or localStorage
const getApiKey = (): string => {
  // First check localStorage
  const localKey = localStorage.getItem('CLAUDE_API_KEY');
  if (localKey) return localKey;
  
  // Then check environment variable (may be empty in browser context)
  const envKey = process.env.VITE_CLAUDE_API_KEY;
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
  try {
    // Prepare request body
    const requestBody = {
      model: process.env.VITE_CLAUDE_MODEL || "claude-3-sonnet-20240229",
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
    
    // Call our proxy endpoint
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(requestBody)
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
      return data.content[0].text;
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error("Unexpected response format from Claude API");
    }
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
  try {
    // Prepare request body with streaming enabled
    const requestBody = {
      model: process.env.VITE_CLAUDE_MODEL || "claude-3-sonnet-20240229",
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
    
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(requestBody)
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
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error("Unexpected response format from Claude API");
    }
  } catch (error) {
    console.error("Error streaming from Claude API:", error);
    onToken(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
