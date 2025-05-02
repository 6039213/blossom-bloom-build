
import type { LLMProvider } from "../types";

export const anthropicProvider: LLMProvider = {
  name: "claude",
  models: ["claude-3-7-sonnet-20250219"], // Only use Claude 3.7 Sonnet model
  
  async stream(opts: any) {
    try {
      let tokens = 0;
      // Disable actual API calls for security, provide mock response instead
      console.log("Claude API streaming would happen here (disabled for security)");
      
      // Return mock response
      opts.onToken("I'm sorry, the Claude API is currently disabled for security reasons. " +
        "Please use the local demo mode instead.");
      
    } catch (error) {
      console.error("Error streaming from Claude:", error);
      opts.onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error connecting to Claude'}`);
    }
  },
  
  async generateStream(prompt: string, onToken: (token: string) => void, options = {}) {
    try {
      console.log("Claude API generation would happen here (disabled for security)");
      
      // Mock response for demonstration
      const demoResponses = [
        "This is a demonstration mode. The Claude API is currently disabled for security reasons.",
        "In a real environment, this would connect to Claude 3.7 Sonnet.",
        "You can create a simple React component for your site using Tailwind CSS.",
        "For example: ```tsx\nfunction Header() {\n  return (\n    <header className=\"bg-blue-600 text-white p-4\">\n      <h1 className=\"text-2xl font-bold\">Demo Mode</h1>\n    </header>\n  );\n}\n```",
        "To enable actual API functionality, you would need to set up proper API key management through secure environment variables."
      ];
      
      // Simulate streaming with demo content
      for (const text of demoResponses) {
        await new Promise(resolve => setTimeout(resolve, 300));
        onToken(text + " ");
      }
      
      return {
        tokens: 150, // mock token count
        creditsUsed: 1500, 
        complete: true
      };
      
    } catch (error) {
      console.error("Error streaming from Claude:", error);
      onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error connecting to Claude'}`);
      throw error;
    }
  }
};
