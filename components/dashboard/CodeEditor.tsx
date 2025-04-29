
import React from 'react';

interface CodeEditorProps {
  fileName: string;
  code: string;
  isTyping: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ fileName, code, isTyping }) => {
  // Simple syntax highlighting for demonstration
  const highlightSyntax = (code: string) => {
    // Very basic syntax highlighting - in a real app, you'd use a library like Prism or highlight.js
    return code
      .replace(/(import|export|from|const|let|var|function|return|if|else|switch|case|break|default|for|while|do|class|extends|new|this|super)/g, '<span class="text-purple-600">$1</span>')
      .replace(/('.*?'|".*?")/g, '<span class="text-green-600">$1</span>')
      .replace(/({|}|\(|\)|\[|\]|=>|=|;|,|\.)/g, '<span class="text-gray-500">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="text-gray-400">$1</span>');
  };
  
  const getLanguageFromFileName = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) return 'react';
    if (fileName.endsWith('.ts') || fileName.endsWith('.js')) return 'typescript';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.scss')) return 'scss';
    if (fileName.endsWith('.html')) return 'html';
    return 'text';
  };

  const language = getLanguageFromFileName(fileName);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-gray-100 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{fileName}</span>
          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{language}</span>
        </div>
        {isTyping && <span className="text-xs text-blossom-500">Generating...</span>}
      </div>
      
      <div className="flex-1 overflow-auto bg-white p-4 font-mono text-sm">
        {code ? (
          <pre
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }}
          />
        ) : (
          <div className="text-gray-400 italic">No code to display</div>
        )}
        {isTyping && (
          <span className="inline-block w-2 h-4 bg-blossom-500 animate-pulse ml-1"></span>
        )}
      </div>
    </div>
  );
};
