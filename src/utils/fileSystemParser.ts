
import { toast } from 'sonner';

export interface FileDefinition {
  path: string;
  content: string;
}

/**
 * Parse JSON output from Claude into an array of file definitions
 */
export const parseClaudeOutput = (output: string): FileDefinition[] => {
  try {
    // Try to extract the JSON portion from Claude's response
    const jsonRegex = /\[\s*{[\s\S]*}\s*\]/g;
    const match = output.match(jsonRegex);
    
    if (!match) {
      console.error("Could not extract JSON from Claude's response");
      toast.error("Failed to parse AI response into files");
      return [];
    }
    
    // Parse the JSON
    const files = JSON.parse(match[0]);
    
    // Validate the structure
    if (!Array.isArray(files) || !files.every(file => file.path && file.content)) {
      console.error("Invalid file structure in Claude's response");
      toast.error("AI response has invalid file structure");
      return [];
    }
    
    return files;
  } catch (error) {
    console.error("Error parsing Claude output:", error);
    toast.error("Failed to parse AI-generated code");
    return [];
  }
};

/**
 * Convert file definitions to the format expected by the code preview
 */
export const convertToProjectFiles = (files: FileDefinition[]): Record<string, { code: string }> => {
  const projectFiles: Record<string, { code: string }> = {};
  
  files.forEach(file => {
    projectFiles[file.path] = { code: file.content };
  });
  
  return projectFiles;
};

/**
 * Group files by directory for better organization
 */
export const groupFilesByDirectory = (files: FileDefinition[]): Record<string, FileDefinition[]> => {
  const grouped: Record<string, FileDefinition[]> = {};
  
  files.forEach(file => {
    const directory = file.path.split('/').slice(0, -1).join('/');
    if (!grouped[directory]) {
      grouped[directory] = [];
    }
    grouped[directory].push(file);
  });
  
  return grouped;
};
