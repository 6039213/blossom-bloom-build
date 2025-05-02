
import { v4 as uuidv4 } from 'uuid';

// Object for temporary storage of uploaded files in memory
// In a production app, we'd use a proper storage service
const uploadedFilesCache: Record<string, { data: string, name: string, type: string }> = {};

/**
 * Upload a file to in-memory storage and return a unique URL
 */
export const uploadFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader();
      
      fileReader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error("Failed to read file"));
          return;
        }
        
        const fileId = uuidv4();
        const fileUrl = `file://${fileId}`;
        
        // Store the file in memory
        uploadedFilesCache[fileId] = {
          data: event.target.result as string,
          name: file.name,
          type: file.type
        };
        
        resolve(fileUrl);
      };
      
      fileReader.onerror = (error) => {
        console.error("File read error:", error);
        reject(new Error("Failed to read file"));
      };
      
      // Read the file as a data URL for images or text for code
      if (file.type.startsWith('image/')) {
        fileReader.readAsDataURL(file);
      } else {
        fileReader.readAsText(file);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      reject(error);
    }
  });
};

/**
 * Get a previously uploaded file from the cache
 */
export const getUploadedFile = (fileUrl: string) => {
  if (!fileUrl.startsWith('file://')) return null;
  
  const fileId = fileUrl.replace('file://', '');
  return uploadedFilesCache[fileId] || null;
};

/**
 * Clear all uploaded files from memory
 */
export const clearUploadedFiles = () => {
  Object.keys(uploadedFilesCache).forEach((key) => {
    delete uploadedFilesCache[key];
  });
};

/**
 * Extract code files from Claude's response
 */
export const extractCodeFilesFromResponse = (content: string): Array<{ path: string, content: string }> => {
  const codeFiles: Array<{ path: string, content: string }> = [];
  
  // Match different code block formats
  const codeBlockRegex = /```(?:typescript|tsx|jsx|ts|js|html|css|json)?\s*([^\n]+)?\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const path = match[1]?.trim();
    const codeContent = match[2].trim();
    
    if (path && codeContent) {
      codeFiles.push({ path, content: codeContent });
    }
  }
  
  // Also try file header format
  const fileHeaderRegex = /\/\/\s*FILE:\s*([^\n]+)\n([\s\S]*?)(?=\/\/\s*FILE:|$)/g;
  while ((match = fileHeaderRegex.exec(content)) !== null) {
    const path = match[1]?.trim();
    const codeContent = match[2].trim();
    
    if (path && codeContent) {
      codeFiles.push({ path, content: codeContent });
    }
  }
  
  return codeFiles;
};

/**
 * Format code with syntax highlighting
 */
export const formatCodeForDisplay = (code: string, language: string = 'tsx') => {
  // This is a simple syntax highlighting implementation
  // In a production app, you'd use a library like Prism or highlight.js
  
  // Handle JSX/TSX highlighting
  if (language === 'tsx' || language === 'jsx') {
    // Highlight some common JSX/React patterns
    return code
      .replace(/import\s+.*?from\s+['"].*?['"]/g, '<span class="text-purple-600">$&</span>')
      .replace(/export\s+(default\s+)?/g, '<span class="text-blue-600">$&</span>')
      .replace(/const|let|var|function|class|interface|type|extends|implements/g, '<span class="text-blue-600">$&</span>')
      .replace(/return/g, '<span class="text-blue-600">$&</span>')
      .replace(/\{.*?\}/g, '<span class="text-yellow-600">$&</span>')
      .replace(/\<.*?\>/g, '<span class="text-green-600">$&</span>')
      .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>');
  }
  
  // Default syntax highlighting
  return code
    .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>')
    .replace(/["'`].*?["'`]/g, '<span class="text-green-600">$&</span>')
    .replace(/\b(function|const|let|var|if|else|for|while|return)\b/g, '<span class="text-blue-600">$&</span>');
};

/**
 * Determine the language from the file extension
 */
export const getLanguageFromFilePath = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  
  switch (ext) {
    case 'ts': return 'typescript';
    case 'tsx': return 'tsx';
    case 'js': return 'javascript';
    case 'jsx': return 'jsx';
    case 'css': return 'css';
    case 'html': return 'html';
    case 'json': return 'json';
    case 'md': return 'markdown';
    default: return 'text';
  }
};
