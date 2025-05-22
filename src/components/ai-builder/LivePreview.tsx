
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface LivePreviewProps {
  files: Array<{path: string; content: string; type?: string}>;
  viewportSize: 'desktop' | 'tablet' | 'mobile';
  onViewportChange?: (size: 'desktop' | 'tablet' | 'mobile') => void;
}

export default function LivePreview({ files, viewportSize, onViewportChange }: LivePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  
  useEffect(() => {
    const generatePreview = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Add a small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate preview HTML from files
        const html = generatePreviewHtml(files);
        setPreviewHtml(html);
      } catch (err) {
        console.error('Error generating preview:', err);
        setError('Failed to generate preview. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    generatePreview();
  }, [files]);
  
  // Function to generate preview HTML with Tailwind CSS
  const generatePreviewHtml = (files: Array<{path: string; content: string; type?: string}>): string => {
    // Extract CSS content
    let cssContent = '';
    files.forEach(file => {
      if (file.path.endsWith('.css')) {
        cssContent += file.content + '\n';
      }
    });
    
    // Find App component or main component to render
    let mainContent = '';
    const appFile = files.find(file => 
      file.path.includes('App.tsx') || 
      file.path.includes('App.jsx')
    );
    
    if (appFile) {
      mainContent = extractJsxContent(appFile.content);
    } else {
      // If no App component, try to find index or main component
      const indexFile = files.find(file => 
        file.path.includes('index.tsx') || 
        file.path.includes('index.jsx') ||
        file.path.includes('Main.tsx') ||
        file.path.includes('Main.jsx')
      );
      
      if (indexFile) {
        mainContent = extractJsxContent(indexFile.content);
      } else {
        // If no main component, show a default message with file list
        mainContent = `
          <div class="p-8">
            <h1 class="text-3xl font-bold mb-4">Generated Files</h1>
            <p class="mb-4">Found ${files.length} files in the project:</p>
            <ul class="list-disc pl-5 space-y-1">
              ${files.map(file => `<li>${file.path}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }
    
    // Generate full HTML document with Tailwind CSS
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            margin: 0;
            padding: 0;
          }
          ${cssContent}
        </style>
      </head>
      <body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div id="root" class="min-h-screen">
          ${mainContent}
        </div>
      </body>
      </html>
    `;
  };
  
  // Helper function to extract JSX content from components
  const extractJsxContent = (code: string): string => {
    try {
      // Extract return statement with JSX
      const returnMatch = code.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
      
      if (returnMatch && returnMatch[1]) {
        let jsx = returnMatch[1].trim();
        
        // Convert JSX to HTML (basic conversion)
        jsx = jsx
          .replace(/className=/g, 'class=')
          .replace(/{`([^`]*)`}/g, '$1')
          .replace(/{\s*['"]([^'"]*)['"]\s*}/g, '$1')
          .replace(/{\/\*[\s\S]*?\*\/}/g, '')
          .replace(/{\s*\/\/.+?(\n|$)}/g, '')
          .replace(/{([^}]*)}/g, ''); // Remove remaining JS expressions
          
        return jsx;
      }
      
      return '<div class="p-6 text-red-500">Could not extract JSX content</div>';
    } catch (error) {
      console.error('Error extracting JSX:', error);
      return '<div class="p-6 text-red-500">Error parsing component</div>';
    }
  };
  
  // Get viewport classes based on size
  const getViewportClasses = () => {
    switch(viewportSize) {
      case 'mobile':
        return 'max-w-[375px] h-[667px] mx-auto border border-border rounded-lg shadow-lg';
      case 'tablet':
        return 'max-w-[768px] h-[1024px] mx-auto border border-border rounded-lg shadow-lg';
      case 'desktop':
      default:
        return 'w-full h-full border border-border rounded-lg';
    }
  };
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="w-full max-w-3xl space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="font-medium">Building preview...</p>
          </div>
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex items-center justify-center p-4 overflow-auto">
      <div className={getViewportClasses()}>
        <iframe
          srcDoc={previewHtml}
          title="Live Preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
