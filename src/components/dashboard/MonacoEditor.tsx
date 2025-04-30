
import React from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from 'lucide-react';

interface MonacoEditorProps {
  files: Record<string, string>;
  activeFile: string | null;
  onContentChange: (path: string, content: string) => void;
  openFiles: string[];
  onTabChange: (filePath: string) => void;
  onTabClose?: (filePath: string) => void;
}

export default function MonacoEditor({ 
  files, 
  activeFile, 
  onContentChange, 
  openFiles,
  onTabChange,
  onTabClose
}: MonacoEditorProps) {
  // Determine the language based on file extension
  const getLanguage = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  const handleCloseTab = (e: React.MouseEvent, filePath: string) => {
    e.stopPropagation(); // Prevent tab activation when clicking the close button
    if (onTabClose) {
      onTabClose(filePath);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeFile || ''} onValueChange={onTabChange} className="w-full">
        <TabsList className="flex overflow-x-auto">
          {openFiles.map((filePath) => (
            <TabsTrigger 
              key={filePath} 
              value={filePath}
              className="flex items-center gap-1 text-xs"
            >
              <span className="truncate max-w-[120px]">{filePath.split('/').pop()}</span>
              {onTabClose && (
                <X 
                  className="w-3 h-3 ml-1 opacity-60 hover:opacity-100" 
                  onClick={(e) => handleCloseTab(e, filePath)}
                />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="flex-1">
        {activeFile ? (
          <Editor
            height="100%"
            language={getLanguage(activeFile)}
            value={files[activeFile] || ''}
            onChange={(value) => onContentChange(activeFile, value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
            No file selected
          </div>
        )}
      </div>
    </div>
  );
}
