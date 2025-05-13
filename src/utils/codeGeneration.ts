import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility functions for code generation and extraction
 */

/**
 * Extract code blocks from AI response text
 * 
 * @param text The AI response containing code blocks
 * @returns Object with filenames as keys and code content as values
 */
export const extractCodeBlocks = (text: string): Record<string, string> => {
  const files: Record<string, string> = {};
  
  // Match different code block patterns
  
  // Pattern 1: ```jsx src/components/Example.jsx ... ```
  const codeBlockRegex = /```(?:jsx|tsx|js|ts|css|html|json)?\s+([^\n]+)\s*\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const [_, filePath, code] = match;
    if (filePath && code) {
      // Clean up the file path and code
      const cleanPath = filePath.trim();
      files[cleanPath] = code.trim();
    }
  }
  
  // Pattern 2: // FILE: src/components/Example.jsx
  const fileHeaderRegex = /\/\/\s*FILE:\s*([^\n]+)\n([\s\S]*?)(?=\/\/\s*FILE:|$)/g;
  while ((match = fileHeaderRegex.exec(text)) !== null) {
    const [_, filePath, code] = match;
    if (filePath && code) {
      const cleanPath = filePath.trim();
      files[cleanPath] = code.trim();
    }
  }
  
  // Pattern 3: /* FILE: src/components/Example.jsx */
  const blockCommentRegex = /\/\*\s*FILE:\s*([^\n]+)\s*\*\/\n([\s\S]*?)(?=\/\*\s*FILE:|$)/g;
  while ((match = blockCommentRegex.exec(text)) !== null) {
    const [_, filePath, code] = match;
    if (filePath && code) {
      const cleanPath = filePath.trim();
      files[cleanPath] = code.trim();
    }
  }
  
  return files;
};

/**
 * Clean up and validate generated code
 * 
 * @param code The generated code string
 * @returns Cleaned and formatted code string
 */
export const cleanupGeneratedCode = (code: string): string => {
  // Remove special Claude formatting that might cause issues
  return code
    .replace(/```(jsx|tsx|js|ts|css|html|json)?(\s.*)?$/gm, '') // Remove closing code block markers
    .replace(/^```(jsx|tsx|js|ts|css|html|json)?(\s.*)?$/gm, '') // Remove opening code block markers
    .trim();
};

/**
 * Identify the main file from a set of generated files
 * 
 * @param files Object with filenames as keys and code content as values
 * @returns The main file path, or null if none found
 */
export const identifyMainFile = (files: Record<string, string>): string | null => {
  // Check for common main file patterns
  const commonMainFiles = [
    'src/App.tsx', 
    'src/App.jsx',
    'src/index.tsx',
    'src/index.jsx',
    'src/main.tsx',
    'src/main.jsx',
    'index.html'
  ];
  
  for (const file of commonMainFiles) {
    if (files[file]) return file;
  }
  
  // If no common main file is found, return the first file
  const fileNames = Object.keys(files);
  return fileNames.length > 0 ? fileNames[0] : null;
};

/**
 * Generate HTML preview from React code
 * 
 * @param files Object with filenames as keys and code content as values
 * @returns HTML string for previewing
 */
export const generatePreviewHTML = (files: Record<string, string>): string => {
  const mainFile = identifyMainFile(files);
  const mainContent = mainFile ? files[mainFile] : '';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AI Generated Website</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 0; }
      </style>
    </head>
    <body>
      <div id="root">
        <!-- This is a static preview of the generated React code -->
        <div class="p-8">
          <h1 class="text-2xl font-bold mb-4">Preview (Static Render)</h1>
          <p class="mb-4">This is a static preview of your generated React application.</p>
          <div class="p-4 border rounded bg-gray-50">
            <pre class="text-xs overflow-auto max-h-[500px]">${mainContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Get file type based on file extension
 * 
 * @param filePath The path of the file
 * @returns String representing the file type
 */
export const getFileType = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  
  // Map extensions to file types
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'css':
      return 'css';
    case 'scss':
      return 'scss';
    case 'html':
      return 'html';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'svg':
      return 'svg';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
      return 'image';
    default:
      return 'plaintext';
  }
};
