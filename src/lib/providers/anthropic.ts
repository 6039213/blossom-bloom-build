
import { toast } from 'sonner';

// Helper function to safely parse JSON
const safeJsonParse = async (response: Response) => {
  const text = await response.text();
  try {
    return response.headers.get('content-type')?.includes('json')
      ? JSON.parse(text)
      : { error: text };
  } catch (e) {
    console.error("Failed to parse response as JSON:", text.substring(0, 200));
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
  }
};

export const anthropicProvider = {
  id: 'anthropic',
  name: 'Anthropic Claude',
  
  async generate(prompt: string, options: any = {}) {
    try {
      // Use environment variable directly - no need to store in localStorage
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      
      if (!apiKey) {
        toast.error("Claude API key not configured");
        return { error: "API key not configured" };
      }
      
      const model = options.model || import.meta.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229";
      const temperature = options.temperature || 0.7;
      const maxTokens = options.maxOutputTokens || 4000;
      
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: parseFloat(temperature),
          max_tokens: parseInt(maxTokens),
          system: options.system || "",
          prompt
        })
      });
      
      const data = await safeJsonParse(response);
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'API Error');
      }
      
      if (data.content && data.content[0] && data.content[0].text) {
        return data.content[0].text;
      } 
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Claude generation error:", error);
      toast.error(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
  
  async generateStream(
    prompt: string,
    onToken: (text: string) => void,
    options: any = {}
  ) {
    try {
      // Use environment variable directly - no need to store in localStorage
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      
      if (!apiKey) {
        toast.error("Claude API key not configured");
        throw new Error("API key not configured");
      }
      
      const model = options.model || import.meta.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229";
      const temperature = options.temperature || 0.7;
      const maxTokens = options.maxOutputTokens || 4000;
      
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: parseFloat(temperature),
          max_tokens: parseInt(maxTokens),
          system: options.system || "",
          prompt
        })
      });
      
      const data = await safeJsonParse(response);
      
      if (!response.ok || data.error) {
        throw new Error(data.error || `API Error: ${response.status}`);
      }
      
      if (data.content && data.content[0] && data.content[0].text) {
        // Since we don't have actual streaming yet, we'll simulate it
        const text = data.content[0].text;
        let currentPosition = 0;
        
        // Simulate streaming by splitting the text
        while (currentPosition < text.length) {
          const chunk = text.slice(currentPosition, currentPosition + 10);
          onToken(chunk);
          currentPosition += 10;
          
          // Small delay to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        return text;
      }
      
      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Claude streaming error:", error);
      toast.error(`Streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
};

export default anthropicProvider;
