
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LLMProvider } from "../types";

// Get API key from environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const geminiProvider: LLMProvider = {
  name: "gemini",
  models: ["gemini-2.5-flash-preview", "gemini-pro", "gemini-1.5-flash"],
  async stream(opts: any) {
    const model = genAI.getGenerativeModel({ model: opts.model || "gemini-2.5-flash-preview" });
    
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
  }
};
