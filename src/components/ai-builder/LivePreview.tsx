
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';

interface LivePreviewProps {
  files: Array<{ path: string; content: string }>;
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
    // Find index.html file if it exists
    const indexHtml = files.find(file => file.path === 'index.html');
    
    // Find CSS files
    const cssFiles = files.filter(file => file.path.endsWith('.css'));
    const cssContent = cssFiles.map(file => file.content).join('\n');
    
    // Find JS/JSX files - we'll extract JS code for embedding
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
          <title>Blossom AI Preview</title>
          <style id="embedded-css"></style>
        </head>
        <body>
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
    
    // Add tailwind if not already included
    if (!html.includes('tailwindcss')) {
      const tailwindScript = doc.createElement('script');
      tailwindScript.src = 'https://cdn.tailwindcss.com';
      doc.head.appendChild(tailwindScript);
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
    
    // Convert JSX to JS (simplified, not a full conversion)
    let initCode = '';
    
    // First add all component definitions
    jsFiles.forEach(file => {
      initCode += `\n// File: ${file.path}\n${file.content}\n`;
    });
    
    // Then add code to render App component if it exists
    initCode += `
      // Initialize React app
      try {
        const rootElement = document.getElementById('root');
        if (typeof App !== 'undefined' && rootElement) {
          ReactDOM.render(React.createElement(App), rootElement);
        }
      } catch (error) {
        console.error("Error rendering React app:", error);
        document.getElementById('root').innerHTML = '<div style="color:red;padding:20px;"><h2>Error rendering React app</h2><pre>' + error.message + '</pre></div>';
      }
    `;
    
    appInitScript.textContent = initCode;
    doc.body.appendChild(appInitScript);
    
    // Add Babel for JSX support
    const babelScript = doc.createElement('script');
    babelScript.src = 'https://unpkg.com/babel-standalone@6/babel.min.js';
    doc.head.appendChild(babelScript);
    
    // Return the modified HTML
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  };

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
      <div className="border-b border-gray-800 p-2 flex items-center justify-between">
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
          style={viewportStyle}
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
