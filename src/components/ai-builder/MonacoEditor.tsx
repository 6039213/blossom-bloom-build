
import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// Set up workers using URL.createObjectURL
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  }
};

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  height?: string;
  width?: string;
  readOnly?: boolean;
  className?: string;
}

export const getFileLanguage = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  switch (extension) {
    case 'js':
      return 'javascript';
    case 'jsx':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'typescript';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return 'plaintext';
  }
};

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language,
  onChange,
  height = '100%',
  width = '100%',
  readOnly = false,
  className = '',
}) => {
  const divEl = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!divEl.current) return;

    const model = monaco.editor.createModel(
      value,
      language,
      monaco.Uri.parse(`file:///workspace/${Math.random().toString(36).substring(2)}.${language}`)
    );

    // Define editor options
    const options: monaco.editor.IStandaloneEditorConstructionOptions = {
      model,
      theme: 'vs-dark',
      fontSize: 14,
      wordWrap: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      readOnly,
      scrollbar: {
        useShadows: false,
        vertical: 'visible',
        horizontal: 'visible',
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    };

    try {
      // Create editor instance
      editor.current = monaco.editor.create(divEl.current, options);

      // Set up change event handler
      if (!readOnly) {
        editor.current.onDidChangeModelContent(() => {
          onChange(editor.current?.getValue() || '');
        });
      }

      // Update loaded state
      setIsLoaded(true);
    } catch (error) {
      console.error("Error initializing Monaco editor:", error);
    }

    return () => {
      model.dispose();
      editor.current?.dispose();
    };
  }, [language, readOnly]);

  // Update editor value when props change
  useEffect(() => {
    if (editor.current && value !== editor.current.getValue()) {
      editor.current.setValue(value);
    }
  }, [value]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      <div ref={divEl} style={{ width, height }} className="monaco-editor-container" />
    </div>
  );
};

export default MonacoEditor;
