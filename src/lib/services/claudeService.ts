
import { toast } from "sonner";

export interface FileContent {
  path: string;
  content: string;
}

// Standard prompt system message for Claude to return pure JSON
const DEFAULT_SYSTEM_PROMPT = `You are an AI that generates and modifies React + Tailwind web applications. Return only modified files as JSON. No explanation, no markdown, no text outside JSON.`;

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
    
    // Format the request body
    const requestBody = {
      prompt: prompt,
      system: options.system || DEFAULT_SYSTEM_PROMPT,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxOutputTokens || 4000,
      files: filesObj
    };
    
    console.log("Sending request to Claude API with files:", existingFiles.length);
    
    // Make the API call to our backend endpoint
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Claude API:", errorText);
      
      // Check for HTML response which indicates an error
      if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
        throw new Error(`Claude API error: The server returned HTML instead of JSON. This might indicate a server-side error.`);
      }
      
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle the response based on format
    let responseText = '';
    
    if (data.content && typeof data.content === 'object') {
      responseText = JSON.stringify(data.content, null, 2);
    } else if (data.content && data.content[0] && data.content[0].type === 'text') {
      responseText = data.content[0].text;
    } else if (data.error) {
      throw new Error(data.error);
    } else if (data.rawResponse) {
      responseText = data.rawResponse;
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
    // Look for JSON in the response (ignore any markdown or explanations)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response");
    }
    
    // Parse the JSON object from Claude's response
    const filesObject = JSON.parse(jsonMatch[0]);
    
    // Convert the object into an array of FileContent objects
    const files: FileContent[] = Object.entries(filesObject).map(([path, content]) => ({
      path,
      content: content as string
    }));
    
    return files;
  } catch (error) {
    console.error("Error extracting files:", error);
    toast.error(`Error extracting files: ${error.message}`);
    return [];
  }
};
