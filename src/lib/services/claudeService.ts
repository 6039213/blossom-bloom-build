
import { toast } from "sonner";

interface FileContent {
  path: string;
  content: string;
}

// Helper function to parse code blocks from text
function parseCodeBlocks(text: string): FileContent[] {
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
    // Get API key from localStorage (saved in settings)
    const API_KEY = localStorage.getItem('CLAUDE_API_KEY');
    
    if (!API_KEY) {
      toast.error("Claude API key not configured. Please add it in Settings.");
      return [];
    }
    
    try {
      // Prepare system message
      const systemMessage = options.system || 
        "You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS.";
      
      console.log("Generating code with Claude API...");
      
      // Call the Claude API through our proxy
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: localStorage.getItem('CLAUDE_MODEL') || "claude-3-7-sonnet-20240229",
          max_tokens: options.maxTokens || 4000,
          temperature: options.temperature || 0.7,
          system: systemMessage,
          prompt: prompt,
          ...(options.thinkingBudget ? {
            thinking: {
              enabled: true,
              budget_tokens: options.thinkingBudget
            }
          } : {})
        })
      });
      
      // Get the text response first
      const text = await response.text();
      
      // Handle non-OK responses
      if (!response.ok) {
        console.error(`Claude API error (${response.status}):`, text);
        throw new Error(`Claude API error: ${response.status} ${text}`);
      }
      
      // Safely parse the JSON response
      let data;
      try {
        data = response.headers.get('content-type')?.includes('json')
          ? JSON.parse(text)
          : { error: text };
      } catch (e) {
        console.error("Failed to parse response as JSON:", text.substring(0, 200));
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.content && data.content[0] && data.content[0].text) {
        return parseCodeBlocks(data.content[0].text);
      } else {
        throw new Error("Unexpected response format from Claude API");
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }
}

export default ClaudeService;
