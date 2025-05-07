
import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Spinner } from '@/components/ui/spinner';

// Ensure editor types are available
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: any, label: string) {
    if (label === 'json') {
      return '/monaco-editor/json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return '/monaco-editor/css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return '/monaco-editor/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/monaco-editor/ts.worker.js';
    }
    return '/monaco-editor/editor.worker.js';
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

const getLanguageFromPath = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase() || '';
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

export const getFileLanguage = (filePath: string): string => {
  return getLanguageFromPath(filePath);
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
          <Spinner className="h-8 w-8" />
        </div>
      )}
      <div ref={divEl} style={{ width, height }} className="monaco-editor-container" />
    </div>
  );
};

export default MonacoEditor;
