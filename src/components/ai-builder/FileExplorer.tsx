
import React from 'react';
import { Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileContent } from '@/lib/services/anthropicService';

interface FileExplorerProps {
  files: FileContent[];
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

export default function FileExplorer({ files, activeFile, onFileSelect }: FileExplorerProps) {
  // Build a tree structure from flat file paths
  const buildFileTree = (files: FileContent[]) => {
    const tree: any = {};
    
    files.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            type: index === parts.length - 1 ? 'file' : 'folder',
            path: parts.slice(0, index + 1).join('/'),
            children: {},
            content: index === parts.length - 1 ? file.content : undefined
          };
        }
        current = current[part].children;
      });
    });
    
    return tree;
  };

  const renderTree = (node: any, name: string, depth = 0) => {
    const isActive = activeFile === node.path;
    
    return (
      <div key={node.path || name} className="mb-1">
        <div
          className={cn(
            "flex items-center py-1 px-2 rounded cursor-pointer text-sm",
            isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100",
            `ml-${depth * 4}`
          )}
          onClick={() => node.type === 'file' && onFileSelect(node.path)}
        >
          {node.type === 'folder' ? (
            <Folder className="h-4 w-4 mr-2 text-gray-500" />
          ) : (
            <File className="h-4 w-4 mr-2 text-gray-500" />
          )}
          <span className="truncate">{name}</span>
        </div>
        
        {node.type === 'folder' && Object.keys(node.children).length > 0 && (
          <div>
            {Object.entries(node.children).map(([childName, childNode]: [string, any]) =>
              renderTree(childNode, childName, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const fileTree = buildFileTree(files);

  return (
    <div className="h-full overflow-auto p-2 bg-white border-r border-border">
      <h2 className="font-semibold text-sm mb-2 text-gray-700 px-2">Files ({files.length})</h2>
      <div className="space-y-1">
        {Object.entries(fileTree).map(([name, node]: [string, any]) =>
          renderTree(node, name)
        )}
      </div>
    </div>
  );
}
