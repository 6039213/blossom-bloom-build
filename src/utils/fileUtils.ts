
import { v4 as uuidv4 } from 'uuid';
import { FileContent } from '@/types/project';
import { placeholderImages } from './sampleImages';

const FILE_EXT_LANGUAGES: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  css: 'css',
  scss: 'scss',
  html: 'html',
  json: 'json',
  md: 'markdown',
  py: 'python',
};

// Simulate file upload and return a URL
export const uploadFile = async (file: File): Promise<string> => {
  try {
    // This is a mock implementation
    // In a real app, you would upload to a storage service
    
    // For images, use base64 to avoid 404s
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Return the base64 string
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
    
    // For other files, return a fake URL
    const fileId = uuidv4().substring(0, 8);
    return `lovable-uploads/${fileId}-${file.name}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

// Mock function to get an uploaded file
export const getUploadedFile = async (url: string): Promise<string> => {
  // Check if it's a base64 image
  if (url.startsWith('data:image/')) {
    return url;
  }
  
  // For template images, return placeholder
  const fileName = url.split('/').pop() || '';
  for (const key in placeholderImages) {
    if (fileName.includes(key)) {
      return placeholderImages[key];
    }
  }
  
  // Return empty string for files we can't retrieve
  return '';
};

// Helper to format code for display
export const formatCodeForDisplay = (code: string): string => {
  return code.replace(/\t/g, '  ');
};

// Get language from file path
export const getLanguageFromFilePath = (filePath: string): string => {
  const extension = filePath.split('.').pop() || '';
  return FILE_EXT_LANGUAGES[extension.toLowerCase()] || 'plaintext';
};

// Extract code files from AI response
export const extractCodeFilesFromResponse = (response: string): FileContent[] => {
  const files: FileContent[] = [];
  
  // Pattern to match code blocks with filenames in format:
  // ```tsx src/components/ComponentName.tsx
  // ...code...
  // ```
  const codeBlockPattern = /```([a-z]+)?\s+([a-zA-Z0-9_\-./]+)\s*\n([\s\S]*?)```/g;
  
  let match;
  while ((match = codeBlockPattern.exec(response)) !== null) {
    // match[1] is language (optional)
    // match[2] is the file path
    // match[3] is the code content
    const filePath = match[2].trim();
    const fileContent = match[3].trim();
    
    if (filePath && fileContent) {
      files.push({
        path: filePath,
        content: fileContent
      });
    }
  }
  
  return files;
};
