
import { toast } from "sonner";

export interface FileContent {
  path: string;
  content: string;
}

/**
 * Generate code based on a prompt and existing files
 */
export const generateCode = async (
  prompt: string,
  existingFiles: FileContent[] = [],
  onStreamUpdate?: (streamedText: string) => void,
  options: {
    temperature?: number;
    maxOutputTokens?: number;
    system?: string;
  } = {}
): Promise<string> => {
  try {
    // Convert files array to object format expected by the API
    const filesObj: Record<string, string> = {};
    existingFiles.forEach(file => {
      filesObj[file.path] = file.content;
    });
    
    console.log("Generating code with Claude API using model:", import.meta.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229");
    
    // Format the request body for our API endpoint
    const requestBody = {
      system: options.system || "You are an AI that generates React + Tailwind webapps. Return code as markdown code blocks.",
      prompt: prompt,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxOutputTokens || 4000,
      files: filesObj
    };
    
    console.log("Sending request to Claude API with prompt:", prompt.substring(0, 50) + "...");
    
    // Make the API call to our local endpoint instead of directly to Anthropic
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error response:", errorText);
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Claude API response received:", data ? "Valid data" : "Invalid data");
    
    // Extract content from response
    let responseText = '';
    
    if (data.content) {
      responseText = data.content;
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error("Unexpected response format from Claude API");
    }
    
    // Call the stream update callback with the full response
    if (onStreamUpdate) {
      onStreamUpdate(responseText);
    }
    
    return responseText;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    toast.error(`Failed to generate code: ${error.message}`);
    throw error;
  }
};

/**
 * Extract individual files from Claude's response
 */
export const extractFilesFromResponse = (responseText: string): FileContent[] => {
  try {
    // Use the external utility to extract code blocks
    const codeBlocks = extractCodeBlocks(responseText);
    
    // Convert the object into an array of FileContent objects
    const files: FileContent[] = Object.entries(codeBlocks).map(([path, content]) => ({
      path,
      content: content
    }));
    
    return files;
  } catch (error) {
    console.error("Error extracting files:", error);
    toast.error(`Error extracting files: ${error.message}`);
    return [];
  }
};

// Extract code blocks from text response
const extractCodeBlocks = (text: string): Record<string, string> => {
  const files: Record<string, string> = {};
  
  // Match code blocks with format: ```jsx filename.jsx ... ```
  const codeBlockRegex = /```(?:jsx|tsx|ts|js|css|html|json)?\s+([^\n]+)\s*\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const [_, filePath, code] = match;
    if (filePath && code) {
      // Clean up the file path
      const cleanPath = filePath.trim();
      files[cleanPath] = code.trim();
    }
  }
  
  return files;
};
