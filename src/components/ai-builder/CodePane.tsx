
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodePaneProps {
  files: Array<{
    path: string;
    content: string;
    type: string;
  }>;
  activeFile: string | null;
  onContentChange: (path: string, content: string) => void;
}

export default function CodePane({ files, activeFile, onContentChange }: CodePaneProps) {
  const activeFileData = activeFile ? files.find(f => f.path === activeFile) : null;
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeFile) {
      onContentChange(activeFile, e.target.value);
    }
  };

  // Get language for syntax highlighting
  const getLanguageFromType = (type: string) => {
    switch (type) {
      case 'javascript':
      case 'javascriptreact':
        return 'javascript';
      case 'typescript':
      case 'typescriptreact':
        return 'typescript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  if (!activeFile || !activeFileData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-muted-foreground">
            {files.length === 0 
              ? "No files generated yet. Create a website from the chat panel."
              : "Select a file from the file explorer to view and edit code."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border">
        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="readonly">Read Only</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs font-mono border-b border-border">
          {activeFile}
        </div>
        <div className="flex-1 overflow-auto">
          <textarea
            className="w-full h-full font-mono text-sm p-4 focus:outline-none bg-gray-900 text-gray-100"
            value={activeFileData.content}
            onChange={handleCodeChange}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
