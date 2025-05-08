import { toast } from "sonner";
import config from "../../config";

export interface FileContent {
  path: string;
  content: string;
}

// Standard prompt system message that ensures Claude returns pure JSON
const DEFAULT_SYSTEM_PROMPT = `You are an AI that generates React + Tailwind web applications and modifies existing code. Return only modified files as JSON. No explanations, no markdown, no text outside JSON.`;

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
      model: config.claudeModel,
      messages: [
        {
          role: 'system',
          content: options.system || DEFAULT_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Prompt: ${prompt}${Object.keys(filesObj).length > 0 ? '\n\nExisting files:\n' + Object.entries(filesObj).map(([path, content]) => `${path}:\n${content}`).join('\n\n') : ''}`
        }
      ],
      temperature: options.temperature || config.defaultTemperature,
      max_tokens: options.maxOutputTokens || config.maxTokens
    };
    
    console.log("Sending request to Claude API with files:", existingFiles.length);
    
    // Make the API call directly to Anthropic
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error("Error response from Claude API:", responseText);
      
      // Check for HTML response which indicates an error
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        console.error("Claude API returned HTML instead of JSON:", responseText.substring(0, 200));
        throw new Error(`Claude API endpoint error: The server returned HTML instead of JSON. This might indicate a server-side error or incorrect endpoint configuration.`);
      }
      
      // Try to parse as JSON to get error details
      try {
        const errorData = JSON.parse(responseText);
        console.error("Claude API error response:", errorData);
        throw new Error(`Claude API error: ${errorData.error || response.statusText}`);
      } catch (parseError) {
        console.error("Claude API error response (not JSON):", responseText);
        throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    console.log("Claude API response received:", data ? "Valid data" : "Invalid data");
    
    // Handle different response formats
    let responseText = '';
    
    if (data.content && typeof data.content === 'object') {
      // The backend already extracted and parsed the JSON for us
      responseText = JSON.stringify(data.content, null, 2);
      console.log("Processed JSON content successfully");
    } else if (data.content && data.content[0] && data.content[0].type === 'text') {
      // Standard Claude API response format
      responseText = data.content[0].text;
      console.log("Extracted text content from Claude response");
    } else if (data.error) {
      throw new Error(data.error);
    } else if (data.rawResponse) {
      // Use raw response as fallback
      responseText = data.rawResponse;
      console.log("Using raw response as fallback");
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
