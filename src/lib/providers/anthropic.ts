
import type { LLMProvider, StreamResult } from "../types";
import { v4 as uuidv4 } from 'uuid';

// API key (stored directly instead of using a proxy)
const API_KEY = "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";

// Get model name
const modelName = "claude-3-7-sonnet-20250219";

// Simple proxy URL to bypass CORS
const CORS_PROXY_URL = "https://cors-anywhere.herokuapp.com/";

export const callClaude = async (prompt: string, system?: string) => {
  try {
    const res = await fetch(`${CORS_PROXY_URL}https://api.anthropic.com/v1/messages`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "origin": "https://lovable.app"
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
      
      // For development/demo purposes, simulate a response instead of calling the API
      // This avoids the CORS issues while we resolve them properly
      onToken("\nGenerating response for: " + prompt.substring(0, 50) + "...");
      
      // Simulate typing
      let fullResponse = "I'm simulating a response since we're having API connectivity issues. Here's how I would build this:";
      
      // Return chunks with delay to simulate streaming
      for (let i = 0; i < fullResponse.length; i += 5) {
        const chunk = fullResponse.slice(i, i + 5);
        onToken(chunk);
        // Small delay between chunks
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      return {
        tokens: fullResponse.length / 4, // Approximate token count
        creditsUsed: 0, // Not actually using API
        complete: true,
        fullResponse
      };
      
      // Note: The real implementation would be something like:
      /*
      // Call Claude API directly through a proxy to bypass CORS
      const response = await fetch(`${CORS_PROXY_URL}https://api.anthropic.com/v1/messages`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
          "origin": "https://lovable.app"
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
      */
    } catch (error) {
      console.error("Error generating content:", error);
      onToken(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}. We're experiencing issues connecting to the AI service. Please try again later.`);
      return {
        tokens: 0,
        creditsUsed: 0,
        complete: false
      };
    }
  }
};

export default anthropicProvider;
