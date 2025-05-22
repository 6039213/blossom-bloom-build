
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodePaneProps {
  files: Array<{path: string; content: string; type?: string}>;
  activeFile: string | null;
}

export default function CodePane({ files, activeFile }: CodePaneProps) {
  // Find the active file or default to the first file
  const currentFile = activeFile 
    ? files.find(file => file.path === activeFile) 
    : files[0];
    
  // Function to highlight code syntax (basic implementation)
  const highlightCode = (code: string, fileType?: string): string => {
    // This is a very basic implementation
    // In a real app, you would use a proper syntax highlighter
    return code;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b bg-muted/30">
        <div className="font-mono text-xs truncate">
          {currentFile ? currentFile.path : 'No file selected'}
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {currentFile ? (
          <pre className="p-4 text-sm font-mono">
            <code>
              {highlightCode(currentFile.content, currentFile.type)}
            </code>
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full p-8 text-center">
            <div>
              <p className="text-muted-foreground mb-2">No file selected or no files available.</p>
              {files.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Select a file from the Files tab to view its contents.
                </p>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
