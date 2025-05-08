
import React from 'react';

interface WebsitePreviewProps {
  files: Array<{path: string; content: string; type: string}>;
  viewportSize: 'desktop' | 'tablet' | 'mobile';
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ files, viewportSize }) => {
  // Get viewport style based on selected size
  const getViewportStyle = () => {
    switch (viewportSize) {
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto', height: '100%' };
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto', height: '100%' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  // Generate a basic HTML document with the files
  const generatePreviewHtml = () => {
    // Find the main app file if it exists
    const appFile = files.find(file => 
      file.path.includes('App.') || 
      file.path.includes('index.')
    );
    
    // Extract other components that might be referenced
    const componentFiles = files.filter(file => 
      file.path.includes('/components/') || 
      file.path.includes('.jsx') || 
      file.path.includes('.tsx')
    );
    
    // Start with a basic HTML skeleton
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; margin: 0; }
        </style>
      </head>
      <body>
        <div id="root">
    `;
    
    // If we have an app file, try to extract its rendered HTML
    if (appFile) {
      // Basic extraction of JSX content (simplified)
      const jsxMatch = appFile.content.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
      if (jsxMatch && jsxMatch[1]) {
        // Very basic JSX to HTML conversion (not perfect)
        let jsx = jsxMatch[1].trim();
        // Replace React-specific syntax with HTML
        jsx = jsx.replace(/className=/g, 'class=');
        jsx = jsx.replace(/{([^}]+)}/g, ''); // Remove JS expressions
        html += jsx;
      } else {
        // Fallback content
        html += `<div class="p-8">
          <h1 class="text-2xl font-bold mb-4">Generated Website Preview</h1>
          <p>This is a preview of your generated website.</p>
        </div>`;
      }
    } else if (files.length > 0) {
      // If no app file but we have other files, show a message
      html += `<div class="p-8">
        <h1 class="text-2xl font-bold mb-4">Website Components Generated</h1>
        <p>${files.length} component${files.length !== 1 ? 's' : ''} created:</p>
        <ul class="list-disc pl-5 mt-2">
          ${files.map(file => `<li>${file.path}</li>`).join('')}
        </ul>
      </div>`;
    } else {
      // No files at all
      html += `<div class="flex items-center justify-center min-h-screen bg-amber-50 p-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-amber-800 mb-4">No Website Generated Yet</h1>
          <p class="text-amber-700">Enter a prompt and click "Generate" to create your website.</p>
        </div>
      </div>`;
    }
    
    html += `
        </div>
      </body>
      </html>
    `;
    
    return html;
  };

  return (
    <div className="w-full h-full bg-amber-50/30 dark:bg-amber-900/10 rounded-lg overflow-hidden border border-amber-200 dark:border-amber-700" style={getViewportStyle()}>
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-300">Your Website Preview</h3>
          <p className="text-amber-700 dark:text-amber-400 max-w-md mt-2">
            Enter a prompt and click "Generate" to see your AI-generated website.
          </p>
        </div>
      ) : (
        <iframe
          srcDoc={generatePreviewHtml()}
          className="w-full h-full border-0"
          title="Website Preview"
          sandbox="allow-scripts"
        />
      )}
    </div>
  );
};

export default WebsitePreview;
