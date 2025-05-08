
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
    
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    const model = import.meta.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229";
    
    if (!apiKey) {
      throw new Error("Claude API key is not configured");
    }
    
    console.log("Generating code with Claude API using model:", model);
    
    // Format the request body for Claude API directly
    const requestBody = {
      model: model,
      max_tokens: options.maxOutputTokens || 4000,
      temperature: options.temperature || 0.7,
      messages: [
        {
          role: "system",
          content: options.system || "You are an AI that generates React + Tailwind webapps. Return code as markdown code blocks."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    };
    
    if (Object.keys(filesObj).length > 0) {
      // Add existing files as context in a separate message
      const filesContext = Object.entries(filesObj)
        .map(([path, content]) => `${path}:\n${content}`)
        .join('\n\n');
      
      requestBody.messages.push({
        role: "user",
        content: `Existing files:\n${filesContext}`
      });
    }
    
    console.log("Sending request to Claude API with prompt:", prompt.substring(0, 50) + "...");
    
    // Make the direct API call to Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
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
    
    // Handle different response formats
    let responseText = '';
    
    if (data.content && data.content[0] && data.content[0].type === 'text') {
      responseText = data.content[0].text;
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
