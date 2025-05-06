
import React, { useState, useMemo } from 'react';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface WebsiteFile {
  path: string;
  content: string;
  type: string;
}

interface FileTreeItem {
  name: string;
  path: string;
  isFolder: boolean;
  children: FileTreeItem[];
}

interface FileExplorerProps {
  files: WebsiteFile[];
  activeFile: string | null;
  onFileSelect: (filePath: string) => void;
}

export default function FileExplorer({ files, activeFile, onFileSelect }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/src']));
  
  // Build file tree from flat list of files
  const fileTree = useMemo(() => {
    // Function to build a tree structure
    const buildFileTree = (paths: string[]): FileTreeItem[] => {
      const root: FileTreeItem[] = [];
      const folderPaths = new Set<string>();
      
      // First, collect all folder paths
      paths.forEach(path => {
        const parts = path.split('/').filter(Boolean);
        let currentPath = '';
        
        parts.slice(0, -1).forEach(part => {
          currentPath += '/' + part;
          folderPaths.add(currentPath);
        });
      });
      
      // Then build the tree structure
      paths.forEach(path => {
        const parts = path.split('/').filter(Boolean);
        let current = root;
        let currentPath = '';
        
        parts.forEach((part, i) => {
          currentPath += '/' + part;
          const isLast = i === parts.length - 1;
          const isFolder = !isLast || folderPaths.has(currentPath);
          
          // Find existing item
          let item = current.find(item => item.name === part);
          
          if (!item) {
            // Create new item
            item = {
              name: part,
              path: currentPath,
              isFolder: isFolder,
              children: []
            };
            current.push(item);
          }
          
          if (isFolder) {
            current = item.children;
          }
        });
      });
      
      // Sort folders first, then files
      const sortItems = (items: FileTreeItem[]): FileTreeItem[] => {
        return items.sort((a, b) => {
          if (a.isFolder && !b.isFolder) return -1;
          if (!a.isFolder && b.isFolder) return 1;
          return a.name.localeCompare(b.name);
        }).map(item => {
          if (item.isFolder) {
            return { ...item, children: sortItems(item.children) };
          }
          return item;
        });
      };
      
      return sortItems(root);
    };
    
    // Extract paths from files
    const paths = files.map(file => file.path);
    
    // Build tree
    return buildFileTree(paths);
  }, [files]);
  
  // Toggle folder expanded/collapsed
  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };
  
  // Render tree items recursively
  const renderTreeItems = (items: FileTreeItem[], depth = 0) => {
    return items.map(item => (
      <div key={item.path} style={{ paddingLeft: `${depth * 12}px` }}>
        {item.isFolder ? (
          <div className="py-1">
            <button
              onClick={() => toggleFolder(item.path)}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm"
            >
              <span className="text-gray-500">
                {expandedFolders.has(item.path) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
              {expandedFolders.has(item.path) ? (
                <FolderOpen className="h-4 w-4 text-yellow-500" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-500" />
              )}
              <span className="truncate">{item.name}</span>
            </button>
            
            {expandedFolders.has(item.path) && (
              <div className="mt-1">
                {renderTreeItems(item.children, depth + 1)}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onFileSelect(item.path)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm",
              activeFile === item.path && "bg-blue-100 dark:bg-blue-900"
            )}
          >
            <FileText className="h-4 w-4 text-blue-500" />
            <span className="truncate">{item.name}</span>
          </button>
        )}
      </div>
    ));
  };
  
  if (files.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No files generated yet.</p>
        <p className="text-sm mt-2">Generate a website first to see files here.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-auto">
      {renderTreeItems(fileTree)}
    </div>
  );
}
