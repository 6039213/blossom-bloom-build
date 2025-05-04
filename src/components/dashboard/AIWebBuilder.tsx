
import React, { useState, useEffect, useCallback } from 'react';
import { Send, Settings } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CodePreview from './ai-builder/CodePreview';
import ErrorDetectionHandler from './ai-builder/ErrorDetectionHandler';
import { detectProjectType } from './ai-builder/utils';
import { ProjectFiles } from './ai-builder/types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation variants for components
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100
    }
  }
};

export default function AIWebBuilder() {
  const [activeTab, setActiveTab] = useState('preview');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [projectId] = useState(uuidv4().substring(0, 6));
  const [projectName, setProjectName] = useState("New Project");
  
  const [files, setFiles] = useState({
    'src/App.tsx': 'import React from "react";\n\nexport default function App() {\n  return (\n    <div className="flex min-h-screen items-center justify-center bg-gray-100">\n      <div className="w-full max-w-6xl p-4">\n        <h1 className="text-3xl font-bold text-blue-600 mb-6">Blossom AI Web Builder</h1>\n        <p className="text-gray-700 mb-4">Start building your web app by describing it in the text input.</p>\n        <p className="text-gray-500 text-sm">Powered by advanced AI to generate complete, functional websites.</p>\n      </div>\n    </div>\n  );\n}',
    'src/index.tsx': 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\nimport "./styles/tailwind.css";\n\nReactDOM.createRoot(document.getElementById("root")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n);',
    'src/styles/tailwind.css': '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
  });
  
  const [activeFile, setActiveFile] = useState('src/App.tsx');
  const [projectFiles, setProjectFiles] = useState({});
  const [viewportSize, setViewportSize] = useState('desktop');
  const [detectedType, setDetectedType] = useState('react');
  const [runtimeError, setRuntimeError] = useState(null);

  // Check if API key is set
  const [apiKeySet, setApiKeySet] = useState(false);
  
  useEffect(() => {
    // Check for API key in localStorage
    const apiKey = localStorage.getItem('VITE_CLAUDE_API_KEY') || import.meta.env.VITE_CLAUDE_API_KEY;
    setApiKeySet(!!apiKey);
  }, []);

  // Update project files when files change
  useEffect(() => {
    const formattedFiles = {};
    Object.entries(files).forEach(([path, content]) => {
      formattedFiles[path] = { code: content };
    });
    setProjectFiles(formattedFiles);
    
    // Detect project type
    const type = detectProjectType(formattedFiles);
    if (type) setDetectedType(type);
  }, [files]);

  const handleRuntimeError = (error) => {
    setRuntimeError(error);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Clear any previous API errors
    setApiError(null);
    
    // Simulate processing
    setIsLoading(true);
    
    // In a real app, we'd call the AI here
    setTimeout(() => {
      toast.success("Processing your request...");
      setIsLoading(false);
      setPrompt('');
      
      // If API key is not set, show a notification
      if (!apiKeySet) {
        toast.error("API key is required to generate content");
        setApiError("Please set your API key in Settings");
      }
    }, 1500);
  };

  return (
    <motion.div 
      className="flex h-full overflow-hidden bg-background rounded-lg shadow-lg border border-border/50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left side: Chat and Input - Taking 30% of the width */}
      <motion.div 
        className="w-1/3 flex flex-col border-r border-border"
        variants={itemVariants}
      >
        {/* Chat header */}
        <div className="p-3 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Project ID: {projectId}</h3>
            <Link 
              to="/settings/api" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Settings size={14} />
              {apiKeySet ? 'API Settings' : 'Set API Key'}
            </Link>
          </div>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <motion.div 
            className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-md m-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <p>{apiError}</p>
            {!apiKeySet && (
              <div className="mt-2">
                <Link 
                  to="/settings/api" 
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-800 bg-red-50 rounded-md text-sm font-medium hover:bg-red-100"
                >
                  <Settings size={14} className="mr-1" />
                  Set API Key
                </Link>
              </div>
            )}
            <p className="mt-2 text-sm">Please try again or contact support if the issue persists.</p>
          </motion.div>
        )}

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <motion.div 
                className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 1.5 }}
              >
                <span className="text-2xl">✨</span>
              </motion.div>
              <motion.h2 
                className="text-xl font-semibold mb-2"
                variants={itemVariants}
              >
                Welcome to Blossom AI Website Builder
              </motion.h2>
              <motion.p 
                className="text-gray-500 mb-6"
                variants={itemVariants}
              >
                Describe what you want to build, and we'll generate a complete website for you.
              </motion.p>
              {!apiKeySet && (
                <motion.div 
                  className="w-full max-w-md bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-700 mb-6"
                  variants={itemVariants}
                >
                  <p className="font-medium flex items-center gap-2 mb-2">
                    <Settings size={16} />
                    API Key Required
                  </p>
                  <p className="mb-3 text-sm">
                    You need to set up your Anthropic API key before generating websites.
                  </p>
                  <Link 
                    to="/settings/api" 
                    className="inline-flex items-center px-3 py-1.5 bg-amber-100 border border-amber-300 rounded-md text-sm font-medium hover:bg-amber-200"
                  >
                    Set API Key
                  </Link>
                </motion.div>
              )}
              <motion.div 
                className="w-full max-w-md bg-blue-50 p-3 rounded-lg text-sm text-blue-700"
                variants={itemVariants}
              >
                <p className="font-medium mb-1">Try examples like:</p>
                <ul className="list-disc list-inside space-y-1 text-left">
                  <li>"Create a landing page for a vegan restaurant"</li>
                  <li>"Build a portfolio site for a professional photographer"</li>
                  <li>"Make a dashboard for a project management tool"</li>
                </ul>
              </motion.div>
            </div>
          ) : (
            <div>
              {/* Message bubbles would go here */}
              <p className="text-center text-gray-500">No messages yet</p>
            </div>
          )}
        </div>
        
        {/* Input section */}
        <motion.div 
          className="border-t border-border p-4"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={apiKeySet ? 
                "Describe the website or application you want to create in detail..." : 
                "Please set your API key before generating websites..."}
              className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500"
              disabled={isLoading || !apiKeySet}
            />
            <Button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!prompt.trim() || isLoading || !apiKeySet}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Building...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Generate Web App
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </motion.div>
      
      {/* Right side: Code Preview - Taking 70% of the width */}
      <motion.div 
        className="w-2/3 flex flex-col"
        variants={itemVariants}
      >
        <div className="flex-1 overflow-hidden p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="h-[calc(100%-50px)]">
              <CodePreview 
                projectFiles={projectFiles}
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                activeFile={activeFile || ''}
                viewportSize={viewportSize}
                setViewportSize={setViewportSize}
                detectedType={detectedType}
                onDetectError={handleRuntimeError}
              />
            </TabsContent>
            
            <TabsContent value="code" className="h-[calc(100%-50px)]">
              <div className="h-full bg-gray-900 p-4 text-white overflow-auto rounded-lg">
                <pre className="font-mono text-sm">
                  {JSON.stringify(projectFiles, null, 2)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Show runtime error at the bottom of the page */}
        {runtimeError && (
          <motion.div 
            className="p-2 bg-red-50 border-t border-red-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <ErrorDetectionHandler 
              error={runtimeError}
              onFixError={() => {
                // Handler for fixing errors
                toast.info("Attempting to fix error...");
              }}
              onIgnoreError={() => setRuntimeError(null)}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
