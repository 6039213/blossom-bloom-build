
import React from 'react';
import { X } from 'lucide-react';

interface CodePaneProps {
  files: Array<{path: string; content: string; type: string}>;
  activeFile: string | null;
  onContentChange?: (filePath: string, content: string) => void;
}

const CodePane: React.FC<CodePaneProps> = ({ files, activeFile, onContentChange }) => {
  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 text-gray-400 p-4">
        <div className="text-center">
          <X className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>No file selected</p>
          <p className="text-sm opacity-60 mt-1">Select a file from the sidebar to view its content</p>
        </div>
      </div>
    );
  }

  // Find the selected file
  const file = files.find(f => f.path === activeFile);
  
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 text-gray-400 p-4">
        <div className="text-center">
          <X className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>File not found</p>
          <p className="text-sm opacity-60 mt-1">The selected file could not be found</p>
        </div>
      </div>
    );
  }

  const isEditable = !!onContentChange;

  // Simple syntax highlighting based on file extension
  const getLanguageClass = (filePath: string) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) return 'language-javascript';
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) return 'language-typescript';
    if (filePath.endsWith('.css')) return 'language-css';
    if (filePath.endsWith('.html')) return 'language-html';
    return 'language-plaintext';
  };

  return (
    <div className="h-full bg-gray-950 text-white overflow-hidden flex flex-col">
      <div className="px-4 py-2 border-b border-gray-800 text-sm text-gray-300">
        {activeFile}
      </div>
      <div className="flex-1 overflow-auto p-4">
        {isEditable ? (
          <textarea
            className="w-full h-full bg-transparent font-mono text-sm outline-none resize-none"
            value={file.content}
            onChange={(e) => onContentChange(activeFile, e.target.value)}
            spellCheck={false}
          />
        ) : (
          <pre className={`${getLanguageClass(file.path)} font-mono text-sm whitespace-pre-wrap`}>
            {file.content}
          </pre>
        )}
      </div>
    </div>
  );
};

export default CodePane;
