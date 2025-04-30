
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface CodePreviewPanelProps {
  activeTab: 'preview' | 'code';
  projectFiles: Record<string, { code: string }>;
}

export default function CodePreviewPanel({ activeTab, projectFiles }: CodePreviewPanelProps) {
  // Function to generate HTML for preview
  const generatePreviewHtml = () => {
    // This is a simplified approach - in a real app, you'd need more sophisticated rendering
    let previewContent = '';
    
    // Try to find a main component to render
    if (!projectFiles || Object.keys(projectFiles).length === 0) {
      // Default preview when no files exist
      return '<div class="p-8"><h1 class="text-4xl font-bold mb-4">Hello from Blossom AI</h1><p class="mb-4">This is where your generated website will appear.</p><p>Enter a prompt to get started!</p></div>';
    }
    
    // Look for specific component files to preview
    const heroFile = Object.keys(projectFiles).find(file => file.includes('Hero.tsx'));
    if (heroFile) {
      previewContent = '<div id="hero-container">' + parseComponentToHTML(projectFiles[heroFile].code) + '</div>';
    } else {
      // Otherwise just show all components
      const reactComponents = Object.entries(projectFiles)
        .filter(([file]) => file.endsWith('.tsx') || file.endsWith('.jsx'))
        .map(([file, { code }]) => {
          const componentName = file.split('/').pop()?.split('.')[0] || '';
          return `
            <div class="mb-8">
              <h2 class="text-lg font-semibold mb-2 border-b pb-2">Component: ${componentName}</h2>
              <div id="${componentName.toLowerCase()}-container">
                ${parseComponentToHTML(code)}
              </div>
            </div>
          `;
        })
        .join('');
      
      previewContent = reactComponents || '<div class="p-8"><p>No preview available for these files.</p></div>';
    }
    
    return previewContent;
  };
  
  // Very basic parser to convert TSX to HTML (this is simplified)
  const parseComponentToHTML = (code: string) => {
    try {
      // This is an extremely simplified version - in a real app, you'd use a proper parser
      // Extract the JSX part from the return statement
      const returnMatch = code.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
      
      if (returnMatch && returnMatch[1]) {
        let jsx = returnMatch[1];
        
        // Very basic conversion of React/JSX to HTML
        jsx = jsx.replace(/className=/g, 'class=');
        jsx = jsx.replace(/{`([^`]*)`}/g, '$1');
        jsx = jsx.replace(/{['"]([^'"]*)['"]\}/g, '$1');
        jsx = jsx.replace(/{([^}]*)}/g, ''); // Remove other JS expressions
        
        return jsx;
      }
      
      return '<div class="p-4 bg-yellow-100 text-yellow-800 rounded">Could not parse component preview.</div>';
    } catch (error) {
      console.error('Error parsing component to HTML:', error);
      return '<div class="p-4 bg-red-100 text-red-800 rounded">Error generating preview.</div>';
    }
  };

  const getGeneratedCode = () => {
    if (!projectFiles || Object.keys(projectFiles).length === 0) {
      return 'No files generated yet. Enter a prompt to get started!';
    }
    
    // Get the first file to display
    const firstFile = Object.entries(projectFiles)[0];
    return `// ${firstFile[0]}\n${firstFile[1].code}`;
  };

  return (
    <Tabs value={activeTab} className="h-full">
      <TabsContent value="preview" className="mt-0 h-full">
        <div className="h-full w-full overflow-hidden bg-gray-100 border-t border-border">
          <iframe
            srcDoc={`<!DOCTYPE html><html><head><style>body{font-family:sans-serif;margin:0;} .p-8{padding:2rem;} .mb-4{margin-bottom:1rem;} .text-4xl{font-size:2.25rem;} .font-bold{font-weight:700;}</style><link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></head><body>${generatePreviewHtml()}</body></html>`}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="code" className="mt-0 h-full">
        <div className="h-full overflow-auto flex flex-col">
          {projectFiles && Object.keys(projectFiles).length > 0 ? (
            <div className="flex-1 p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(projectFiles).map(file => (
                  <div 
                    key={file}
                    className="px-2 py-1 text-xs bg-background border border-border rounded-md cursor-pointer hover:bg-blossom-100 hover:border-blossom-200 transition-colors"
                  >
                    {file.split('/').pop()}
                  </div>
                ))}
              </div>
              <pre className="text-sm font-mono bg-white dark:bg-gray-800 p-4 rounded-md shadow overflow-x-auto border border-border">
                <code>{getGeneratedCode()}</code>
              </pre>
            </div>
          ) : (
            <div className="flex-1 p-8 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No code generated yet</p>
                <p className="text-sm">Enter a prompt to generate code</p>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
