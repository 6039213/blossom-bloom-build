
import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface WebsitePreviewProps {
  files: Array<{ path: string; content: string }>;
  viewportSize: 'mobile' | 'tablet' | 'desktop';
  onViewportChange: (size: 'mobile' | 'tablet' | 'desktop') => void;
}

export default function WebsitePreview({
  files,
  viewportSize,
  onViewportChange
}: WebsitePreviewProps) {
  // Generate HTML with injected files
  const generateHtml = () => {
    // Find index.html, index.tsx, or App.tsx as entry point
    const indexHtml = files.find(file => file.path.endsWith('index.html'));
    
    if (indexHtml) {
      return indexHtml.content;
    }
    
    // If no index.html, create one with React injected
    const cssFiles = files.filter(file => file.path.endsWith('.css'));
    const tsxFiles = files.filter(file => 
      file.path.endsWith('.tsx') || file.path.endsWith('.jsx')
    );
    
    // Generate basic HTML with tailwind and files injected
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: system-ui, sans-serif; margin: 0; }
            ${cssFiles.map(file => file.content).join('\n')}
          </style>
        </head>
        <body>
          <div id="root">
            ${files.length > 0 ? 
              '<div class="min-h-screen flex items-center justify-center p-6"><div class="text-center"><h2 class="text-xl font-medium mb-2">Your AI-generated website</h2><p class="text-gray-600">Preview available in preview mode</p></div></div>' : 
              '<div class="min-h-screen flex items-center justify-center p-6"><div class="text-center"><h2 class="text-xl font-medium mb-2">No content yet</h2><p class="text-gray-600">Generate a website to see the preview</p></div></div>'
            }
          </div>
        </body>
      </html>
    `;
  };
  
  // Get viewport styling based on selected size
  const getViewportStyle = () => {
    switch (viewportSize) {
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto' };
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto' };
      case 'desktop':
      default:
        return { width: '100%' };
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-end gap-2 mb-4">
        <Button
          variant={viewportSize === 'desktop' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewportChange('desktop')}
          className="h-8 w-8"
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant={viewportSize === 'tablet' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewportChange('tablet')}
          className="h-8 w-8"
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button
          variant={viewportSize === 'mobile' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewportChange('mobile')}
          className="h-8 w-8"
        >
          <Smartphone className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 border rounded-lg overflow-hidden" style={getViewportStyle()}>
        <iframe 
          srcDoc={generateHtml()}
          className="w-full h-full border-0"
          title="Website Preview"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
