
import { toast } from "sonner";

export interface FileContent {
  path: string;
  content: string;
}

// Use the environment variable API key
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const MODEL_NAME = import.meta.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229";

export class ClaudeService {
  static async generateCode(
    prompt: string,
    options: { 
      system?: string; 
      temperature?: number; 
      maxTokens?: number;
      thinkingBudget?: number;
    } = {}
  ): Promise<FileContent[]> {
    if (!API_KEY) {
      toast.error("Claude API key not configured. Please add it to your environment variables.");
      return [];
    }
    
    try {
      // Prepare system message
      const systemMessage = options.system || 
        "You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS.";
      
      console.log("Generating code with Claude 3.7 Sonnet API...");
      
      // Fix the thinking parameter format - using "enabled: true" instead of "type: reasoning"
      const thinkingConfig = options.thinkingBudget ? {
        thinking: {
          enabled: true,  // FIXED: Using enabled: true instead of type: reasoning
          budget_tokens: options.thinkingBudget
        }
      } : {};
      
      // Call the Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          max_tokens: options.maxTokens || 4000,
          temperature: options.temperature || 0.7,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt }
          ],
          ...thinkingConfig
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API error: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.content || !result.content[0] || !result.content[0].text) {
        throw new Error("Unexpected response format from Claude API");
      }
      
      const responseText = result.content[0].text;
      
      // Extract code blocks with file paths
      const codeBlocks = this.extractCodeBlocks(responseText);
      
      if (codeBlocks.length === 0) {
        throw new Error("No code blocks found in the response");
      }
      
      console.log(`Generated ${codeBlocks.length} files successfully`);
      
      return codeBlocks;
    } catch (error) {
      console.error("Error generating code:", error);
      throw error;
    }
  }
  
  static extractCodeBlocks(text: string): FileContent[] {
    const regex = /```(?:jsx?|tsx?|html|css)?\s+([^\n]+)?\n([\s\S]*?)```/g;
    const codeBlocks: FileContent[] = [];
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      const path = match[1]?.trim() || `file${codeBlocks.length + 1}.js`;
      const content = match[2]?.trim() || "";
      
      codeBlocks.push({
        path,
        content
      });
    }
    
    return codeBlocks;
  }
}

export default ClaudeService;
