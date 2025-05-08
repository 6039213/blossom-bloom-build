
import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from 'lucide-react';

export interface MonacoEditorProps {
  files?: { [key: string]: string };
  activeFile?: string | null;
  onContentChange?: (path: string, content: string) => void;
  openFiles?: string[];
  onTabChange?: (path: string) => void;
  onTabClose?: (path: string) => void;
  // Add these props to support the BlossomAIWebBuilder use case
  value?: string;
  language?: string;
  onChange?: (content: string) => void;
}

// Export this function so it can be imported by other components
export const getFileLanguage = (filePath: string) => {
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
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return 'plaintext';
  }
};

const MonacoEditor: React.FC<MonacoEditorProps> = ({ 
  files, 
  activeFile, 
  onContentChange,
  openFiles,
  onTabChange,
  onTabClose,
  // Support for simpler usage
  value,
  language,
  onChange
}) => {
  const editorRef = useRef(null);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  // Handle different usage patterns
  const handleEditorChange = (content) => {
    if (onChange) {
      // Simple mode: just use onChange
      onChange(content || '');
    } else if (onContentChange && activeFile) {
      // Complex mode: use path + content
      onContentChange(activeFile, content || '');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {openFiles && openFiles.length > 0 && onTabChange && onTabClose && (
        <div className="bg-white dark:bg-gray-800 border-b">
          <Tabs value={activeFile || ''} onValueChange={onTabChange}>
            <TabsList className="flex overflow-x-auto">
              {openFiles.map(file => (
                <TabsTrigger
                  key={file}
                  value={file}
                  className="flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <span className="truncate max-w-[100px]">
                    {file.split('/').pop()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTabClose(file);
                    }}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="flex-grow">
        {/* Support two different usage patterns */}
        {value !== undefined ? (
          // Simple mode with direct value/language/onChange
          <Editor
            height="100%"
            language={language || 'javascript'}
            value={value}
            onChange={handleEditorChange}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
            onMount={handleEditorMount}
          />
        ) : activeFile && files && files[activeFile] ? (
          // Complex mode with files/activeFile
          <Editor
            height="100%"
            language={getFileLanguage(activeFile)}
            value={files[activeFile]}
            onChange={handleEditorChange}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
            onMount={handleEditorMount}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No file selected or file not found
          </div>
        )}
      </div>
    </div>
  );
};

export default MonacoEditor;
