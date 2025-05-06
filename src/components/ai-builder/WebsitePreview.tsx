
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
  // Generate HTML content from files
  const generateHtmlContent = () => {
    // Get any CSS files
    const cssFiles = files.filter(file => file.path.endsWith('.css'));
    const cssContent = cssFiles.map(file => file.content).join('\n');
    
    // Find potential entry point files
    const entryFiles = files.filter(file => 
      file.path.includes('App.') || 
      file.path.includes('app.') || 
      file.path.includes('index.') || 
      file.path.includes('main.')
    );
    
    // Find any HTML files
    const htmlFiles = files.filter(file => file.path.endsWith('.html'));
    
    // Create HTML document
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: system-ui, sans-serif; margin: 0; }
            ${cssContent}
          </style>
        </head>
        <body>
          <div id="root">
            ${htmlFiles.length > 0 ? htmlFiles[0].content : ''}
            ${files.length > 0 && htmlFiles.length === 0 ? 
              '<div class="flex min-h-screen items-center justify-center p-4 bg-gray-50">' +
              '<div class="text-center max-w-md">' +
              '<h2 class="text-2xl font-bold mb-4">Generated Website</h2>' +
              '<p class="text-gray-600 mb-4">Your code has been generated successfully. This is a static preview.</p>' +
              '<p class="text-sm text-blue-500">For a fully interactive preview, the code needs to be exported and run in a development environment.</p>' +
              '</div></div>' : ''}
          </div>
        </body>
      </html>
    `;
  };
  
  // Get viewport style based on selected size
  const getViewportStyle = () => {
    switch (viewportSize) {
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto', height: '667px' };
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto', height: '1024px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };
  
  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-2xl font-bold mb-4">Website Preview</h3>
          <p className="text-muted-foreground mb-6">
            Generate a website from the chat panel to see a preview here. Enter a description and click "Generate Website".
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-4">
        <div 
          className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden h-full transition-all duration-300"
          style={getViewportStyle()}
        >
          <iframe
            srcDoc={generateHtmlContent()}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>
      <div className="p-2 border-t border-border bg-white dark:bg-gray-900 text-xs text-muted-foreground">
        <p>Preview is limited to static content. Some dynamic features may not work in this environment.</p>
      </div>
    </div>
  );
}
