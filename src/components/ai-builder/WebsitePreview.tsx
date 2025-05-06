
import React from 'react';

interface WebsitePreviewProps {
  files: Array<{path: string; content: string; type: string}>;
  viewportSize: string;
}

export default function WebsitePreview({ files, viewportSize }: WebsitePreviewProps) {
  if (files.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">✨</span>
        </div>
        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-2">
          No Preview Available
        </h2>
        <p className="text-amber-700 dark:text-amber-400 max-w-md">
          Enter a prompt and click "Generate Website" to create your custom website code.
        </p>
      </div>
    );
  }
  
  // Find HTML or JSX files to render
  const mainFile = files.find(file => file.path.includes('App.tsx') || file.path.includes('index.tsx')) || files[0];
  
  return (
    <div className={`h-full w-full overflow-auto transition-all duration-300 ${
      viewportSize === 'mobile' ? 'max-w-[320px] mx-auto' : 
      viewportSize === 'tablet' ? 'max-w-[768px] mx-auto' : 
      'w-full'
    }`}>
      <iframe 
        className="w-full h-full border-0"
        title="preview"
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 0; }
              </style>
            </head>
            <body>
              <div id="root" class="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-amber-900/20">
                  <h2 class="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-4">Preview</h2>
                  <p class="text-amber-700 dark:text-amber-400">
                    This is a simplified preview. In a production environment, this would render the actual generated React components.
                  </p>
                  <div class="mt-6 p-4 bg-amber-50 dark:bg-gray-900 rounded-lg border border-amber-200 dark:border-amber-900/20">
                    <pre class="whitespace-pre-wrap text-sm font-mono text-amber-800 dark:text-amber-300">${mainFile?.path || 'No file selected'}</pre>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `}
        sandbox="allow-scripts"
      />
    </div>
  );
}
