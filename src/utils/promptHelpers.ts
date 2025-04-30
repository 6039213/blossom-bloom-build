
import { SYSTEM_PROMPT } from '@/lib/constants';

export const enhancePrompt = (userPrompt: string): string => {
  return `${userPrompt}

Please respond with TypeScript (.tsx) files only. Structure your response with clear file indicators like:
// FILE: src/components/Example.tsx
// code here...`;
};

export const getSystemPrompt = (): string => {
  return SYSTEM_PROMPT + `
Always generate React components in TypeScript (.tsx) syntax.
Avoid plain .js or .jsx files.
All CSS should be written using Tailwind classes or in SCSS modules.`;
};

export const extractProjectName = (prompt: string): string => {
  let name = prompt.split('.')[0].split('!')[0].trim();
  
  if (name.length > 50) {
    name = name.substring(0, 47) + '...';
  }
  
  return name || 'New Project';
};

export const parseProjectFiles = (text: string): Record<string, { code: string }> => {
  const fileRegex = /\/\/ FILE: (.*?)\n([\s\S]*?)(?=\/\/ FILE:|$)/g;
  const files: Record<string, { code: string }> = {};
  let match;
  
  while ((match = fileRegex.exec(text)) !== null) {
    const filePath = match[1].trim();
    const fileContent = match[2].trim();
    
    const sandpackPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    
    files[sandpackPath] = { code: fileContent };
  }
  
  return files;
};

export const fixFileExtensions = (files: Record<string, { code: string }>): Record<string, { code: string }> => {
  const result: Record<string, { code: string }> = {};
  
  for (const [path, { code }] of Object.entries(files)) {
    let newPath = path;
    
    if (path.endsWith('.jsx')) {
      newPath = path.replace('.jsx', '.tsx');
    } else if (path.endsWith('.js') && !path.endsWith('.config.js') && code.includes('import React')) {
      newPath = path.replace('.js', '.tsx');
    }
    
    result[newPath] = { code };
  }
  
  return result;
};
