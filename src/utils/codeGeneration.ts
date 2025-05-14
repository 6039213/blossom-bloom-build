
/**
 * Extract code blocks from a markdown-formatted string
 * @param text - The string containing code blocks
 * @returns Record mapping file paths to code content
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
 * Determine the file type based on file extension
 * @param path - The file path
 * @returns String representing the file type for syntax highlighting
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
