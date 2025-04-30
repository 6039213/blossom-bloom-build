
import { FileSystemItem } from '@/components/dashboard/FileExplorer';

// Convert flat file list to tree structure
export function buildFileTree(files: Record<string, string>): FileSystemItem[] {
  const root: FileSystemItem[] = [];
  const paths = Object.keys(files).sort();

  // Create tree structure
  paths.forEach((path) => {
    const parts = path.split('/');
    let currentLevel = root;

    parts.forEach((part, index) => {
      // Check if we're at the file name (last part)
      const isFile = index === parts.length - 1;
      const fullPath = parts.slice(0, index + 1).join('/');
      
      // Check if part already exists in current level
      let found = currentLevel.find(item => item.path.split('/').pop() === part);
      
      if (!found) {
        const newItem: FileSystemItem = {
          path: fullPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : []
        };
        
        if (isFile) {
          newItem.content = files[path];
        }
        
        currentLevel.push(newItem);
        found = newItem;
      }
      
      if (!isFile) {
        currentLevel = found.children || [];
      }
    });
  });

  return root;
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

// Create a new file in the system
export function createNewFile(
  files: Record<string, string>,
  path: string,
  content: string = ''
): Record<string, string> {
  return {
    ...files,
    [path]: content
  };
}

// Delete a file
export function deleteFile(
  files: Record<string, string>,
  path: string
): Record<string, string> {
  const newFiles = { ...files };
  delete newFiles[path];
  return newFiles;
}
