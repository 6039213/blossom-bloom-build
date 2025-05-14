
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';
import { FileContent } from '@/lib/services/claudeService';

interface LivePreviewProps {
  files: Array<FileContent>;
  viewportSize: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (size: 'desktop' | 'tablet' | 'mobile') => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({ 
  files, 
  viewportSize, 
  onViewportChange 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper to get viewport style based on size
  const viewportStyle = useMemo(() => {
    switch (viewportSize) {
      case 'mobile':
        return { maxWidth: '375px', height: '100%' };
      case 'tablet': 
        return { maxWidth: '768px', height: '100%' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  }, [viewportSize]);

  // Generate HTML for preview with all files embedded
  const generatePreviewHTML = () => {
    if (files.length === 0) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>AI Preview</title>
          </head>
          <body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div class="flex flex-col items-center justify-center h-screen p-4">
              <div class="text-center">
                <h2 class="text-2xl font-bold mb-4">No content generated yet</h2>
                <p>Enter a prompt to generate your website</p>
              </div>
            </div>
          </body>
        </html>
      `;
    }
    
    // Find index.html file if it exists
    const indexHtml = files.find(file => file.path === 'index.html');
    
    // Find CSS files
    const cssFiles = files.filter(file => file.path.endsWith('.css'));
    const cssContent = cssFiles.map(file => file.content).join('\n');
    
    // Find JS/JSX files
    const jsFiles = files.filter(file => 
      file.path.endsWith('.js') || 
      file.path.endsWith('.jsx') || 
      file.path.endsWith('.ts') || 
      file.path.endsWith('.tsx')
    );

    // Use index.html as template if it exists, otherwise create a basic HTML structure
    const html = indexHtml ? indexHtml.content : `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <title>AI Preview</title>
          <style id="embedded-css"></style>
        </head>
        <body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <div id="root"></div>
        </body>
      </html>
    `;

    // Create a DOM parser to modify the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Embed CSS
    const styleElement = doc.getElementById('embedded-css') || doc.createElement('style');
    styleElement.id = 'embedded-css';
    styleElement.textContent = cssContent;
    if (!doc.getElementById('embedded-css')) {
      doc.head.appendChild(styleElement);
    }
    
    // Add React and ReactDOM
    const reactScript = doc.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.development.js';
    doc.head.appendChild(reactScript);
    
    const reactDomScript = doc.createElement('script');
    reactDomScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';
    doc.head.appendChild(reactDomScript);
    
    // Create script to initialize react component
    const appInitScript = doc.createElement('script');
    appInitScript.type = 'text/babel';
    
    // Extract component content from JSX files
    const mainComponent = jsFiles.find(file => 
      file.path === 'App.jsx' || 
      file.path === 'App.tsx' || 
      file.path === 'index.jsx' || 
      file.path === 'index.tsx'
    );
    
    // If we found a main component, render it directly
    if (mainComponent) {
      const rootElement = doc.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = `
          <div class="p-8">
            <h1 class="text-3xl font-bold mb-4">Preview</h1>
            <p class="mb-4">Here's a preview of your generated site.</p>
            <div class="p-4 border rounded-lg bg-white dark:bg-gray-800">
              <!-- Component content would render here in a real app -->
              <code class="text-sm">Components generated: ${jsFiles.length}</code>
            </div>
          </div>
        `;
      }
    }
    
    // Add Babel for JSX support
    const babelScript = doc.createElement('script');
    babelScript.src = 'https://unpkg.com/babel-standalone@6/babel.min.js';
    doc.head.appendChild(babelScript);
    
    // Return the modified HTML
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  };

  // Refresh the preview
  const refreshPreview = () => {
    try {
      setIsRefreshing(true);
      
      // Generate preview HTML
      const previewHTML = generatePreviewHTML();
      
      // Revoke old URL to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create a blob with the HTML content
      const blob = new Blob([previewHTML], { type: 'text/html' });
      
      // Create an object URL from the blob
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error refreshing preview:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update preview when files change
  useEffect(() => {
    refreshPreview();
    
    // Cleanup function to revoke object URL
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [files]);

  return (
    <div className="flex flex-col h-full">
      {/* Viewport controls */}
      <div className="border-b p-2 flex items-center justify-between">
        <div className="space-x-1 flex">
          <Button
            variant={viewportSize === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewportChange('desktop')}
            className="h-8"
          >
            <Monitor className="h-4 w-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant={viewportSize === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewportChange('tablet')}
            className="h-8"
          >
            <Tablet className="h-4 w-4 mr-2" />
            Tablet
          </Button>
          <Button
            variant={viewportSize === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewportChange('mobile')}
            className="h-8"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshPreview}
          disabled={isRefreshing}
          className="h-8"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Preview
        </Button>
      </div>
      
      {/* Preview iframe container */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-center overflow-auto">
        <div 
          className="bg-white rounded-md shadow-lg transition-all duration-300 h-full overflow-hidden"
          style={{
            ...viewportStyle,
            position: 'relative',
            maxHeight: '90%',
            margin: 'auto'
          }}
        >
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4 text-center">
              <div>
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
                <p>Preparing preview...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
