
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodeEditorProps {
  files: Array<{ path: string; content: string }>;
  activeFile: string | null;
  onFileSelect: (filePath: string) => void;
  onFileChange: (filePath: string, content: string) => void;
}

export default function CodeEditor({
  files,
  activeFile,
  onFileSelect,
  onFileChange
}: CodeEditorProps) {
  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No Files Yet</h3>
          <p className="text-muted-foreground">
            Generate a website to see and edit code files.
          </p>
        </div>
      </div>
    );
  }
  
  // Get file extension
  const getFileType = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      default:
        return 'text';
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="border-b p-2 whitespace-nowrap">
        <Tabs defaultValue={activeFile || files[0].path}>
          <TabsList>
            {files.map((file) => (
              <TabsTrigger
                key={file.path}
                value={file.path}
                onClick={() => onFileSelect(file.path)}
              >
                {file.path.split('/').pop()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </ScrollArea>
      
      <div className="flex-1 overflow-auto p-4 bg-gray-950 text-gray-200">
        {activeFile && files.find(f => f.path === activeFile) && (
          <pre className="font-mono text-sm whitespace-pre-wrap">
            {files.find(f => f.path === activeFile)?.content}
          </pre>
        )}
      </div>
    </div>
  );
}
