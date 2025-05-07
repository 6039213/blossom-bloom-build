
import { CLAUDE_API_KEY } from '@/lib/constants';

export interface FileContent {
  path: string;
  content: string;
}

interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ClaudeResponse {
  content: [{ text: string }];
  id: string;
  model: string;
  role: string;
  type: string;
}

const CLAUDE_MODEL = "claude-3-7-sonnet-20250219"; // Using the latest model

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
      const fileRegex = /```(?:\w+)?\s*(?:\/\/|#)?\s*File:\s*([^\s]+)\s*\n([\s\S]*?)```/g;
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
  if (!CLAUDE_API_KEY) {
    throw new Error("Claude API key is missing. Please set it in the environment variables.");
  }

  // Prepare file context for Claude
  const fileContext = existingFiles.length > 0
    ? "\n\nCurrent project files:\n" + 
      existingFiles.map(file => `${file.path}:\n\`\`\`\n${file.content}\n\`\`\``).join('\n\n')
    : "";

  const messages: ClaudeMessage[] = [
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
      content: prompt + fileContext
    }
  ];

  try {
    // Start response accumulation for streaming
    let accumulatedResponse = '';
    
    // Make API call to Claude
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    // Handle streaming response
    if (!response.body) {
      throw new Error("Response body is null");
    }

    // Set up the stream reader
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.substring(6));
            if (data.type === 'content_block_delta' && data.delta?.text) {
              accumulatedResponse += data.delta.text;
              if (onProgress) {
                onProgress(accumulatedResponse);
              }
            }
          } catch (e) {
            console.error("Error parsing streaming response:", e);
          }
        }
      }
    }
    
    return accumulatedResponse;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw new Error(`Failed to generate code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
