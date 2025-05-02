
interface FileSystemItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileSystemItem[];
  extension?: string;
}

// Generate the file tree structure from a flat list of files
export const buildFileTree = (files: Record<string, string>): FileSystemItem[] => {
  const root: Record<string, FileSystemItem> = {};
  
  // Sort files to ensure consistent ordering
  const sortedFiles = Object.keys(files).sort();
  
  // Process each file path
  for (const path of sortedFiles) {
    const parts = path.split('/');
    let currentLevel = root;
    
    // Process each part of the path except the last one (which is the filename)
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      // Create the directory if it doesn't exist
      if (!currentLevel[part]) {
        currentLevel[part] = {
          name: part,
          path: parts.slice(0, i + 1).join('/'),
          type: 'directory',
          children: []
        };
      }
      
      // Move to the next level
      currentLevel = currentLevel[part].children as Record<string, FileSystemItem>;
    }
    
    // Add the file at the current level
    const fileName = parts[parts.length - 1];
    const extension = fileName.includes('.') ? fileName.split('.').pop() : '';
    
    currentLevel[fileName] = {
      name: fileName,
      path: path,
      type: 'file',
      extension
    };
  }
  
  // Convert the nested object to an array format
  const convertToArray = (obj: Record<string, FileSystemItem>): FileSystemItem[] => {
    return Object.values(obj).map(item => {
      if (item.type === 'directory' && item.children) {
        return {
          ...item,
          children: convertToArray(item.children as Record<string, FileSystemItem>)
        };
      }
      return item;
    }).sort((a, b) => {
      // Sort directories first, then files
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
  };
  
  return convertToArray(root);
};

// Create a new file in the file system
export const createNewFile = (
  existingFiles: Record<string, string>,
  path: string,
  content: string = ''
): Record<string, string> => {
  return {
    ...existingFiles,
    [path]: content
  };
};

// Delete a file from the file system
export const deleteFile = (
  existingFiles: Record<string, string>,
  path: string
): Record<string, string> => {
  const newFiles = { ...existingFiles };
  delete newFiles[path];
  return newFiles;
};

// Rename a file in the file system
export const renameFile = (
  existingFiles: Record<string, string>,
  oldPath: string,
  newPath: string
): Record<string, string> => {
  const newFiles = { ...existingFiles };
  const content = newFiles[oldPath];
  delete newFiles[oldPath];
  newFiles[newPath] = content;
  return newFiles;
};

export default {
  buildFileTree,
  createNewFile,
  deleteFile,
  renameFile
};
