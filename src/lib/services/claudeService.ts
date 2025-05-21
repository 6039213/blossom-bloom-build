import { callClaude } from '../../api/claude';
import { toast } from 'sonner';

interface FileContent {
  path: string;
  content: string;
}

// Use the environment variable API key
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const MODEL_NAME = import.meta.env.VITE_CLAUDE_MODEL || "claude-3-sonnet-20240229";

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
  static async generateCode(prompt: string, options: {
    system?: string;
    model?: string;
    max_tokens?: number;
    temperature?: number;
  } = {}) {
    try {
      const response = await callClaude({
        prompt,
        system: options.system || "You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS.",
        model: options.model || MODEL_NAME,
        max_tokens: options.max_tokens || 4000,
        temperature: options.temperature || 0.7
      });

      if (response.error) {
        toast.error(response.error);
        throw new Error(response.error);
      }

      return parseCodeBlocks(response.content || '');
    } catch (error) {
      console.error('Error generating code:', error);
      throw error;
    }
  }

  static extractCodeBlocks(text: string): string[] {
    const codeBlockRegex = /```[\s\S]*?```/g;
    return text.match(codeBlockRegex) || [];
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
      max_tokens: 4000,
    };
    
    // If we have a streaming callback, simulate it for now with the prompt
    if (onStreamUpdate) {
      onStreamUpdate("Processing request...");
      
      // Simulate thinking process with delay
      await new Promise(resolve => setTimeout(resolve, 500));
      onStreamUpdate("Analyzing prompt and existing code...");
      
      // Give more detailed updates as we "think"
      await new Promise(resolve => setTimeout(resolve, 1000));
      onStreamUpdate("Generating code based on your requirements...");
    }
    
    try {
      const codeBlocks = await ClaudeService.generateCode(fullPrompt, options);
      
      // Combine all code blocks into a single response for processing
      let fullResponse = "";
      codeBlocks.forEach(block => {
        fullResponse += `\`\`\`jsx ${block.path}\n${block.content}\n\`\`\`\n\n`;
      });
      
      // If we're streaming, provide the final response
      if (onStreamUpdate) {
        onStreamUpdate(fullResponse);
      }
      
      return fullResponse;
    } catch (error) {
      console.error("Error in generateCode:", error);
      
      if (onStreamUpdate) {
        onStreamUpdate(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      throw error;
    }
  } catch (error) {
    console.error("Error in generateCode:", error);
    throw error;
  }
};

export const extractFilesFromResponse = (responseText: string): FileContent[] => {
  return ClaudeService.extractCodeBlocks(responseText).map(block => ({
    path: `file${responseText.split('\n').length - 1}.js`,
    content: block
  }));
};

export default ClaudeService;
