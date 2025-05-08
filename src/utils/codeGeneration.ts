
/**
 * Extract code blocks from a text response
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
 * Get file type based on extension
 */
export const getFileType = (path: string): string => {
  if (path.endsWith('.js')) return 'javascript';
  if (path.endsWith('.jsx')) return 'jsx';
  if (path.endsWith('.ts')) return 'typescript';
  if (path.endsWith('.tsx')) return 'tsx';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.scss')) return 'scss';
  if (path.endsWith('.html')) return 'html';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.md')) return 'markdown';
  return 'plaintext';
};
