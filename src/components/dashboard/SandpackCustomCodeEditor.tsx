
import React, { useEffect, useRef } from 'react';
import { SandpackCodeEditor, useActiveCode, useSandpack } from '@codesandbox/sandpack-react';
import { ProjectFiles } from './ai-builder/types';

interface SandpackCustomCodeEditorProps {
  onCodeChange?: (files: ProjectFiles) => void;
}

export default function SandpackCustomCodeEditor({
  onCodeChange,
}: SandpackCustomCodeEditorProps) {
  // Track if this is the first render/update to avoid unnecessary callbacks
  const isFirstRender = useRef(true);
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;

  // Handle code changes via the sandpack context
  useEffect(() => {
    if (!onCodeChange || isFirstRender.current) return;
    
    // Get the current files from Sandpack
    onCodeChange({
      [activeFile]: { code }
    });
  }, [code, activeFile, onCodeChange]);

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
    />
  );
}
