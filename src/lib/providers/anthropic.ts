
import type { LLMProvider, StreamResult } from "../types";

// Get the API key and model name from environment variables
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || 
               "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";
const MODEL_NAME = import.meta.env.VITE_CLAUDE_MODEL || "claude-3-sonnet-20240229";

/**
 * Call Claude API through our backend endpoint
 */
export const callClaude = async (prompt: string, system?: string, files: Record<string, string> = {}) => {
  try {
    // Make a request to our local API endpoint
    const response = await fetch('/api/claude', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        system,
        files
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};

export const anthropicProvider: LLMProvider = {
  name: "claude",
  models: [MODEL_NAME],
  
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
        "Je bent een AI die React + Tailwind webapps genereert en bestaande code aanpast. Geef alleen gewijzigde bestanden terug als JSON. Geen uitleg, geen markdown, geen tekst buiten JSON.";
      
      onToken("Verbinding maken met Claude 3.7 Sonnet...");
      
      try {
        // Make a request to our local API endpoint
        const response = await fetch('/api/claude', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            system: systemMessage,
            temperature: options.temperature || 0.7,
            max_tokens: options.maxOutputTokens || 4000
          })
        });
        
        if (!response.ok) {
          // Check if the response is HTML (indicates a server error)
          const responseText = await response.text();
          if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
            throw new Error("Server error: The API endpoint returned HTML instead of JSON");
          }
          
          // Try to parse as JSON to get error details
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(`Claude API error: ${errorData.error || response.statusText}`);
          } catch (parseError) {
            throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
          }
        }
        
        const data = await response.json();
        
        let fullResponse = '';
        
        // Handle different response formats
        if (data.content && typeof data.content === 'object') {
          // The backend already extracted and parsed the JSON
          const jsonStr = JSON.stringify(data.content, null, 2);
          fullResponse = jsonStr;
          onToken(jsonStr);
        } else if (data.content && data.content[0] && data.content[0].type === 'text') {
          // Standard Claude API response format
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
