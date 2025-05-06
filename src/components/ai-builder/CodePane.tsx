
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from "@/lib/utils";

interface WebsiteFile {
  path: string;
  content: string;
  type: string;
}

interface CodePaneProps {
  files: WebsiteFile[];
  activeFile: string | null;
  onContentChange: (filePath: string, content: string) => void;
}

export default function CodePane({ files, activeFile, onContentChange }: CodePaneProps) {
  // Get active file content
  const activeFileContent = activeFile 
    ? files.find(file => file.path === activeFile)?.content || ''
    : '';
  
  // Get language for syntax highlighting
  const getLanguage = (filePath: string): string => {
    if (!filePath) return 'javascript';
    
    const extension = filePath.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'ts': return 'typescript';
      case 'tsx': return 'tsx';
      case 'js': return 'javascript';
      case 'jsx': return 'jsx';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'md': return 'markdown';
      default: return 'javascript';
    }
  };
  
  // Handle content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeFile) {
      onContentChange(activeFile, e.target.value);
    }
  };
  
  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h3 className="text-xl font-bold mb-2">No Code Generated Yet</h3>
          <p className="text-muted-foreground">
            Generate a website first to see and edit the code here.
          </p>
        </div>
      </div>
    );
  }
  
  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h3 className="text-xl font-bold mb-2">Select a File</h3>
          <p className="text-muted-foreground">
            Select a file from the file explorer to view and edit its code.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-4 py-2 bg-gray-800 text-gray-200">
        <span className="font-mono text-sm">{activeFile}</span>
      </div>
      
      <div className="flex-1 overflow-auto relative">
        <SyntaxHighlighter
          language={getLanguage(activeFile)}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            height: '100%',
            fontSize: '0.875rem',
            overflow: 'auto',
          }}
        >
          {activeFileContent}
        </SyntaxHighlighter>
        
        <textarea
          value={activeFileContent}
          onChange={handleChange}
          className={cn(
            "absolute top-0 left-0 w-full h-full p-4 text-sm font-mono",
            "bg-transparent text-transparent caret-white resize-none",
            "focus:outline-none"
          )}
          spellCheck="false"
        />
      </div>
    </div>
  );
}
