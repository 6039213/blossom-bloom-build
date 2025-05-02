
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  }, [files, isLoading]);
  
  // Helper function to generate preview HTML
  const generatePreviewHTML = (files: Record<string, { code: string }>) => {
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
          body { font-family: system-ui, sans-serif; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          // Simplified React-like rendering for preview
          const root = document.getElementById('root');
          root.innerHTML = '<div class="p-4"><h1 class="text-xl font-bold">Preview Ready</h1><p>Your application code has been generated. Check the code tab to see the files.</p></div>';
        </script>
      </body>
      </html>
    `;
    
    return htmlContent;
  };
  
  const getViewportClasses = () => {
    switch(viewportSize) {
      case 'mobile':
        return 'w-full max-w-[320px] mx-auto border border-border rounded-lg shadow-lg';
      case 'tablet':
        return 'w-full max-w-[768px] mx-auto border border-border rounded-lg shadow-lg';
      case 'desktop':
      default:
        return 'w-full';
    }
  };
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Alert className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
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
    <div className={`h-full flex-1 overflow-hidden ${getViewportClasses()}`}>
      <iframe 
        ref={iframeRef}
        className="w-full h-full"
        title="preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
