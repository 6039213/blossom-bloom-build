
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

// Add the missing exports needed by BlossomAIWebBuilder
export const generateCode = async (
  prompt: string,
  existingFiles: FileContent[] = [],
  onStreamUpdate?: (text: string) => void
): Promise<string> => {
  let filesContext = "";
  
  // If we have existing files, include them in the prompt
  if (existingFiles.length > 0) {
    filesContext = "\n\nHere are the current project files:\n\n";
    existingFiles.forEach(file => {
      filesContext += `File: ${file.path}\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
    });
  }
  
  // Combine the prompt with file context
  const fullPrompt = `${prompt}${filesContext}
  
Please generate or update React code files based on the prompt. For each file, use the format:
\`\`\`jsx filename.jsx
// Code here
\`\`\`

The code should work with React, Tailwind CSS, and use modern ES6+ syntax.`;

  try {
    // Call Claude API through our service method
    const options = {
      system: "You are an expert React developer that creates clean, responsive websites using React and Tailwind CSS. Return only code files with clear file names.",
      temperature: 0.7,
      maxTokens: 4000,
      thinkingBudget: onStreamUpdate ? 800 : undefined  // Only use thinking if we want streaming
    };
    
    // If we have a streaming callback, simulate it for now with the prompt
    // (In a real implementation, you'd use actual streaming from the API)
    if (onStreamUpdate) {
      onStreamUpdate("Processing request...");
      
      // Simulate thinking process with delay
      await new Promise(resolve => setTimeout(resolve, 500));
      onStreamUpdate("Analyzing prompt and existing code...");
      
      // Give more detailed updates as we "think"
      await new Promise(resolve => setTimeout(resolve, 1000));
      onStreamUpdate("Generating code based on your requirements...");
    }
    
    const codeBlocks = await ClaudeService.generateCode(fullPrompt, options);
    
    // Combine all code blocks into a single response for processing
    let fullResponse = "";
    codeBlocks.forEach(file => {
      fullResponse += `\`\`\`jsx ${file.path}\n${file.content}\n\`\`\`\n\n`;
    });
    
    // If we're streaming, provide the final response
    if (onStreamUpdate) {
      onStreamUpdate(fullResponse);
    }
    
    return fullResponse;
  } catch (error) {
    console.error("Error in generateCode:", error);
    throw error;
  }
};

export const extractFilesFromResponse = (responseText: string): FileContent[] => {
  return ClaudeService.extractCodeBlocks(responseText);
};

export default ClaudeService;
