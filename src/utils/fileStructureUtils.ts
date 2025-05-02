
import { FileSystemItem } from '@/components/dashboard/FileExplorer';

interface FileMap {
  [path: string]: string;
}

// Convert flat file list to tree structure
export function buildFileTree(files: FileMap): FileSystemItem[] {
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

// Get directory structure as a flat list
export function getFlatDirectories(files: FileMap): string[] {
  const directories = new Set<string>();
  
  Object.keys(files).forEach(path => {
    const parts = path.split('/');
    // Skip the last part (file name)
    parts.pop();
    
    // Add each directory level
    let currentPath = '';
    parts.forEach(part => {
      currentPath += (currentPath ? '/' : '') + part;
      directories.add(currentPath);
    });
  });
  
  return Array.from(directories).sort();
}

// Find common path prefix
export function getCommonPrefix(files: FileMap): string {
  if (Object.keys(files).length === 0) return '';
  
  const paths = Object.keys(files);
  if (paths.length === 1) {
    const parts = paths[0].split('/');
    parts.pop(); // Remove filename
    return parts.join('/');
  }
  
  const firstPath = paths[0].split('/');
  let commonPrefix = '';
  
  for (let i = 0; i < firstPath.length; i++) {
    const part = firstPath[i];
    if (paths.every(path => path.split('/')[i] === part)) {
      commonPrefix += (i === 0 ? '' : '/') + part;
    } else {
      break;
    }
  }
  
  return commonPrefix;
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}
