
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';

interface FileExplorerProps {
  files: Array<{path: string; content: string; type?: string}>;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

export default function FileExplorer({ files, activeFile, onFileSelect }: FileExplorerProps) {
  // Group files by directory
  const getFileStructure = () => {
    const structure: Record<string, Array<{path: string; name: string; type?: string}>> = {
      '/': []
    };
    
    files.forEach(file => {
      const parts = file.path.split('/');
      const fileName = parts.pop() || '';
      const directory = parts.join('/') || '/';
      
      if (!structure[directory]) {
        structure[directory] = [];
      }
      
      structure[directory].push({
        path: file.path,
        name: fileName,
        type: file.type
      });
    });
    
    return structure;
  };
  
  // Get icon based on file extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'tsx':
      case 'jsx':
        return <FileText size={16} className="text-blue-500" />;
      case 'css':
        return <FileText size={16} className="text-purple-500" />;
      case 'json':
        return <FileText size={16} className="text-yellow-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };
  
  const fileStructure = getFileStructure();
  
  // Get directory tree
  const renderDirectory = (dir: string, level = 0) => {
    const files = fileStructure[dir] || [];
    if (files.length === 0) return null;
    
    return (
      <div key={dir} style={{ paddingLeft: `${level * 16}px` }}>
        {dir !== '/' && (
          <div className="flex items-center py-1 px-2 text-sm">
            <ChevronDown className="h-4 w-4 mr-1" />
            <Folder className="h-4 w-4 mr-1 text-yellow-500" />
            <span>{dir.split('/').pop()}</span>
          </div>
        )}
        
        <div>
          {files.map(file => (
            <div 
              key={file.path}
              className={`flex items-center py-1 px-2 text-sm cursor-pointer hover:bg-accent ${
                activeFile === file.path ? 'bg-accent text-accent-foreground' : ''
              }`}
              style={{ paddingLeft: `${(level + 1) * 16}px` }}
              onClick={() => onFileSelect(file.path)}
            >
              {getFileIcon(file.name)}
              <span className="ml-1">{file.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-2 border-b bg-muted/30">
        <h3 className="font-medium text-sm">Project Files</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {files.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No files available
            </div>
          ) : (
            Object.keys(fileStructure).sort().map(dir => renderDirectory(dir))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
