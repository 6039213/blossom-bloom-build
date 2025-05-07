import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, Download, Code, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Import our custom components
import FileTree from './FileTree';
import EditorTabs from './EditorTabs';
import LivePreview from './LivePreview';
import MonacoEditor, { getFileLanguage } from './MonacoEditor';

// Import services
import { generateCode, extractFilesFromResponse, FileContent } from '@/lib/services/claudeService';
import { createProjectZip } from '@/lib/services/zipService';

// Helper function to add an initial set of files if none exist
const createInitialFiles = (): FileContent[] => {
  return [
    {
      path: 'App.jsx',
      content: `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Blossom AI Generated Website
      </h1>
      <p className="text-gray-700 mb-4">
        Enter a prompt to generate your website with AI.
      </p>
    </div>
  );
}

export default App;`
    },
    {
      path: 'index.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`
    },
    {
      path: 'package.json',
      content: `{
  "name": "blossom-ai-project",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0"
  }
}`
    },
    {
      path: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
    },
    {
      path: 'README.md',
      content: `# Blossom AI Generated Project

This project was created with Blossom AI Builder.

## Getting Started

1. Download the project
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the development server
`
    }
  ];
};

export default function BlossomAIWebBuilder() {
  // State for files and UI
  const [files, setFiles] = useState<FileContent[]>(createInitialFiles());
  const [activeFile, setActiveFile] = useState<string | null>(files[0]?.path || null);
  const [openFiles, setOpenFiles] = useState<string[]>([files[0]?.path || '']);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  
  // State for prompt and generation
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [isFirstGeneration, setIsFirstGeneration] = useState<boolean>(true);
  const [showFileTree, setShowFileTree] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  // Handle file selection in the file tree
  const handleFileSelect = useCallback((path: string) => {
    setActiveFile(path);
    if (!openFiles.includes(path)) {
      setOpenFiles(prev => [...prev, path]);
    }
  }, [openFiles]);

  // Handle file content change in the editor
  const handleFileContentChange = useCallback((content: string) => {
    if (!activeFile) return;

    setFiles(prev => 
      prev.map(file => 
        file.path === activeFile 
          ? { ...file, content } 
          : file
      )
    );
  }, [activeFile]);

  // Handle tab selection in the editor
  const handleSelectTab = useCallback((path: string) => {
    setActiveFile(path);
  }, []);

  // Handle tab close in the editor
  const handleCloseTab = useCallback((path: string) => {
    setOpenFiles(prev => prev.filter(f => f !== path));
    if (activeFile === path) {
      setActiveFile(openFiles.filter(f => f !== path)[0] || null);
    }
  }, [openFiles, activeFile]);

  // Handle AI code generation
  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate code");
      return;
    }

    setIsGenerating(true);
    setStreamingResponse('');
    setError(null);

    try {
      toast.info("Generating code with Claude 3.7 Sonnet...");
      
      // Generate code based on prompt and existing files (if not first generation)
      const existingFiles = isFirstGeneration ? [] : files;
      
      try {
        // Call Claude API and handle streaming response
        const response = await generateCode(
          prompt, 
          existingFiles,
          (accumulatedText) => {
            setStreamingResponse(accumulatedText);
          }
        );
        
        // Process the response to extract files
        let extractedFiles: FileContent[];
        try {
          extractedFiles = extractFilesFromResponse(response);
          
          if (extractedFiles.length === 0) {
            throw new Error("No valid code files could be extracted from Claude's response");
          }
        } catch (parseError) {
          console.error("Failed to extract files from response:", parseError);
          toast.error("Failed to parse Claude's response into files");
          setError(`Failed to parse response: ${parseError.message}`);
          return;
        }

        // If this is the first generation, replace all files
        // Otherwise, merge with existing files (update existing, add new)
        if (isFirstGeneration) {
          setFiles(extractedFiles);
          setIsFirstGeneration(false);
        } else {
          // Merge files: update existing ones and add new ones
          setFiles(prevFiles => {
            const updatedFiles = [...prevFiles];
            
            // Update existing files or add new ones
            extractedFiles.forEach(newFile => {
              const existingIndex = updatedFiles.findIndex(f => f.path === newFile.path);
              if (existingIndex >= 0) {
                updatedFiles[existingIndex] = newFile;
              } else {
                updatedFiles.push(newFile);
              }
            });
            
            return updatedFiles;
          });
        }
        
        // Open the first generated file
        if (extractedFiles.length > 0) {
          const mainFile = extractedFiles.find(f => 
            f.path === 'App.jsx' || 
            f.path === 'index.jsx' || 
            f.path === 'main.jsx'
          ) || extractedFiles[0];
          
          handleFileSelect(mainFile.path);
          setActiveView('preview'); // Switch to preview tab
        }
        
        toast.success(`Generated ${extractedFiles.length} files successfully!`);
        setPrompt('');
      } catch (apiError) {
        console.error("API Error:", apiError);
        toast.error(`Claude API error: ${apiError.message}`);
        setError(`Claude API error: ${apiError.message}`);
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error(`Error generating code: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setError(`Error generating code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle project download as ZIP
  const handleDownloadZip = async () => {
    try {
      toast.info("Creating ZIP file...");
      const blob = await createProjectZip(files);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blossom-ai-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Project downloaded successfully!");
    } catch (error) {
      console.error("Error downloading project:", error);
      toast.error("Failed to download project");
    }
  };

  // Sample prompts for inspiration
  const samplePrompts = [
    "Create a modern landing page for a coffee shop with a hero section, features, and contact form",
    "Build a personal portfolio website with about me, projects, and contact sections",
    "Generate a blog homepage with featured posts, categories, and subscription form",
    "Create an e-commerce product page with image gallery, details, and add to cart functionality"
  ];

  // Handle sample prompt selection
  const handleSamplePrompt = (sample: string) => {
    setPrompt(sample);
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  };

  // Toggle file tree visibility
  const toggleFileTree = () => {
    setShowFileTree(prev => !prev);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#121212] text-white p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-amber-400 mr-2" />
            <h1 className="text-xl font-bold text-amber-300">Blossom AI Builder</h1>
          </div>
          <Button
            variant="outline"
            className="border-amber-600 text-amber-400 hover:bg-amber-900/30"
            onClick={handleDownloadZip}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Project
          </Button>
        </div>
        
        {/* Prompt input section */}
        <div className="mt-4">
          <div className="relative">
            <Textarea
              ref={promptInputRef}
              placeholder="Describe the website you want to build with AI..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleGenerateCode();
                }
              }}
              className="min-h-[80px] bg-gray-900 border-gray-700 text-gray-100 resize-none focus:border-amber-500"
              disabled={isGenerating}
            />
            <div className="absolute right-2 bottom-2 text-xs text-gray-500">
              Ctrl+Enter to submit
            </div>
          </div>
          
          <div className="flex justify-between mt-2">
            <Button 
              onClick={handleGenerateCode}
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {isFirstGeneration ? 'Generate Website' : 'Update Website'}
                </>
              )}
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={toggleFileTree}
              >
                {showFileTree ? 'Hide Files' : 'Show Files'}
              </Button>
              
              <Button
                variant={activeView === 'editor' ? 'default' : 'outline'}
                className={activeView === 'editor' ? 'bg-blue-600' : ''}
                onClick={() => setActiveView('editor')}
              >
                <Code className="h-4 w-4 mr-1" />
                Editor
              </Button>
              
              <Button
                variant={activeView === 'preview' ? 'default' : 'outline'}
                className={activeView === 'preview' ? 'bg-blue-600' : ''}
                onClick={() => setActiveView('preview')}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
          
          {/* Sample prompts */}
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">Try these sample prompts:</p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => handleSamplePrompt(sample)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded truncate max-w-[200px] text-left"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main editor/preview area */}
      <div className="flex flex-1 overflow-hidden">
        {/* File tree sidebar */}
        {showFileTree && (
          <div className="w-64 border-r border-gray-800">
            <FileTree 
              files={files} 
              activeFile={activeFile} 
              onFileSelect={handleFileSelect} 
            />
          </div>
        )}
        
        {/* Editor/Preview main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Tab Content */}
          <div className="flex-1 p-0 overflow-hidden flex flex-col">
            {activeView === "editor" ? (
              <>
                <EditorTabs 
                  openFiles={openFiles} 
                  activeFile={activeFile} 
                  onSelectTab={handleSelectTab} 
                  onCloseTab={handleCloseTab} 
                />
                
                {activeFile ? (
                  <div className="flex-1">
                    {files.find(f => f.path === activeFile) ? (
                      <MonacoEditor
                        value={files.find(f => f.path === activeFile)?.content || ''}
                        language={getFileLanguage(activeFile)}
                        onChange={handleFileContentChange}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-800 text-gray-400">
                        File not found: {activeFile}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-800 text-gray-400">
                    Select a file from the file tree to edit
                  </div>
                )}
              </>
            ) : (
              <LivePreview 
                files={files} 
                viewportSize={viewportSize}
                onViewportChange={setViewportSize}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Streaming response from Claude (only shown when generating) */}
      {isGenerating && streamingResponse && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-800 bg-gray-900 overflow-auto"
          style={{ maxHeight: '30vh' }}
        >
          <div className="p-3 text-sm text-amber-300 font-semibold flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Claude 3.7 Sonnet Response
          </div>
          <div className="p-3 text-gray-300 text-sm font-mono whitespace-pre-wrap max-h-[200px] overflow-y-auto">
            <div className="max-w-full overflow-auto">
              {streamingResponse}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Error message display */}
      {error && !isGenerating && (
        <div className="border-t border-red-800 bg-red-900/20 p-4">
          <h4 className="text-red-400 font-medium mb-2">Error</h4>
          <p className="text-sm text-red-300">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 border-red-600 text-red-400 hover:bg-red-900/30"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}
