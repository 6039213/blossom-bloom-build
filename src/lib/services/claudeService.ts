
import { toast } from "sonner";

export interface FileContent {
  path: string;
  content: string;
}

// Standard prompt system message that ensures Claude returns pure JSON
const DEFAULT_SYSTEM_PROMPT = `You are an AI that generates React web applications using React and Tailwind CSS.
Always return your response as a JSON object where keys are file paths and values are file contents.
Do not include any explanations or markdown - ONLY JSON.
Example format: {"App.jsx": "import React from 'react'..."}.
For component files, use JSX extension. Follow React best practices.`;

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
    // Create the user message with the prompt
    const userMessage = {
      role: 'user',
      content: prompt
    };
    
    // Format the request body
    const requestBody = {
      system: options.system || DEFAULT_SYSTEM_PROMPT,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxOutputTokens || 4000,
      messages: [userMessage],
      files: existingFiles // Pass all existing files in the context
    };
    
    console.log("Sending request to Claude API with files:", existingFiles.length);
    
    // Make the API call
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Claude API response:", data);
    
    // Extract the text content from Claude's response
    if (!data.content || !data.content[0] || data.content[0].type !== 'text') {
      throw new Error("Unexpected response format from Claude API");
    }
    
    const responseText = data.content[0].text;
    
    // Call the stream update callback with the full response
    if (onStreamUpdate) {
      onStreamUpdate(responseText);
    }
    
    return responseText;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw new Error(`Failed to generate code: ${error.message}`);
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
    console.error("API Error:", error);
    toast.error(`Error extracting files: ${error.message}`);
    return [];
  }
};
