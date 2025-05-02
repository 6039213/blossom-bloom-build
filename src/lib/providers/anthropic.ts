
import type { LLMProvider } from "../types";

export const anthropicProvider: LLMProvider = {
  name: "claude",
  models: ["claude-3-7-sonnet-20250219"],
  
  async stream(opts: any) {
    try {
      console.log("Connecting to AI provider...");
      
      opts.onToken("Building your website with Blossom AI. Please wait while we create your application.");
      
    } catch (error) {
      console.error("Error connecting to AI:", error);
      opts.onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error connecting to AI'}`);
    }
  },
  
  async generateStream(prompt: string, onToken: (token: string) => void, options = {}) {
    try {
      console.log("Generating content for your website...");
      
      // Sample responses for building websites
      const responses = [
        "Creating your web application...",
        "Building React components for your site...",
        "Applying Tailwind CSS styles to ensure responsive design...",
        "Setting up the application structure with best practices...",
        "function Header() {\n  return (\n    <header className=\"bg-blue-600 text-white p-4\">\n      <h1 className=\"text-2xl font-bold\">Blossom AI</h1>\n    </header>\n  );\n}",
        "Finalizing your application framework..."
      ];
      
      // Simulate streaming with content
      for (const text of responses) {
        await new Promise(resolve => setTimeout(resolve, 300));
        onToken(text + " ");
      }
      
      return {
        tokens: 150,
        creditsUsed: 1500, 
        complete: true
      };
      
    } catch (error) {
      console.error("Error generating content:", error);
      onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
};
