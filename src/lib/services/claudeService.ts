
import { toast } from "sonner";

export interface FileContent {
  path: string;
  content: string;
  type?: string;
}

// Helper function to parse code blocks from text
export function extractFilesFromResponse(text: string): FileContent[] {
  const regex = /```(?:jsx?|tsx?|html|css)?\s+([^\n]+)?\n([\s\S]*?)```/g;
  const codeBlocks: FileContent[] = [];
  
  let match;
  while ((match = regex.exec(text)) !== null) {
    const path = match[1]?.trim() || `file${codeBlocks.length + 1}.js`;
    const content = match[2]?.trim() || "";
    
    codeBlocks.push({
      path,
      content,
      type: path.split('.').pop() || 'js'
    });
  }
  
  return codeBlocks;
}

/**
 * Generate code using Claude API via our proxy
 */
export async function generateCode(
  prompt: string,
  existingFiles: FileContent[] = [],
  streamingCallback?: (text: string) => void,
  options: { 
    system?: string; 
    temperature?: number; 
    maxTokens?: number;
  } = {}
): Promise<string> {
  try {
    // Prepare system message
    const systemMessage = options.system || 
      "You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS.";
    
    // Prepare context from existing files if any
    let filesContext = "";
    if (existingFiles && existingFiles.length > 0) {
      filesContext = "Here are the existing files in the project:\n\n" +
        existingFiles.map(file => `File: ${file.path}\n\`\`\`\n${file.content}\n\`\`\``).join("\n\n") +
        "\n\nPlease work with these existing files and create new ones as needed.";
    }
    
    // Construct the full prompt
    const fullPrompt = filesContext ? 
      `${filesContext}\n\nNow, based on the existing codebase, ${prompt}` : 
      prompt;
    
    console.log("Generating code with Claude API via proxy...");
    
    // Call our proxy endpoint instead of the API directly
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        system: systemMessage,
        messages: [
          { role: 'user', content: fullPrompt }
        ]
      })
    });
    
    // Get the text response first
    const text = await response.text();
    
    // Handle non-OK responses
    if (!response.ok) {
      console.error(`Claude proxy error (${response.status}):`, text);
      throw new Error(`Claude proxy error: ${response.status} ${text}`);
    }
    
    // Safely parse the JSON response
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse response as JSON:", text.substring(0, 200));
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
    }
    
    if (data.error) {
      throw new Error(data.error.message || data.error);
    }
    
    // Extract the text content from Claude's response
    const responseText = data.content && data.content[0] && data.content[0].text 
      ? data.content[0].text 
      : "";

    // Call streaming callback if provided
    if (streamingCallback && responseText) {
      streamingCallback(responseText);
    }
    
    return responseText;
  } catch (error) {
    console.error("Error generating code:", error);
    toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return "";
  }
}

export class ClaudeService {
  static async generateCode(
    prompt: string,
    options: { 
      system?: string; 
      temperature?: number; 
      maxTokens?: number;
    } = {}
  ): Promise<FileContent[]> {
    const response = await generateCode(prompt, [], undefined, options);
    return extractFilesFromResponse(response);
  }
}

// Default export for convenient importing
export default ClaudeService;
