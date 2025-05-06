
import React from 'react';

interface WebsitePreviewProps {
  files: Array<{
    path: string;
    content: string;
    type: string;
  }>;
  viewportSize: string;
}

export default function WebsitePreview({ files, viewportSize }: WebsitePreviewProps) {
  // Check if we have any files to show
  const hasFiles = files.length > 0;

  // Viewport styling based on selected size
  const getPreviewStyle = () => {
    switch (viewportSize) {
      case 'mobile':
        return { maxWidth: '375px', height: '667px' };
      case 'tablet':
        return { maxWidth: '768px', height: '1024px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  // Generate HTML content from files for preview
  const generatePreviewHTML = () => {
    // Look for index.tsx, App.tsx, or any component file
    const indexFile = files.find(file => 
      file.path.includes('index.tsx') || 
      file.path.includes('App.tsx') || 
      file.path.includes('Index.tsx')
    );

    // Extract CSS files
    const cssFiles = files.filter(file => file.path.endsWith('.css'));
    const cssContent = cssFiles.map(file => file.content).join('\n');

    // Generate HTML with Tailwind included
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { 
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                         'Helvetica Neue', Arial, sans-serif;
            margin: 0; 
          }
          ${cssContent}
        </style>
      </head>
      <body>
        <div id="root" class="min-h-screen bg-gray-50 dark:bg-gray-900">
          ${hasFiles ? 
            `<div class="min-h-screen p-4 flex items-center justify-center">
               <div class="text-center">
                 <h2 class="text-xl font-medium mb-2">Your Blossom AI-generated website</h2>
                 <p class="text-gray-600 dark:text-gray-400">Preview is available in browser</p>
               </div>
             </div>` 
            : ''}
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div 
        className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black rounded-lg border border-border/40 overflow-hidden transition-all duration-300 flex flex-col items-center justify-center"
        style={getPreviewStyle()}
      >
        {hasFiles ? (
          <iframe
            srcDoc={generatePreviewHTML()}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="text-center p-6 max-w-lg">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Website Preview</h3>
            <p className="text-muted-foreground mb-6">
              Enter your website description and click "Generate Website" to create your custom website with Blossom AI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
