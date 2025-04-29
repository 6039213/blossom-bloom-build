
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
  const [serverUrl, setServerUrl] = useState('');
  
  useEffect(() => {
    // This simulates connecting to the WebContainer server URL
    // In a real implementation, this would come from the WebContainer instance
    const timer = setTimeout(() => {
      setIsLoading(false);
      setServerUrl('about:blank'); // This would be a real URL in production
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
    // Find the main HTML file or create a basic one
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Web Preview</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
          .container { max-width: 1200px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Preview</h1>
          <p>Website preview is ready. In a real implementation, this would be rendered by the WebContainer.</p>
        </div>
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
