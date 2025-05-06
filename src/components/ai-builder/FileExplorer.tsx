
import React from 'react';
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  // Organize files into a directory structure
  const fileSystem = React.useMemo(() => {
    const system: Record<string, any> = { 
      children: {},
      isDirectory: true,
      name: 'root'
    };
    
    // Sort files by path to ensure consistent ordering
    const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));
    
    sortedFiles.forEach(file => {
      const parts = file.path.split('/');
      let current = system;
      
      // Build the directory structure
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        
        if (!current.children[part]) {
          current.children[part] = {
            children: {},
            isDirectory: !isFile,
            name: part,
            ...(isFile ? { content: file.content, type: file.type, path: file.path } : {})
          };
        }
        
        current = current.children[part];
      });
    });
    
    return system;
  }, [files]);
  
  const renderFileTree = (node: any, path: string[] = [], level: number = 0) => {
    if (!node) return null;
    
    const nodePath = [...path, node.name].filter(p => p !== 'root').join('/');
    const isActive = nodePath === activeFile;
    
    // For files
    if (!node.isDirectory) {
      const fileExtension = node.name.split('.').pop()?.toLowerCase();
      
      return (
        <div
          key={nodePath}
          className={cn(
            "flex items-center py-1 px-2 rounded-md cursor-pointer text-sm",
            isActive 
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
          style={{ paddingLeft: `${(level + 1) * 12}px` }}
          onClick={() => onFileSelect(nodePath)}
        >
          <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500 dark:text-gray-400" />
          <span className="truncate">{node.name}</span>
        </div>
      );
    }
    
    // For directories
    const [isOpen, setIsOpen] = React.useState(true);
    const hasChildren = Object.keys(node.children).length > 0;
    
    return (
      <div key={`dir-${nodePath || 'root'}`}>
        {node.name !== 'root' && (
          <div
            className="flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-sm font-medium"
            style={{ paddingLeft: `${level * 12}px` }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {hasChildren ? (
              isOpen ? 
                <ChevronDown className="h-4 w-4 mr-1 text-gray-500" /> :
                <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
            ) : (
              <span className="w-4 mr-1" />
            )}
            <Folder className="h-4 w-4 mr-2 text-blue-500" />
            <span>{node.name}</span>
          </div>
        )}
        
        {isOpen && hasChildren && (
          <div className={node.name === 'root' ? '' : 'ml-2'}>
            {Object.values(node.children)
              .sort((a: any, b: any) => {
                // Directories first, then by name
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
              })
              .map((child: any) => renderFileTree(child, [...path, node.name], level + (node.name === 'root' ? 0 : 1)))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto">
      {files.length > 0 ? (
        renderFileTree(fileSystem)
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Folder className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-muted-foreground">No files generated yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Generate a website to see files here
          </p>
        </div>
      )}
    </div>
  );
}
