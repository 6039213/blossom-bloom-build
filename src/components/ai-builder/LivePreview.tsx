import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileContent } from '@/lib/services/claudeService';

interface LivePreviewProps {
  files: FileContent[];
  viewportSize: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (size: 'desktop' | 'tablet' | 'mobile') => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({ 
  files, 
  viewportSize, 
  onViewportChange 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Create a bundle of files that we can use in the iframe
  const generatePreview = () => {
    if (files.length === 0) return;
    
    try {
      setIsRefreshing(true);
      
      // Find necessary files
      const htmlFile = files.find(f => f.path === 'index.html') || { 
        path: 'index.html',
        content: createHtmlTemplate()
      };
      
      const cssFiles = files.filter(f => f.path.endsWith('.css'));
      const jsxFiles = files.filter(f => f.path.endsWith('.jsx') || f.path.endsWith('.js'));
      
      // Create a blob URL for the HTML content
      const htmlWithInlinedContent = injectContentIntoHtml(
        htmlFile.content, 
        cssFiles, 
        jsxFiles
      );
      
      const htmlBlob = new Blob([htmlWithInlinedContent], { type: 'text/html' });
      const url = URL.createObjectURL(htmlBlob);
      
      // If we had a previous URL, revoke it to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setPreviewUrl(url);
    } catch (error) {
      console.error('Preview generation error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Create a basic HTML template if none exists
  const createHtmlTemplate = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  };

  // Inject CSS and JSX into the HTML template
  const injectContentIntoHtml = (
    htmlContent: string, 
    cssFiles: FileContent[], 
    jsxFiles: FileContent[]
  ) => {
    let result = htmlContent;

    // Inject CSS files
    const styleTag = cssFiles.map(file => `<style>${file.content}</style>`).join('\n');
    result = result.replace('</head>', `${styleTag}\n</head>`);

    // Ensure Tailwind is included
    if (!result.includes('tailwindcss')) {
      result = result.replace('</head>', '<script src="https://cdn.tailwindcss.com"></script>\n</head>');
    }

    // Ensure React and Babel are included
    if (!result.includes('react@')) {
      const reactScripts = `
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>`;
      result = result.replace('</head>', `${reactScripts}\n</head>`);
    }

    // Inject JSX/JS files with proper ordering
    // First, find App.jsx or similar entry point
    const appFile = jsxFiles.find(file => file.path === 'App.jsx' || file.path === 'src/App.jsx');
    const indexFile = jsxFiles.find(file => file.path === 'index.js' || file.path === 'src/index.js');
    
    // Other components should come before the main app
    const componentFiles = jsxFiles.filter(file => 
      file.path !== (appFile?.path || '') && 
      file.path !== (indexFile?.path || '') &&
      file.path.includes('component')
    );
    
    // Utilities should come before components
    const utilFiles = jsxFiles.filter(file => 
      !componentFiles.includes(file) && 
      file.path !== (appFile?.path || '') && 
      file.path !== (indexFile?.path || '')
    );
    
    // Create script tags in order: utils, components, app, index
    const orderedFiles = [...utilFiles, ...componentFiles];
    if (appFile) orderedFiles.push(appFile);
    if (indexFile) orderedFiles.push(indexFile);
    
    const scriptTags = orderedFiles.map(file => {
      const fileName = file.path.split('/').pop() || file.path;
      return `<script type="text/babel" data-filename="${fileName}">\n${file.content}\n</script>`;
    }).join('\n');
    
    // Add default mount script if needed
    let mountScript = '';
    if (!indexFile && appFile) {
      mountScript = `
<script type="text/babel">
  // Mount the App component to the root element
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
</script>`;
    }
    
    result = result.replace('</body>', `${scriptTags}\n${mountScript}\n</body>`);
    return result;
  };

  // Generate preview when files change
  useEffect(() => {
    generatePreview();
    
    // Clean up function to revoke object URL
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [files]);

  // Handle refresh button click
  const handleRefresh = () => {
    generatePreview();
  };

  // Get viewport style based on selected size
  const viewportStyle = useMemo(() => {
    switch (viewportSize) {
      case 'mobile':
        return { width: '375px', height: '100%', margin: '0 auto' };
      case 'tablet':
        return { width: '768px', height: '100%', margin: '0 auto' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  }, [viewportSize]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-2 bg-gray-800">
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant={viewportSize === 'desktop' ? 'default' : 'outline'}
            onClick={() => onViewportChange('desktop')}
            className="h-8 w-8 p-0"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewportSize === 'tablet' ? 'default' : 'outline'}
            onClick={() => onViewportChange('tablet')}
            className="h-8 w-8 p-0"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewportSize === 'mobile' ? 'default' : 'outline'}
            onClick={() => onViewportChange('mobile')}
            className="h-8 w-8 p-0"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`h-8 ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="flex-1 bg-white dark:bg-gray-900 overflow-auto p-2">
        <div style={viewportStyle} className="bg-white rounded shadow h-full overflow-hidden">
          {previewUrl ? (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <p className="text-gray-500">No preview available. Generate code first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
