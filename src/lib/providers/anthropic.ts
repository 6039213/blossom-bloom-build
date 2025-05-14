
import type { LLMProvider, StreamResult } from "../types";

// Get the API key and model name from environment variables
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const MODEL_NAME = import.meta.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229";

/**
 * Call Claude API through our backend endpoint
 */
export const callClaude = async (prompt: string, system?: string, files: Record<string, string> = {}) => {
  try {
    console.log("Calling Claude API with prompt:", prompt.substring(0, 50) + "...");
    
    // Make a request directly to Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true' // Add CORS header
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          system ? { role: 'system', content: system } : null,
          { role: 'user', content: prompt }
        ].filter(Boolean)
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
    options: { system?: string; temperature?: number; maxOutputTokens?: number; thinkingBudget?: number } = {}
  ): Promise<StreamResult> {
    try {
      // Prepare system message if provided
      const systemMessage = options.system || 
        "You are an AI that generates React + Tailwind webapps. Return modified files as JSON. No explanation, no markdown, only JSON.";
      
      onToken("Connecting to Claude 3.7 Sonnet...");
      
      try {
        // Fix the thinking parameter format - it should use "enabled" instead of "type: reasoning"
        const thinkingConfig = options.thinkingBudget ? {
          thinking: {
            enabled: true,
            budget_tokens: options.thinkingBudget
          }
        } : {};
        
        // Make a direct request to Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true' // Add CORS header
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            max_tokens: options.maxOutputTokens || 4000,
            temperature: options.temperature || 0.7,
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: prompt }
            ],
            ...thinkingConfig
          })
        });
        
        if (!response.ok) {
          throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        let fullResponse = '';
        
        // Handle response format
        if (data.content && data.content[0] && data.content[0].text) {
          fullResponse = data.content[0].text;
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
