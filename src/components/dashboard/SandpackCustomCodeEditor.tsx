
import React, { useEffect, useRef } from 'react';
import { SandpackCodeEditor } from '@codesandbox/sandpack-react';
import { ProjectFiles } from './ai-builder/types';

interface SandpackCustomCodeEditorProps {
  onCodeChange?: (files: ProjectFiles) => void;
}

export default function SandpackCustomCodeEditor({
  onCodeChange,
}: SandpackCustomCodeEditorProps) {
  // Track if this is the first render/update to avoid unnecessary callbacks
  const isFirstRender = useRef(true);

  // Handle file changes when code is edited in the editor
  const handleCodeUpdate = (code: string, path: string) => {
    if (!onCodeChange || isFirstRender.current) return;
    
    // Get the current files from Sandpack
    onCodeChange({
      [path]: { code }
    });
  };

  useEffect(() => {
    // After the first render, allow code changes to be sent back to parent
    isFirstRender.current = false;
  }, []);

  return (
    <SandpackCodeEditor
      showTabs
      showLineNumbers
      showInlineErrors
      wrapContent
      closableTabs
      style={{ height: '100%', flexGrow: 1 }}
      onCodeUpdate={handleCodeUpdate}
    />
  );
}
