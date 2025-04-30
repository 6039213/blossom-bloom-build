
import React from 'react';
import { Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileSystemItem {
  path: string;
  type: 'file' | 'folder';
  children?: FileSystemItem[];
  content?: string;
}

interface FileExplorerProps {
  files: FileSystemItem[];
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

export default function FileExplorer({ files, activeFile, onFileSelect }: FileExplorerProps) {
  // Function to build the file tree from flat file paths
  const renderFileTree = (item: FileSystemItem, depth = 0) => {
    const isActive = activeFile === item.path;

    return (
      <div key={item.path} className="mb-1">
        <div
          className={cn(
            "flex items-center py-1 px-2 rounded cursor-pointer text-sm",
            isActive ? "bg-blossom-100 text-blossom-900" : "hover:bg-gray-100",
            `ml-${depth * 4}`
          )}
          onClick={() => item.type === 'file' && onFileSelect(item.path)}
        >
          {item.type === 'folder' ? (
            <Folder className="h-4 w-4 mr-2 text-gray-500" />
          ) : (
            <File className="h-4 w-4 mr-2 text-gray-500" />
          )}
          <span className="truncate">{item.path.split('/').pop()}</span>
        </div>
        {item.children && item.children.map(child => renderFileTree(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto p-2 bg-white border-r border-border">
      <h2 className="font-semibold text-sm mb-2 text-gray-700 px-2">Files</h2>
      <div className="space-y-1">
        {files.map(item => renderFileTree(item))}
      </div>
    </div>
  );
}
