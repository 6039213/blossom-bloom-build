
import React, { useState, useEffect } from 'react';
import { Check, FileCode, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { FileContent } from '@/types/project';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FileTreeItem {
  name: string;
  path: string;
  isFolder: boolean;
  children: FileTreeItem[];
}

interface CodeEditorProps {
  files: FileContent[];
  onFileChange: (path: string, content: string) => void;
}

export default function CodeEditor({ files, onFileChange }: CodeEditorProps) {
  const [activeFile, setActiveFile] = useState<string | null>(
    files.length > 0 ? files[0].path : null
  );
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingContent, setEditingContent] = useState<string>('');
  
  // Build file tree when files change
  useEffect(() => {
    const tree: FileTreeItem[] = [];
    
    // Sort files to process directories first
    const sortedPaths = [...files].sort((a, b) => a.path.localeCompare(b.path));
    
    sortedPaths.forEach(file => {
      const pathParts = file.path.split('/');
      let currentLevel = tree;
      
      // Process each path segment
      pathParts.forEach((part, index) => {
        // Check if we're at the file name (last part)
        const isFileName = index === pathParts.length - 1;
        
        // Find existing folder/file at current level
        const existingItem = currentLevel.find(item => item.name === part);
        
        if (existingItem) {
          // If item exists and we're not at the file name, go deeper
          if (!isFileName) {
            currentLevel = existingItem.children;
          }
        } else {
          // Create new folder or file
          const newItem: FileTreeItem = {
            name: part,
            path: pathParts.slice(0, index + 1).join('/'),
            isFolder: !isFileName,
            children: []
          };
          
          currentLevel.push(newItem);
          
          // If it's a folder, update currentLevel to go deeper
          if (!isFileName) {
            currentLevel = newItem.children;
          }
        }
      });
    });
    
    setFileTree(tree);
    
    // Set active file to the first file if not already set
    if ((!activeFile || !files.find(f => f.path === activeFile)) && files.length > 0) {
      setActiveFile(files[0].path);
      setEditingContent(files[0].content);
    }
  }, [files]);
  
  // Update editing content when active file changes
  useEffect(() => {
    if (activeFile) {
      const file = files.find(f => f.path === activeFile);
      if (file) {
        setEditingContent(file.content);
      }
    } else {
      setEditingContent('');
    }
  }, [activeFile, files]);
  
  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const updated = new Set(prev);
      if (updated.has(path)) {
        updated.delete(path);
      } else {
        updated.add(path);
      }
      return updated;
    });
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingContent(e.target.value);
  };
  
  const handleSaveChanges = () => {
    if (activeFile) {
      onFileChange(activeFile, editingContent);
    }
  };
  
  // Render file tree items recursively
  const renderFileTree = (items: FileTreeItem[], level = 0) => {
    return items.map(item => (
      <div key={item.path} style={{ paddingLeft: `${level * 16}px` }}>
        {item.isFolder ? (
          <div>
            <button
              onClick={() => toggleFolder(item.path)}
              className="flex items-center gap-1 p-1 hover:bg-muted rounded-sm w-full text-left"
            >
              {expandedFolders.has(item.path) ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              {expandedFolders.has(item.path) ? (
                <FolderOpen className="h-4 w-4 text-yellow-500" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-500" />
              )}
              <span className="text-sm">{item.name}</span>
            </button>
            {expandedFolders.has(item.path) && renderFileTree(item.children, level + 1)}
          </div>
        ) : (
          <button
            onClick={() => setActiveFile(item.path)}
            className={`flex items-center gap-1 p-1 hover:bg-muted rounded-sm w-full text-left pl-${level * 4 + 6} ${
              activeFile === item.path ? 'bg-muted font-medium' : ''
            }`}
          >
            <FileCode className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{item.name}</span>
          </button>
        )}
      </div>
    ));
  };
  
  return (
    <div className="flex h-full border rounded-lg overflow-hidden">
      {/* File Explorer */}
      <div className="w-64 border-r overflow-y-auto">
        <div className="p-2 border-b">
          <h3 className="font-medium text-sm">Project Files</h3>
        </div>
        <div className="p-1">{renderFileTree(fileTree)}</div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <Tabs defaultValue="edit" className="flex-1 flex flex-col">
          <div className="flex items-center justify-between border-b p-2">
            <div className="flex-1 truncate">
              {activeFile ? (
                <span className="text-sm font-mono">{activeFile}</span>
              ) : (
                <span className="text-sm text-muted-foreground">No file selected</span>
              )}
            </div>
            <TabsList className="ml-auto">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="edit" className="flex-1 flex flex-col p-0 m-0">
            <div className="flex-1 relative">
              <textarea
                value={editingContent}
                onChange={handleContentChange}
                disabled={!activeFile}
                className="absolute inset-0 p-4 font-mono text-sm resize-none focus:outline-none"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  tabSize: 2
                }}
              />
            </div>
            <div className="border-t p-2 flex justify-end">
              <Button onClick={handleSaveChanges} disabled={!activeFile}>
                <Check className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 p-0 m-0 overflow-auto">
            {activeFile && (
              <div className="p-4">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {editingContent}
                </pre>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
