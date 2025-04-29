
import React, { useState, useEffect, useRef } from 'react';
import { useProjectStore } from '@/stores/project';
import { Loader2, Code, Eye, Files, Copy, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// File structure interfaces
interface CodeFile {
  name: string;
  content: string;
  displayedContent: string;
  language: 'tsx' | 'css' | 'html' | 'js';
  path: string;
}

interface FileFolder {
  name: string;
  files: CodeFile[];
  path: string;
}

export function BoltBuilder() {
  // State management
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<CodeFile[]>([]);
  const [folders, setFolders] = useState<FileFolder[]>([]);
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null);
  const [activeTab, setActiveTab] = useState('code');
  const [typingSpeed, setTypingSpeed] = useState(15); // ms per character
  const { setPreviewHtml } = useProjectStore();
  
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear typewriter effect on component unmount
  useEffect(() => {
    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
    };
  }, []);
  
  // Handle prompt submission
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    
    setIsGenerating(true);
    setActiveTab('code');
    
    try {
      // This would be an actual API call to generate code
      // For now, we'll simulate the response with mock data
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Extract component name from prompt
      const componentName = extractComponentName(prompt);
      
      // Create simulated files
      const simulatedFiles = generateSimulatedFiles(componentName, prompt);
      
      // Organize files into folders
      const organizedFolders = organizeIntoFolders(simulatedFiles);
      
      setFolders(organizedFolders);
      setGeneratedFiles(simulatedFiles);
      
      if (simulatedFiles.length > 0) {
        // Set the first file as active
        setActiveFile(simulatedFiles[0]);
        
        // Start typing animation for the first file
        startTypingAnimation(simulatedFiles[0], simulatedFiles);
        
        // Generate preview HTML
        generatePreview(simulatedFiles);
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate code. Please try again.");
    }
  };
  
  // Extract component name from prompt
  const extractComponentName = (prompt: string): string => {
    // Look for patterns like "create a card component" or similar
    const patterns = [
      /create\s+(?:a|an)?\s+([a-zA-Z0-9]+)\s+(?:component|page|section)/i,
      /build\s+(?:a|an)?\s+([a-zA-Z0-9]+)/i,
      /design\s+(?:a|an)?\s+([a-zA-Z0-9]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        const name = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        return name;
      }
    }
    
    // Default if no match found
    return "Component";
  };
  
  // Generate simulated files based on the prompt
  const generateSimulatedFiles = (componentName: string, prompt: string): CodeFile[] => {
    const files: CodeFile[] = [
      {
        name: `${componentName}.tsx`,
        path: `/src/components/${componentName}.tsx`,
        language: 'tsx',
        content: generateTsxContent(componentName, prompt),
        displayedContent: ''
      },
      {
        name: `${componentName}.css`,
        path: `/src/styles/${componentName}.css`,
        language: 'css',
        content: generateCssContent(componentName, prompt),
        displayedContent: ''
      }
    ];
    
    // Add index file if it seems like a page component
    if (prompt.includes('page') || prompt.includes('landing') || prompt.includes('website')) {
      files.push({
        name: 'index.tsx',
        path: `/src/pages/${componentName.toLowerCase()}/index.tsx`,
        language: 'tsx',
        content: generateIndexContent(componentName),
        displayedContent: ''
      });
    }
    
    return files;
  };
  
  // Organize files into folders
  const organizeIntoFolders = (files: CodeFile[]): FileFolder[] => {
    const folderMap: Record<string, FileFolder> = {};
    
    files.forEach(file => {
      const pathParts = file.path.split('/');
      const folderPath = pathParts.slice(0, pathParts.length - 1).join('/');
      const folderName = pathParts[pathParts.length - 2];
      
      if (!folderMap[folderPath]) {
        folderMap[folderPath] = {
          name: folderName,
          path: folderPath,
          files: []
        };
      }
      
      folderMap[folderPath].files.push(file);
    });
    
    return Object.values(folderMap);
  };
  
  // Generate content for TSX file
  const generateTsxContent = (componentName: string, prompt: string): string => {
    let content = `import React from 'react';\nimport './${componentName}.css';\n\n`;
    
    if (prompt.includes('responsive')) {
      content += `export const ${componentName} = () => {\n  return (\n    <div className="${componentName.toLowerCase()}-container">\n      <h2 className="${componentName.toLowerCase()}-title">Responsive ${componentName}</h2>\n      <div className="${componentName.toLowerCase()}-content">\n        <img src="/placeholder.jpg" alt="${componentName}" className="${componentName.toLowerCase()}-image" />\n        <p className="${componentName.toLowerCase()}-text">This is a responsive ${componentName.toLowerCase()} component</p>\n        <button className="${componentName.toLowerCase()}-button">Click me</button>\n      </div>\n    </div>\n  );\n};\n\nexport default ${componentName};`;
    } else if (prompt.includes('card')) {
      content += `export const ${componentName} = () => {\n  return (\n    <div className="${componentName.toLowerCase()}-card">\n      <img src="/placeholder.jpg" alt="${componentName}" className="${componentName.toLowerCase()}-image" />\n      <h3 className="${componentName.toLowerCase()}-title">${componentName} Title</h3>\n      <p className="${componentName.toLowerCase()}-description">This is a ${componentName.toLowerCase()} description.</p>\n      <button className="${componentName.toLowerCase()}-button">Learn More</button>\n    </div>\n  );\n};\n\nexport default ${componentName};`;
    } else {
      content += `export const ${componentName} = () => {\n  return (\n    <div className="${componentName.toLowerCase()}-container">\n      <h2>${componentName}</h2>\n      <p>This is a ${componentName.toLowerCase()} component</p>\n      <button className="${componentName.toLowerCase()}-button">Click me</button>\n    </div>\n  );\n};\n\nexport default ${componentName};`;
    }
    
    return content;
  };
  
  // Generate content for CSS file
  const generateCssContent = (componentName: string, prompt: string): string => {
    const lowerName = componentName.toLowerCase();
    
    if (prompt.includes('responsive')) {
      return `.${lowerName}-container {\n  display: flex;\n  flex-direction: column;\n  max-width: 100%;\n  margin: 0 auto;\n  padding: 1rem;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border-radius: 8px;\n}\n\n.${lowerName}-title {\n  font-size: 1.5rem;\n  margin-bottom: 1rem;\n  text-align: center;\n}\n\n.${lowerName}-content {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.${lowerName}-image {\n  max-width: 100%;\n  height: auto;\n  border-radius: 4px;\n}\n\n.${lowerName}-text {\n  line-height: 1.5;\n}\n\n.${lowerName}-button {\n  padding: 0.5rem 1rem;\n  background-color: #4f46e5;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: background-color 0.3s ease;\n}\n\n.${lowerName}-button:hover {\n  background-color: #4338ca;\n}\n\n@media (min-width: 640px) {\n  .${lowerName}-container {\n    max-width: 640px;\n  }\n}\n\n@media (min-width: 768px) {\n  .${lowerName}-container {\n    max-width: 768px;\n  }\n  \n  .${lowerName}-content {\n    flex-direction: row;\n    align-items: center;\n  }\n  \n  .${lowerName}-image {\n    max-width: 50%;\n  }\n}`;
    } else if (prompt.includes('card')) {
      return `.${lowerName}-card {\n  display: flex;\n  flex-direction: column;\n  width: 300px;\n  border-radius: 8px;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.${lowerName}-card:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);\n}\n\n.${lowerName}-image {\n  width: 100%;\n  height: 180px;\n  object-fit: cover;\n}\n\n.${lowerName}-title {\n  font-size: 1.25rem;\n  font-weight: bold;\n  margin: 1rem 1rem 0.5rem;\n}\n\n.${lowerName}-description {\n  margin: 0 1rem 1rem;\n  color: #666;\n  font-size: 0.9rem;\n  line-height: 1.5;\n}\n\n.${lowerName}-button {\n  margin: 0 1rem 1rem;\n  padding: 0.5rem 1rem;\n  background-color: #4f46e5;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: background-color 0.3s ease;\n}\n\n.${lowerName}-button:hover {\n  background-color: #4338ca;\n}`;
    } else {
      return `.${lowerName}-container {\n  display: flex;\n  flex-direction: column;\n  padding: 1rem;\n  border-radius: 0.5rem;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n\n.${lowerName}-button {\n  margin-top: 1rem;\n  padding: 0.5rem 1rem;\n  background-color: #4f46e5;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: background-color 0.3s ease;\n}\n\n.${lowerName}-button:hover {\n  background-color: #4338ca;\n}`;
    }
  };
  
  // Generate content for index file
  const generateIndexContent = (componentName: string): string => {
    return `import React from 'react';\nimport { ${componentName} } from '../../components/${componentName}';\n\nexport default function ${componentName}Page() {\n  return (\n    <div className="container mx-auto py-8">\n      <h1 className="text-2xl font-bold mb-6">${componentName} Page</h1>\n      <${componentName} />\n    </div>\n  );\n}\n`;
  };
  
  // Start typewriter animation for a file
  const startTypingAnimation = (file: CodeFile, allFiles: CodeFile[]) => {
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
    }
    
    let index = 0;
    const content = file.content;
    
    const typeNextChar = () => {
      if (index < content.length) {
        const updatedFiles = [...allFiles];
        const fileIndex = updatedFiles.findIndex(f => f.path === file.path);
        
        if (fileIndex !== -1) {
          updatedFiles[fileIndex] = {
            ...updatedFiles[fileIndex],
            displayedContent: content.substring(0, index + 1)
          };
          
          setGeneratedFiles(updatedFiles);
          
          if (file.path === activeFile?.path) {
            setActiveFile(updatedFiles[fileIndex]);
          }
          
          index++;
          typewriterRef.current = setTimeout(typeNextChar, typingSpeed);
        }
      } else {
        // When done typing, update the preview
        generatePreview(allFiles);
      }
    };
    
    typeNextChar();
  };
  
  // Generate preview HTML
  const generatePreview = (files: CodeFile[]) => {
    const tsxFile = files.find(file => file.name.endsWith('.tsx'));
    const cssFile = files.find(file => file.name.endsWith('.css'));
    
    if (tsxFile && cssFile) {
      const previewHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>${cssFile.content}</style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            // Simple representation of the React component
            const componentName = "${tsxFile.name.replace('.tsx', '')}";
            document.getElementById('root').innerHTML = \`
              <div class="${tsxFile.name.replace('.tsx', '').toLowerCase()}-container">
                <h2>${tsxFile.name.replace('.tsx', '')}</h2>
                <p>This is a preview of your ${tsxFile.name.replace('.tsx', '').toLowerCase()} component</p>
                <button class="${tsxFile.name.replace('.tsx', '').toLowerCase()}-button">Click me</button>
              </div>
            \`;
          </script>
        </body>
        </html>
      `;
      
      setPreviewHtml(previewHtml);
      
      // Switch to preview after animation completes
      setTimeout(() => {
        setActiveTab('preview');
      }, 500);
    }
  };
  
  // Handle file selection
  const handleFileSelect = (file: CodeFile) => {
    setActiveFile(file);
    setActiveTab('code');
    
    // Start typing animation for the selected file
    startTypingAnimation(file, generatedFiles);
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      toast.success(`Copied ${activeFile.name} to clipboard`);
    }
  };
  
  // Download current file
  const handleDownloadFile = () => {
    if (activeFile) {
      const blob = new Blob([activeFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${activeFile.name}`);
    }
  };
  
  // Get language-specific syntax highlighting class
  const getLanguageClass = (language: string) => {
    switch (language) {
      case 'tsx':
        return 'language-typescript';
      case 'css':
        return 'language-css';
      case 'html':
        return 'language-html';
      default:
        return 'language-typescript';
    }
  };
  
  // Render file icon based on file type
  const renderFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
      return <Code className="h-4 w-4 mr-2 text-blue-500" />;
    } else if (fileName.endsWith('.css')) {
      return <Code className="h-4 w-4 mr-2 text-pink-500" />;
    } else if (fileName.endsWith('.html')) {
      return <Code className="h-4 w-4 mr-2 text-orange-500" />;
    } else {
      return <Files className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-4">AI Website Builder</h2>
        <div className="flex flex-col space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the component you want to build (e.g., 'Create a responsive card component with image, title and button')"
            className="min-h-[100px] p-3 border border-blossom-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blossom-500 resize-none"
            disabled={isGenerating}
          />
          <button
            onClick={handleSubmit}
            disabled={isGenerating || !prompt.trim()}
            className="self-end px-4 py-2 bg-blossom-500 text-white rounded-md hover:bg-blossom-600 focus:outline-none focus:ring-2 focus:ring-blossom-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Code className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
      
      {generatedFiles.length > 0 && (
        <div className="flex-1 grid grid-cols-4 gap-0 overflow-hidden">
          {/* File Explorer */}
          <div className="col-span-1 border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium mb-3">Files</h3>
            <div className="space-y-2">
              {folders.map((folder) => (
                <div key={folder.path} className="space-y-1">
                  <div className="flex items-center">
                    <Files className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">{folder.name}</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {folder.files.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => handleFileSelect(file)}
                        className={`flex items-center text-sm w-full text-left px-2 py-1 rounded ${activeFile?.path === file.path ? 'bg-blossom-100 text-blossom-800' : 'hover:bg-gray-100'}`}
                      >
                        {renderFileIcon(file.name)}
                        <span className="truncate">{file.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Editor and Preview */}
          <div className="col-span-3 flex flex-col h-full overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="code" className="flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center space-x-2">
                    {activeFile && (
                      <>
                        <button 
                          onClick={handleCopyCode}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                          title="Copy code"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={handleDownloadFile}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <TabsContent value="code" className="mt-0 h-full">
                  {activeFile ? (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center px-3 py-1.5 bg-gray-100 border-b border-gray-200">
                        <span className="text-sm font-medium">{activeFile.path}</span>
                      </div>
                      <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-white">
                        <pre>
                          <code className={getLanguageClass(activeFile.language)}>
                            {activeFile.displayedContent || ''}
                          </code>
                        </pre>
                        {activeFile.displayedContent !== activeFile.content && (
                          <span className="inline-block w-1 h-4 bg-blossom-500 animate-pulse ml-1"></span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      Select a file to view code
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0 h-full border-t border-gray-200">
                  <div className="h-full w-full">
                    <div className="w-full h-full">
                      <div className="p-4 h-full">
                        <div className="w-full h-full">
                          <div className="h-full w-full border border-gray-200 rounded-md overflow-hidden">
                            <iframe 
                              srcDoc={isGenerating ? '' : undefined}
                              className="w-full h-full"
                              title="Preview"
                              sandbox="allow-scripts"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
