
import React from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileExplorerProps {
  files: Array<{
    path: string;
    content: string;
    type: string;
  }>;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

export default function FileExplorer({ files, activeFile, onFileSelect }: FileExplorerProps) {
  // Build a file tree structure from flat file paths
  const buildFileTree = () => {
    const tree: any = {};
    
    files.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // This is a file
          if (!current[part]) {
            current[part] = { 
              type: 'file', 
              path: file.path, 
              fileType: file.type 
            };
          }
        } else {
          // This is a directory
          if (!current[part]) {
            current[part] = { type: 'directory', children: {} };
          }
          current = current[part].children;
        }
      });
    });
    
    return tree;
  };

  // Render the file tree recursively
  const renderTree = (tree: any, path = '', level = 0) => {
    return Object.entries(tree).map(([key, value]: [string, any]) => {
      const currentPath = path ? `${path}/${key}` : key;
      
      if (value.type === 'directory') {
        // Render a directory
        const [isOpen, setIsOpen] = React.useState(level < 2); // Auto-expand first two levels
        
        return (
          <div key={currentPath}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start px-2 py-1 h-auto text-sm font-normal"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="mr-1">
                {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </span>
              <Folder className="h-3.5 w-3.5 mr-1 text-blue-500" />
              <span>{key}</span>
            </Button>
            
            {isOpen && (
              <div className="pl-4">
                {renderTree(value.children, currentPath, level + 1)}
              </div>
            )}
          </div>
        );
      } else {
        // Render a file
        const isActive = currentPath === activeFile;
        const getFileIcon = () => {
          switch (value.fileType) {
            case 'javascript':
            case 'javascriptreact':
              return <File className="h-3.5 w-3.5 mr-1 text-yellow-500" />;
            case 'typescript':
            case 'typescriptreact':
              return <File className="h-3.5 w-3.5 mr-1 text-blue-500" />;
            case 'css':
              return <File className="h-3.5 w-3.5 mr-1 text-purple-500" />;
            case 'html':
              return <File className="h-3.5 w-3.5 mr-1 text-orange-500" />;
            default:
              return <File className="h-3.5 w-3.5 mr-1 text-gray-500" />;
          }
        };
        
        return (
          <Button
            key={currentPath}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={`w-full justify-start px-2 py-1 h-auto text-sm font-normal ${
              isActive ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' : ''
            }`}
            onClick={() => onFileSelect(currentPath)}
          >
            {getFileIcon()}
            <span className="truncate">{key}</span>
          </Button>
        );
      }
    });
  };
  
  const fileTree = buildFileTree();

  return (
    <div className="overflow-y-auto h-full p-1">
      {files.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground text-sm">
          No files generated yet. Create a website using the prompt to see files here.
        </div>
      ) : (
        <div className="space-y-1">
          {renderTree(fileTree)}
        </div>
      )}
    </div>
  );
}
