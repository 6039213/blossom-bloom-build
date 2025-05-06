
import React from 'react';
import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';

interface WebsiteFile {
  path: string;
  content: string;
  type: string;
}

interface WebsitePreviewProps {
  files: WebsiteFile[];
  viewportSize: string;
}

export default function WebsitePreview({ files, viewportSize }: WebsitePreviewProps) {
  const formatFilesForSandpack = () => {
    const sandpackFiles: Record<string, { code: string }> = {};
    
    // Process files for Sandpack
    files.forEach(file => {
      // Check if path is valid and not empty
      if (!file.path) return;
      
      // Add leading slash for Sandpack paths
      const sandpackPath = file.path.startsWith('/') ? file.path : `/${file.path}`;
      sandpackFiles[sandpackPath] = { code: file.content };
    });
    
    // Create index.html if it doesn't exist
    if (!sandpackFiles['/index.html']) {
      sandpackFiles['/index.html'] = {
        code: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Generated Website</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
        `.trim()
      };
    }
    
    // Create index.js if it doesn't exist
    if (!sandpackFiles['/src/index.tsx'] && !sandpackFiles['/src/index.js']) {
      // Check if App.tsx or App.jsx exists
      const hasAppTsx = Object.keys(sandpackFiles).some(path => path.includes('App.tsx'));
      const hasAppJsx = Object.keys(sandpackFiles).some(path => path.includes('App.jsx'));
      
      if (hasAppTsx || hasAppJsx) {
        const appPath = hasAppTsx ? './App.tsx' : './App.jsx';
        
        sandpackFiles['/src/index.tsx'] = {
          code: `
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "${appPath}";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
          `.trim()
        };
      }
    }
    
    return sandpackFiles;
  };
  
  const getViewportStyle = () => {
    switch (viewportSize) {
      case 'mobile':
        return { width: '375px', height: '100%' };
      case 'tablet':
        return { width: '768px', height: '100%' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };
  
  // Only render if we have files
  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-2xl">🏗️</span>
          </div>
          <h3 className="text-2xl font-bold mb-4">No Website Yet</h3>
          <p className="text-muted-foreground mb-6">
            Enter a prompt in the chat to generate a website, and a preview will appear here.
          </p>
        </div>
      </div>
    );
  }
  
  // Format files for Sandpack
  const sandpackFiles = formatFilesForSandpack();
  
  return (
    <div className="h-full flex items-center justify-center p-4">
      <div 
        style={getViewportStyle()} 
        className="mx-auto shadow-lg border border-border h-full rounded-lg overflow-hidden transition-all duration-300"
      >
        <SandpackProvider
          template="react-ts"
          files={sandpackFiles}
          options={{
            classes: {
              'sp-wrapper': 'h-full',
              'sp-layout': 'h-full',
              'sp-preview-container': 'h-full',
            },
          }}
          customSetup={{
            dependencies: {
              react: "^18.0.0",
              "react-dom": "^18.0.0",
              "@types/react": "^18.0.0", 
              "@types/react-dom": "^18.0.0",
            },
            entry: "/src/index.tsx",
          }}
        >
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showRefreshButton={true}
            className="h-full"
            style={{ height: '100%' }}
          />
        </SandpackProvider>
      </div>
    </div>
  );
}
