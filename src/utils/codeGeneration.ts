
/**
 * Functions for handling code generation and extraction
 */

/**
 * Extract code blocks from a text response
 * 
 * @param text Text containing markdown code blocks
 * @returns Object with file paths as keys and code content as values
 */
export const extractCodeBlocks = (text: string): Record<string, string> => {
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

/**
 * Determine file type based on file extension
 * 
 * @param path File path with extension
 * @returns The language name for syntax highlighting
 */
export const getFileType = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase() || '';
  
  const typeMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown'
  };
  
  return typeMap[extension] || 'text';
};
