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
          setActiveFile(extractedFiles[0].path);
          if (!openFiles.includes(extractedFiles[0].path)) {
            setOpenFiles(prev => [...prev, extractedFiles[0].path]);
          }
        }
        
        toast.success("Code generated successfully!");
      } catch (error) {
        console.error("Error generating code:", error);
        toast.error(`Failed to generate code: ${error.message}`);
        setError(error.message);
      }
    } catch (error) {
      console.error("Error in handleGenerateCode:", error);
      toast.error(`An unexpected error occurred: ${error.message}`);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle downloading the project as a ZIP file
  const handleDownloadZip = async () => {
    try {
      toast.info("Creating project ZIP file...");
      const zipBlob = await createProjectZip(files);
      
      // Create a download link and trigger the download
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blossom-ai-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Project downloaded successfully!");
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      toast.error(`Failed to create ZIP file: ${error.message}`);
    }
  };

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
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Blossom AI Web Builder</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFileTree}
          >
            {showFileTree ? 'Hide Files' : 'Show Files'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView(prev => prev === 'editor' ? 'preview' : 'editor')}
          >
            {activeView === 'editor' ? <Eye className="w-4 h-4 mr-2" /> : <Code className="w-4 h-4 mr-2" />}
            {activeView === 'editor' ? 'Preview' : 'Code'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadZip}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File tree */}
        {showFileTree && (
          <div className="w-64 border-r overflow-y-auto">
            <FileTree
              files={files}
              onFileSelect={handleFileSelect}
              activeFile={activeFile}
            />
          </div>
        )}

        {/* Editor/Preview area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeView === 'editor' ? (
            <>
              {/* Editor tabs */}
              <EditorTabs
                openFiles={openFiles}
                activeFile={activeFile}
                onSelectTab={handleSelectTab}
                onCloseTab={handleCloseTab}
              />

              {/* Code editor */}
              {activeFile && (
                <div className="flex-1 overflow-hidden">
                  <MonacoEditor
                    value={files.find(f => f.path === activeFile)?.content || ''}
                    language={getFileLanguage(activeFile)}
                    onChange={handleFileContentChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 overflow-hidden">
              <LivePreview
                files={files}
                viewportSize={viewportSize}
                onViewportChange={setViewportSize}
              />
            </div>
          )}
        </div>
      </div>

      {/* Prompt input */}
      <div className="border-t p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              ref={promptInputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="min-h-[100px]"
              disabled={isGenerating}
            />
          </div>
          <Button
            onClick={handleGenerateCode}
            disabled={isGenerating || !prompt.trim()}
            className="h-[100px]"
          >
            {isGenerating ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>

        {/* Error display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Streaming response */}
        {streamingResponse && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {streamingResponse}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
