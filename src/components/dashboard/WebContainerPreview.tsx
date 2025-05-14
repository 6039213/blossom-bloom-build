
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface WebContainerPreviewProps {
  files: Record<string, { code: string }>;
  dependencies: Record<string, string>;
  viewportSize: string;
}

export default function WebContainerPreview({ 
  files, 
  dependencies,
  viewportSize
}: WebContainerPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // This simulates connecting to the WebContainer server URL
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Effect to update the iframe content when files change
  useEffect(() => {
    if (iframeRef.current && !isLoading && Object.keys(files).length > 0) {
      try {
        // Create a simple HTML preview using the files
        const mainHtml = generatePreviewHTML(files);
        
        // Set the content of the iframe
        const iframeDoc = iframeRef.current.contentDocument;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(mainHtml);
          iframeDoc.close();
        }
      } catch (err) {
        console.error("Error updating preview:", err);
        setError("Failed to generate preview");
      }
    }
  }, [files, isLoading, viewportSize]);
  
  // Helper function to generate preview HTML with responsive design
  const generatePreviewHTML = (files: Record<string, { code: string }>) => {
    // Find index.html, App or index component
    let appContent = '';
    let cssContent = '';
    
    // Extract CSS content
    Object.entries(files).forEach(([path, { code }]) => {
      if (path.endsWith('.css')) {
        cssContent += code + '\n';
      }
    });
    
    // Find main component to render
    if (files['src/App.tsx'] || files['src/App.jsx']) {
      const appFile = files['src/App.tsx'] || files['src/App.jsx'];
      appContent = extractJSXContentFromComponent(appFile.code);
    } else if (files['src/pages/index.tsx'] || files['src/pages/Index.tsx']) {
      const indexFile = files['src/pages/index.tsx'] || files['src/pages/Index.tsx'];
      appContent = extractJSXContentFromComponent(indexFile.code);
    } else if (files['src/components/Layout.tsx']) {
      const layoutFile = files['src/components/Layout.tsx'];
      appContent = extractJSXContentFromComponent(layoutFile.code);
    } else {
      // Default content
      appContent = `
        <div class="p-8">
          <h1 class="text-3xl font-bold mb-4">Preview Ready</h1>
          <p>Your application has been generated. Check the code tab to see the files.</p>
        </div>
      `;
    }
    
    // Start with base HTML
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            margin: 0; 
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          }
          ${cssContent}
        </style>
      </head>
      <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <div id="root" class="min-h-screen">${appContent}</div>
      </body>
      </html>
    `;
    
    return htmlContent;
  };
  
  // Extract JSX content from React component code
  const extractJSXContentFromComponent = (code: string): string => {
    try {
      // Extract JSX from return statement
      const returnMatch = code.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
      if (returnMatch && returnMatch[1]) {
        let jsx = returnMatch[1].trim();
        // Basic conversion of React to HTML
        jsx = jsx.replace(/className=/g, 'class=');
        jsx = jsx.replace(/{`([^`]*)`}/g, '$1');
        jsx = jsx.replace(/{(['"])([^'"]*)\1}/g, '$2');
        jsx = jsx.replace(/{\/\*[\s\S]*?\*\/}/g, '');
        jsx = jsx.replace(/{\s*\/\/.+}/g, '');
        jsx = jsx.replace(/{.+?}/g, '');
        return jsx;
      }
      return '<div class="p-4">Preview not available</div>';
    } catch (error) {
      console.error('Error extracting JSX content:', error);
      return '<div class="p-4 text-red-500">Error rendering preview</div>';
    }
  };
  
  // Get viewport classes based on size
  const getViewportClasses = () => {
    switch(viewportSize) {
      case 'mobile':
        return 'w-[320px] h-[540px] mx-auto border border-border rounded-lg shadow-lg';
      case 'tablet':
        return 'w-[768px] h-[600px] mx-auto border border-border rounded-lg shadow-lg';
      case 'desktop':
      default:
        return 'w-full max-w-[1024px] h-[600px] mx-auto border border-border rounded-lg shadow-lg';
    }
  };
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Alert className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Skeleton className="h-[200px] w-full max-w-2xl mb-4 rounded-lg" />
        <Skeleton className="h-[20px] w-[180px] rounded" />
      </div>
    );
  }
  
  return (
    <div className="h-full flex-1 overflow-hidden flex items-center justify-center p-4">
      <div className={getViewportClasses()}>
        <iframe 
          ref={iframeRef}
          className="w-full h-full rounded-lg border"
          title="preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
