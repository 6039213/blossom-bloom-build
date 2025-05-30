
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

interface CodePreviewPanelProps {
  activeTab: 'preview' | 'code';
  projectFiles: Record<string, { code: string }>;
}

export default function CodePreviewPanel({ activeTab, projectFiles }: CodePreviewPanelProps) {
  // Function to generate HTML for preview when not using Sandpack
  const generatePreviewHtml = () => {
    // This is a simplified approach - in a real app, you'd need more sophisticated rendering
    let previewContent = '';
    
    // Try to find a main component to render
    if (!projectFiles || Object.keys(projectFiles).length === 0) {
      // Default preview when no files exist
      return '<div class="p-8"><h1 class="text-4xl font-bold mb-4">Hello from Blossom AI</h1><p class="mb-4">This is where your generated website will appear.</p><p>Enter a prompt to get started!</p></div>';
    }
    
    // Look for App.tsx or index.tsx as main entry point
    const appFile = projectFiles["src/App.tsx"] || projectFiles["src/app.tsx"];
    const indexFile = projectFiles["src/index.tsx"] || projectFiles["src/index.js"];
    
    if (appFile) {
      previewContent = '<div id="app-container">' + parseComponentToHTML(appFile.code) + '</div>';
    } else if (projectFiles["src/components/Hero.tsx"]) {
      // If we have a Hero component, show that
      const heroFile = projectFiles["src/components/Hero.tsx"];
      previewContent = '<div id="hero-container">' + parseComponentToHTML(heroFile.code) + '</div>';
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

  return (
    <Tabs value={activeTab} className="h-full">
      <TabsList className="mb-4">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      
      <div className="h-[calc(100%-40px)]">
        <TabsContent value="preview" className="mt-0 h-full">
          <motion.div 
            className="h-full w-full overflow-hidden bg-gray-100 border-t border-border rounded-lg shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <iframe
              srcDoc={`<!DOCTYPE html><html><head><style>body{font-family:sans-serif;margin:0;} .p-8{padding:2rem;} .mb-4{margin-bottom:1rem;} .text-4xl{font-size:2.25rem;} .font-bold{font-weight:700;}</style><link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></head><body class="bg-gradient-to-br from-blossom-50 to-white">${generatePreviewHtml()}</body></html>`}
              className="w-full h-full border-0 shadow-lg"
              title="Website Preview"
              sandbox="allow-scripts"
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="code" className="mt-0 h-full">
          <motion.div 
            className="h-full w-full overflow-auto bg-gray-900 text-white rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <pre className="p-4 font-mono text-sm">
              {activeTab === 'code' && projectFiles ? 
                JSON.stringify(projectFiles, null, 2) : 
                "No files to display"
              }
            </pre>
          </motion.div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
