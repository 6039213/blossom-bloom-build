
/**
 * Extract code blocks from Claude's response text
 * @param text Raw text from Claude API response 
 * @returns Object with file paths as keys and code content as values
 */
export function extractCodeBlocks(text: string): Record<string, string> {
  const fileBlocks: Record<string, string> = {};
  
  // Regex to match file blocks with various formats
  const patterns = [
    // Match format: ```jsx src/components/Something.tsx ... ```
    /```(?:jsx|tsx|js|javascript|typescript|ts|css|html|json)?\s+([^\n]+)\n([\s\S]*?)```/g,
    
    // Match format: ```filename: src/components/Something.tsx ... ```
    /```filename:\s*([^\n]+)\n([\s\S]*?)```/g,
    
    // Match format: src/components/Something.tsx ```jsx ... ```
    /([^\s]+\.[a-zA-Z]+)\s*```(?:jsx|tsx|js|javascript|typescript|ts|css|html|json)?\n([\s\S]*?)```/g
  ];
  
  // Try each pattern
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const [_, pathRaw, code] = match;
      
      // Clean up the path - remove colons, extra spaces, etc.
      const path = pathRaw.replace(/filename:/, '').trim();
      
      // Store in our file blocks
      fileBlocks[path] = code.trim();
    }
  }
  
  // If no files found with the patterns, but we have code blocks, create a default index.tsx
  if (Object.keys(fileBlocks).length === 0) {
    const simpleCodeBlockRegex = /```(?:jsx|tsx|js|javascript|typescript|ts)?\n([\s\S]*?)```/g;
    const codeBlocks: string[] = [];
    
    let simpleMatch;
    while ((simpleMatch = simpleCodeBlockRegex.exec(text)) !== null) {
      codeBlocks.push(simpleMatch[1].trim());
    }
    
    if (codeBlocks.length > 0) {
      fileBlocks['index.tsx'] = codeBlocks.join('\n\n');
    }
  }
  
  return fileBlocks;
}

/**
 * Determine the file type based on file extension
 * @param filePath Path to the file 
 * @returns File type as a string
 */
export function getFileType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'ts': return 'typescript';
    case 'tsx': return 'typescriptreact';
    case 'js': return 'javascript';
    case 'jsx': return 'javascriptreact';
    case 'css': return 'css';
    case 'scss': return 'scss';
    case 'less': return 'less';
    case 'json': return 'json';
    case 'html': return 'html';
    case 'md': return 'markdown';
    case 'svg': return 'svg';
    default: return 'plaintext';
  }
}

/**
 * Extracts import statements from code
 * @param code TypeScript/JavaScript code
 * @returns Array of imported module names
 */
export function extractImports(code: string): string[] {
  const importRegex = /import\s+(?:[^"'\n]+\s+from\s+)?["']([^"']+)["']/g;
  const imports: string[] = [];
  
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

/**
 * Creates a simple stub module for import resolution
 * @param moduleName Name of the module to create a stub for 
 * @returns JavaScript stub code
 */
export function createModuleStub(moduleName: string): string {
  return `// Stub for ${moduleName}
export default function ${moduleName.replace(/[^a-zA-Z0-9]/g, '_')}() {
  return null;
}
export const useState = () => [null, () => {}];
export const useEffect = () => {};
`;
}
