
import React, { useState, useEffect } from 'react';
import { FileContent } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface SandpackOptions {
  template?: 'react' | 'react-ts' | 'vanilla' | 'vanilla-ts';
  files: Record<string, { code: string }>;
  dependencies?: Record<string, string>;
}

interface CodePreviewProps {
  files: FileContent[];
}

export default function CodePreview({ files }: CodePreviewProps) {
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [sandpackOptions, setSandpackOptions] = useState<SandpackOptions | null>(null);
  const [iframeKey, setIframeKey] = useState(0); // Used to force iframe refresh
  const [error, setError] = useState<string | null>(null);
  
  // Process files for sandpack preview
  useEffect(() => {
    try {
      const sandpackFiles: Record<string, { code: string }> = {};
      const dependencies: Record<string, string> = {
        "react": "latest",
        "react-dom": "latest",
        "@types/react": "latest",
        "@types/react-dom": "latest"
      };
      
      // Detect if using Tailwind
      const hasTailwind = files.some(file => 
        file.content.includes('tailwind') || file.path.includes('tailwind')
      );
      
      if (hasTailwind) {
        dependencies["tailwindcss"] = "latest";
        dependencies["postcss"] = "latest";
        dependencies["autoprefixer"] = "latest";
      }
      
      // Process files and extract package dependencies
      files.forEach(file => {
        sandpackFiles[file.path] = { code: file.content };
        
        // Look for import statements to extract dependencies
        if (file.path.endsWith('.js') || file.path.endsWith('.jsx') || 
            file.path.endsWith('.ts') || file.path.endsWith('.tsx')) {
          const importRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([@\w\/-]+)['"]/g;
          let match;
          while ((match = importRegex.exec(file.content)) !== null) {
            const packageName = match[1];
            // Only add external packages, not local imports
            if (packageName && !packageName.startsWith('.') && !packageName.startsWith('/')) {
              // Extract the root package name (before any path or version)
              const mainPackage = packageName.split('/')[0];
              if (!dependencies[mainPackage] && !mainPackage.startsWith('@types')) {
                dependencies[mainPackage] = "latest";
              }
            }
          }
        }
      });
      
      // Ensure we have index.html and entry files
      if (!sandpackFiles['/index.html']) {
        sandpackFiles['/index.html'] = { 
          code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blossom AI Preview</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>` 
        };
      }
      
      // Use src/index or src/main as entry if available, otherwise create one
      const entryFiles = files.filter(file => 
        file.path.includes('/index.') || file.path.includes('/main.')
      );
      
      if (entryFiles.length === 0) {
        // Create default entry file
        sandpackFiles['/src/index.tsx'] = {
          code: `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`
        };
        
        // If there's no App.tsx/jsx, create one
        if (!files.some(file => file.path.endsWith('/App.tsx') || file.path.endsWith('/App.jsx'))) {
          sandpackFiles['/src/App.tsx'] = {
            code: `import React from 'react';

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Blossom AI Preview</h1>
      <p>Your application preview will appear here.</p>
    </div>
  );
}`
          };
        }
      }
      
      setSandpackOptions({
        template: 'react-ts',
        files: sandpackFiles,
        dependencies
      });
      
      setError(null);
    } catch (err) {
      console.error('Error setting up preview:', err);
      setError('Failed to set up preview environment');
    }
  }, [files]);
  
  // Refresh preview
  const handleRefreshPreview = () => {
    setIframeKey(prev => prev + 1);
  };
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
      <div className="border-b p-2 flex items-center justify-between">
        <h3 className="font-medium text-sm">Live Preview</h3>
        
        <div className="flex items-center gap-1">
          <Button
            variant={viewportSize === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewportSize('desktop')}
          >
            <Monitor className="h-4 w-4" />
            <span className="sr-only">Desktop</span>
          </Button>
          <Button
            variant={viewportSize === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewportSize('tablet')}
          >
            <Tablet className="h-4 w-4" />
            <span className="sr-only">Tablet</span>
          </Button>
          <Button
            variant={viewportSize === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewportSize('mobile')}
          >
            <Smartphone className="h-4 w-4" />
            <span className="sr-only">Mobile</span>
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleRefreshPreview}>
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        {error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            <p className="font-bold">Preview Error</p>
            <p>{error}</p>
          </div>
        ) : sandpackOptions ? (
          <div 
            className={`bg-white dark:bg-gray-900 border rounded shadow-lg h-full overflow-hidden transition-all
              ${viewportSize === 'mobile' ? 'max-w-[375px]' : 
                viewportSize === 'tablet' ? 'max-w-[768px]' : 'w-full'}`}
          >
            <div className="bg-gray-100 dark:bg-gray-800 p-1 text-xs text-center border-b">
              {viewportSize === 'mobile' ? 'Mobile Preview (375px)' : 
               viewportSize === 'tablet' ? 'Tablet Preview (768px)' : 'Desktop Preview'}
            </div>
            <div className="h-[calc(100%-24px)] overflow-hidden">
              {/* In a real app, we'd use Sandpack directly, but here we'll just show a message */}
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-sm text-gray-500">Preview would be rendered here using Sandpack</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
