
export interface FileContent {
  path: string;
  content: string;
}

export const extractFilesFromResponse = (text: string): FileContent[] => {
  try {
    // Try to parse as JSON directly
    try {
      const jsonData = JSON.parse(text);
      return Object.entries(jsonData).map(([path, content]) => ({
        path,
        content: content as string,
      }));
    } catch (jsonError) {
      console.error("Error parsing direct JSON:", jsonError);
      
      // If direct JSON parsing fails, try to extract JSON from markdown
      const jsonPattern = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
      const match = text.match(jsonPattern);
      
      if (match && match[1]) {
        const jsonData = JSON.parse(match[1]);
        return Object.entries(jsonData).map(([path, content]) => ({
          path,
          content: content as string,
        }));
      }
      
      // If structured formats fail, use regex to extract file blocks
      const fileBlocks = [];
      const fileRegex = /```(?:\w+)?\s*(?:\/\/|#)?\s*(?:File:\s*)?([^\s]+)\s*\n([\s\S]*?)```/g;
      let fileMatch;
      
      while ((fileMatch = fileRegex.exec(text)) !== null) {
        fileBlocks.push({
          path: fileMatch[1].trim(),
          content: fileMatch[2].trim(),
        });
      }
      
      if (fileBlocks.length > 0) {
        return fileBlocks;
      }
      
      throw new Error("Could not extract file content from response");
    }
  } catch (error) {
    console.error("Error extracting files:", error);
    throw new Error("Failed to parse Claude's response into files");
  }
};

export const generateCode = async (
  prompt: string,
  existingFiles: FileContent[] = [],
  onProgress?: (text: string) => void
): Promise<string> => {
  try {
    // Prepare file context for Claude
    const fileContext = existingFiles.length > 0
      ? "Current project files:\n" + 
        existingFiles.map(file => `${file.path}:\n\`\`\`\n${file.content}\n\`\`\``).join('\n\n')
      : "";

    const messages = [
      { 
        role: "system", 
        content: `You are an AI that only generates React web applications using React and Tailwind CSS.
Always return your response as a JSON object where keys are file paths and values are file contents.
Do not include any explanations or markdown - ONLY JSON.
Example format: {"App.jsx": "import React from 'react'..."}.
For component files, use JSX extension. Follow React best practices.`
      },
      { 
        role: "user", 
        content: prompt 
      }
    ];

    // Add the file context as a separate message if there are existing files
    if (existingFiles.length > 0) {
      messages.push({
        role: "user",
        content: fileContext
      });
    }

    // Make API call to our backend endpoint
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract content from the Claude response
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error("Invalid response format from Claude API");
    }
    
    const responseText = data.content[0].text;
    
    if (onProgress) {
      onProgress(responseText);
    }
    
    return responseText;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw new Error(`Failed to generate code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
