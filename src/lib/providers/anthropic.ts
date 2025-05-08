
import type { LLMProvider, StreamResult } from "../types";

// Get the API key and model name from environment variables
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || "";
const MODEL_NAME = import.meta.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229";

/**
 * Call Claude API through our backend endpoint
 */
export const callClaude = async (prompt: string, system?: string, files: Record<string, string> = {}) => {
  try {
    console.log("Calling Claude API with prompt:", prompt.substring(0, 50) + "...");
    
    // Make a request to our local API endpoint
    const response = await fetch('/api/claude', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        system,
        files
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Claude API response received successfully");
    return data;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};

export const anthropicProvider: LLMProvider = {
  name: "claude",
  models: [MODEL_NAME],
  
  async generateStream(
    prompt: string, 
    onToken: (token: string) => void, 
    options: { system?: string; temperature?: number; maxOutputTokens?: number } = {}
  ): Promise<StreamResult> {
    try {
      // Prepare system message if provided
      const systemMessage = options.system || 
        "You are an AI that generates React + Tailwind webapps. Return modified files as JSON. No explanation, no markdown, only JSON.";
      
      onToken("Connecting to Claude 3.7 Sonnet...");
      
      try {
        // Make a request to our local API endpoint
        const response = await fetch('/api/claude', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            system: systemMessage,
            temperature: options.temperature || 0.7,
            max_tokens: options.maxOutputTokens || 4000
          })
        });
        
        if (!response.ok) {
          throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        let fullResponse = '';
        
        // Handle different response formats
        if (data.content) {
          fullResponse = data.content;
          onToken(fullResponse);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error("Unexpected response format from Claude API");
        }
        
        return {
          tokens: fullResponse.length / 4, // Approximate token count
          creditsUsed: 1, // Placeholder
          complete: true,
          fullResponse
        };
      } catch (error) {
        console.error('Error generating content:', error);
        onToken(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`);
        return {
          tokens: 0,
          creditsUsed: 0,
          complete: false
        };
      }
    } catch (error) {
      console.error("Error generating content:", error);
      onToken(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`);
      return {
        tokens: 0,
        creditsUsed: 0,
        complete: false
      };
    }
  }
};

export default anthropicProvider;
