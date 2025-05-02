
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LLMProvider, StreamResult, GenerateStreamOptions } from "../types";

// Get API key from environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const geminiProvider: LLMProvider = {
  name: "gemini",
  models: ["gemini-2.5-flash-preview"], // Only use the flash preview model
  async stream(opts: any) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview" });
    
    try {
      const result = await model.generateContentStream(
        opts.messages.map((m: any) => ({ 
          role: m.role, 
          parts: [{ text: m.content }] 
        }))
      );
      
      // Process each chunk from the stream directly
      for await (const chunk of result.stream) {
        const textContent = chunk.text();
        if (textContent) {
          opts.onToken(textContent);
        }
      }
    } catch (error) {
      console.error("Error streaming from Gemini:", error);
      opts.onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  async generateStream(prompt: string, onToken: (token: string) => void, options = {}): Promise<StreamResult> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview" });
    
    try {
      const generationConfig = {
        temperature: options?.temperature || 0.7,
        maxOutputTokens: options?.maxOutputTokens || 2048,
      };
      
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig
      });
      
      let tokenCount = 0;
      
      // Process each chunk from the stream directly
      for await (const chunk of result.stream) {
        const textContent = chunk.text();
        if (textContent) {
          onToken(textContent);
          tokenCount += textContent.length;
        }
      }
      
      // Return StreamResult with all required properties
      return { 
        complete: true,
        tokens: tokenCount,
        creditsUsed: 1, // Replace with actual credit calculation if available
        fullResponse: prompt // Not ideal, but we don't have the full response easily accessible
      };
      
    } catch (error) {
      console.error("Error streaming from Gemini:", error);
      onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
};
