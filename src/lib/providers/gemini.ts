
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
      
      // Access the stream through the proper property
      const stream = result.stream;
      
      // Process each chunk from the stream
      for await (const chunk of stream) {
        opts.onToken(chunk.text());
      }
    } catch (error) {
      console.error("Error streaming from Gemini:", error);
      opts.onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
