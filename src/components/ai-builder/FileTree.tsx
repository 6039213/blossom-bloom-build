
import React from 'react';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  files: Array<{ path: string; content: string }>;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ files, activeFile, onFileSelect }) => {
  // Create a tree structure from flat file paths
  const createFileTree = () => {
    const tree = {};
    
    // Sort files to ensure consistent order
    const sortedFiles = [...files].sort((a, b) => {
      // Sort by directory first, then by filename
      const dirsA = a.path.split('/');
      const dirsB = b.path.split('/');
      
      // If path lengths are different, shorter paths come first
      for (let i = 0; i < Math.min(dirsA.length, dirsB.length); i++) {
        if (dirsA[i] !== dirsB[i]) {
          return dirsA[i].localeCompare(dirsB[i]);
        }
      }
      
      return dirsA.length - dirsB.length;
    });
    
    sortedFiles.forEach(file => {
      const pathParts = file.path.split('/');
      let current = tree;
      
      // Create nested objects for directories
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      // Add the file to the deepest level
      const fileName = pathParts[pathParts.length - 1];
      current[fileName] = file.path;
    });
    
    return tree;
  };
  
  // Determine file icon based on extension
  const getFileIcon = (path: string) => {
    const extension = path.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return <File className="h-4 w-4 text-yellow-400" />;
      case 'ts':
      case 'tsx':
        return <File className="h-4 w-4 text-blue-400" />;
      case 'css':
        return <File className="h-4 w-4 text-purple-400" />;
      case 'json':
        return <File className="h-4 w-4 text-green-400" />;
      case 'html':
        return <File className="h-4 w-4 text-orange-400" />;
      case 'md':
        return <File className="h-4 w-4 text-gray-400" />;
      default:
        return <File className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // Renders a directory and its contents
  const renderDirectory = (dirname: string, contents: any, pathPrefix = '') => {
    const path = pathPrefix ? `${pathPrefix}/${dirname}` : dirname;
    const [isOpen, setIsOpen] = React.useState(true);
    
    // Get sorted entries for the directory
    const entries = Object.entries(contents).sort((a, b) => {
      // Sort directories first, then files
      const aIsDir = typeof a[1] === 'object';
      const bIsDir = typeof b[1] === 'object';
      
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      
      // Alphabetical sort within same type
      return a[0].localeCompare(b[0]);
    });
    
    return (
      <div key={path} className="pl-2">
        <button 
          className="flex items-center py-1 hover:text-blue-500 w-full text-left"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
          <Folder className="h-4 w-4 text-blue-400 mr-1" />
          <span className="text-sm truncate">{dirname}</span>
        </button>
        
        {isOpen && (
          <div className="ml-2 border-l border-gray-700 pl-2">
            {entries.map(([name, value]) => {
              if (typeof value === 'object') {
                // Render subdirectory
                return renderDirectory(name, value, path);
              } else {
                // Render file
                return renderFile(name, value as string);
              }
            })}
          </div>
        )}
      </div>
    );
  };
  
  // Renders a file item
  const renderFile = (filename: string, path: string) => {
    const isActive = path === activeFile;
    
    return (
      <div 
        key={path}
        className={cn(
          "flex items-center py-1 pl-6 cursor-pointer hover:bg-gray-800 rounded",
          isActive ? "bg-gray-800 text-blue-400" : ""
        )}
        onClick={() => onFileSelect(path)}
      >
        {getFileIcon(filename)}
        <span className="ml-1 text-sm truncate">{filename}</span>
      </div>
    );
  };
  
  // Build the file tree structure
  const fileTree = createFileTree();
  
  return (
    <div className="h-full p-2 overflow-y-auto bg-gray-900 text-gray-200">
      <h3 className="font-medium text-sm mb-2 text-gray-400 uppercase px-2">Project Files</h3>
      {Object.entries(fileTree).map(([name, value]) => {
        if (typeof value === 'object') {
          return renderDirectory(name, value);
        } else {
          return renderFile(name, value as string);
        }
      })}
    </div>
  );
};

export default FileTree;
