
import type { LLMProvider, StreamResult } from "../types";
import { v4 as uuidv4 } from 'uuid';

// API key (stored directly instead of using a proxy)
const API_KEY = "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";

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
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
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
  ): Promise<StreamResult> {
    try {
      // Prepare system message if provided
      const systemMessage = options.system || 
        "You are an expert web developer that writes clear, concise, clean code. Generate complete, working code for web applications. Always output all necessary files, components, and dependencies to make the application work correctly.";
      
      onToken("Connecting to Claude 3.7 Sonnet...");
      
      // Call Claude API directly
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
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
          stream: false, // Using non-streaming version for simplicity
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
      
      // Process the non-streaming response
      const data = await response.json();
      let fullResponse = '';
      
      if (data && data.content && Array.isArray(data.content)) {
        for (const content of data.content) {
          if (content.type === 'text') {
            fullResponse += content.text;
            onToken(content.text);
          }
        }
      }
      
      // Get token count if available
      const tokenCount = data.usage?.output_tokens || fullResponse.length / 4; // Approximate
      
      return {
        tokens: tokenCount,
        creditsUsed: tokenCount * 0.00025, // Approximate, based on Claude 3.7 Sonnet pricing
        complete: true,
        fullResponse
      };
    } catch (error) {
      console.error("Error generating content:", error);
      onToken(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        tokens: 0,
        creditsUsed: 0,
        complete: false
      };
    }
  }
};

export default anthropicProvider;
