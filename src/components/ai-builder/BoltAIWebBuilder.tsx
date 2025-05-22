
// Create this file with minimal code that fixes the TypeScript error
import React from 'react';

// Define the interfaces needed to fix TypeScript errors
export interface WebsiteFile {
  path: string;
  content: string;
  language: string;
}

export interface CodePaneProps {
  files: WebsiteFile[];
  activeFile: string;
  onFileChange?: (filePath: string) => void;
  onChange?: (content: string) => void;
}

export default function BoltAIWebBuilder() {
  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold">Please use UnifiedAIBuilder instead</h2>
      <p>This component is deprecated</p>
    </div>
  );
}
