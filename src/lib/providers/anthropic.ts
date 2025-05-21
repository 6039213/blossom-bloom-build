import { callClaude } from '../../api/claude';
import { LLMProvider, StreamResult } from '../types';

// Get the API key and model name from environment variables
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const MODEL_NAME = import.meta.env.VITE_CLAUDE_MODEL || "claude-3-sonnet-20240229";

/**
 * Call Claude API through our backend endpoint
 */
export const callClaudeAPI = async (prompt: string, system?: string, files: Record<string, string> = {}) => {
  try {
    console.log("Calling Claude API with prompt:", prompt.substring(0, 50) + "...");
    
    const response = await callClaude({
      prompt,
      system: system || "You are an AI assistant that helps with web development.",
      model: MODEL_NAME,
      max_tokens: 4000,
      temperature: 0.7
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.content || '';
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
    options: {
      system?: string;
      temperature?: number;
      maxOutputTokens?: number;
    } = {}
  ): Promise<StreamResult> {
    try {
      const response = await callClaude({
        prompt,
        system: options.system || "You are an AI assistant that helps with web development.",
        model: MODEL_NAME,
        max_tokens: options.maxOutputTokens || 4000,
        temperature: options.temperature || 0.7,
        stream: true
      });

      if (response.error) {
        onToken(`Error: ${response.error}`);
        return {
          tokens: 0,
          creditsUsed: 0,
          complete: false,
          fullResponse: ''
        };
      }

      const content = response.content || '';
      onToken(content);
      return {
        tokens: content.length / 4, // Approximate token count
        creditsUsed: 1,
        complete: true,
        fullResponse: content
      };
    } catch (error) {
      console.error('Error generating content:', error);
      onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        tokens: 0,
        creditsUsed: 0,
        complete: false,
        fullResponse: ''
      };
    }
  }
};

export default anthropicProvider;
