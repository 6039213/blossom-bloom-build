
import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from 'lucide-react';

export interface MonacoEditorProps {
  files: { [key: string]: string };
  activeFile: string | null;
  onContentChange: (path: string, content: string) => void;
  openFiles: string[];
  onTabChange: (path: string) => void;
  onTabClose: (path: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ 
  files, 
  activeFile, 
  onContentChange,
  openFiles,
  onTabChange,
  onTabClose
}) => {
  const editorRef = useRef(null);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const getFileType = (filePath: string) => {
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

  return (
    <div className="flex flex-col h-full">
      {openFiles.length > 0 && (
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
        {activeFile && files[activeFile] ? (
          <Editor
            height="100%"
            language={getFileType(activeFile)}
            value={files[activeFile]}
            onChange={(value) => onContentChange(activeFile, value || '')}
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
