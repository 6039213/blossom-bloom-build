
import React, { useState, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { getSelectedModel } from '@/lib/llm/modelSelection';
import CodePreview from './ai-builder/CodePreview';
import ErrorDetectionHandler from './ai-builder/ErrorDetectionHandler';
import { detectProjectType } from './ai-builder/utils';
import { ProjectFiles } from './ai-builder/types';
import { buildFileTree } from '@/utils/fileStructureUtils';
import { FileSystemItem } from './FileExplorer';
import { parseClaudeOutput, FileDefinition, convertToProjectFiles } from '@/utils/fileSystemParser';

// Define types for our AI response
interface FileEdit {
  file: string;
  action: 'replace' | 'create' | 'delete';
  content: string;
}

// Define message type with ID
interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  edits?: FileEdit[];
  npmChanges?: string[];
  generatedFiles?: FileDefinition[];
}

export default function AIWebBuilder() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [projectId] = useState<string>(uuidv4().substring(0, 6));
  const [projectName, setProjectName] = useState<string>("New Project");
  
  // File system state
  const [files, setFiles] = useState<Record<string, string>>({
    'src/App.tsx': 'import React from "react";\n\nexport default function App() {\n  return (\n    <div className="flex min-h-screen items-center justify-center bg-gray-100">\n      <div className="w-full max-w-6xl p-4">\n        <h1 className="text-3xl font-bold text-blue-600 mb-6">Blossom AI Web Builder</h1>\n        <p className="text-gray-700 mb-4">Start building your web app by describing it in the text input.</p>\n        <p className="text-gray-500 text-sm">Powered by advanced AI to generate complete, functional websites.</p>\n      </div>\n    </div>\n  );\n}',
    'src/index.tsx': 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\nimport "./styles/tailwind.css";\n\nReactDOM.createRoot(document.getElementById("root")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n);',
    'src/styles/tailwind.css': '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
  });
  
  // File tree state
  const [fileTree, setFileTree] = useState<FileSystemItem[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>('src/App.tsx');
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>({});
  const [viewportSize, setViewportSize] = useState('desktop');
  const [detectedType, setDetectedType] = useState<string | null>('react');
  const [runtimeError, setRuntimeError] = useState<{ message: string; file?: string } | null>(null);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<FileDefinition[]>([]);

  // Update project files when files change
  useEffect(() => {
    const formattedFiles: ProjectFiles = {};
    Object.entries(files).forEach(([path, content]) => {
      formattedFiles[path] = { code: content };
    });
    setProjectFiles(formattedFiles);
    
    // Detect project type
    const type = detectProjectType(formattedFiles);
    setDetectedType(type);
  }, [files]);

  // Update file tree when files change
  useEffect(() => {
    try {
      const tree = buildFileTree(files);
      setFileTree(tree);
    } catch (error) {
      console.error("Error building file tree:", error);
    }
  }, [files]);

  const handleRuntimeError = (error: { message: string; file?: string } | null) => {
    setRuntimeError(error);
  };

  const handleFixError = async () => {
    if (!runtimeError) return;
    
    const errorFile = runtimeError.file || '';
    const errorMessage = runtimeError.message || '';
    
    // Automatically generate a prompt to fix the error
    const fixPrompt = `Fix this error in ${errorFile}: ${errorMessage}. Only modify this file, don't change other files.`;
    
    // Add the prompt to messages
    const userMessage = { role: 'user' as const, content: fixPrompt, id: uuidv4() };
    setMessages(prev => [...prev, userMessage]);
    
    // Auto-submit this prompt
    await processPrompt(fixPrompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Clear any previous API errors
    setApiError(null);
    
    await processPrompt(prompt);
  };

  const applyGeneratedFiles = (files: FileDefinition[]) => {
    if (!files || files.length === 0) {
      console.error("No files to apply");
      return;
    }
    
    try {
      // Create a new Record<string, string> object from the FileDefinition array
      const updatedFiles: Record<string, string> = {};
      
      // Transform each FileDefinition into a key-value pair in the Record
      files.forEach(file => {
        updatedFiles[file.path] = file.content;
      });
      
      // Update files state with the transformed object
      setFiles(updatedFiles);
      
      // Set first file as active
      if (files.length > 0) {
        setActiveFile(files[0].path);
      }
      
      toast.success(`Generated ${files.length} files successfully`);
    } catch (error) {
      console.error("Error applying generated files:", error);
      toast.error("Failed to apply generated files");
    }
  };
  
  const processPrompt = async (promptText: string) => {
    // Add user message
    const userMessage = { role: 'user' as const, content: promptText, id: uuidv4() };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input if this was from the input field
    if (prompt === promptText) {
      setPrompt('');
    }
    
    // Call AI service
    setIsLoading(true);
    setStreamingResponse('');
    
    try {
      // Create a message to show while streaming
      const assistantMessageId = uuidv4();
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: '', id: assistantMessageId }
      ]);
      
      // Generate response
      let fullResponse = '';
      
      // Get the Claude 3.7 Sonnet model
      const model = getSelectedModel();
      if (!model) {
        throw new Error("AI model not available");
      }
      
      // Stream response from the model
      fullResponse = '';
      const addToken = (token: string) => {
        fullResponse += token;
        setStreamingResponse(fullResponse);
        
        // Update the streaming message in the messages list
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: fullResponse } 
              : msg
          )
        );
      };
      
      console.log("Building your website with Blossom AI...");
      
      // Use the selected model's generateStream method
      await model.generateStream(promptText, addToken, {
        temperature: 0.7,
        maxOutputTokens: 4096
      });
      
      console.log("Response completed");
      
      // Parse generated files from Claude's output
      const parsedFiles = parseClaudeOutput(fullResponse);
      setGeneratedFiles(parsedFiles);
      
      if (parsedFiles && parsedFiles.length > 0) {
        // Apply the generated files
        applyGeneratedFiles(parsedFiles);
        
        // Update the final assistant message with file info
        const aiMessage = { 
          role: 'assistant' as const,
          content: fullResponse,
          generatedFiles: parsedFiles,
          id: assistantMessageId
        };
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId 
              ? aiMessage 
              : msg
          )
        );
        
        // Show success notification
        toast.success(`Generated ${parsedFiles.length} files successfully`);
        
        // Convert to project files format
        const newProjectFiles = convertToProjectFiles(parsedFiles);
        setProjectFiles(newProjectFiles);
      } else {
        toast.error("Failed to generate valid files from AI response");
      }
      
      // Switch to preview tab to show changes
      setActiveTab('preview');
    } catch (error) {
      console.error('Error building website:', error);
      setApiError(`Failed to generate website: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error("Failed to generate website");
      
      // Add error message
      const errorMessage = { 
        role: 'assistant' as const, 
        content: `Sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        id: uuidv4()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Function to render message bubbles
  const renderMessages = () => {
    return messages.map((message) => (
      <div 
        key={message.id || Math.random()} 
        className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
      >
        <div 
          className={`inline-block max-w-[85%] rounded-lg p-3 ${
            message.role === 'user' 
            ? 'bg-blue-100 text-blue-900' 
            : 'bg-gray-100 text-gray-900'
          }`}
        >
          <div className="whitespace-pre-wrap">
            {/* Limit visible content length and add View More button for long messages */}
            {message.content.length > 500 
              ? `${message.content.substring(0, 500)}... `
              : message.content}
          </div>
          
          {message.generatedFiles && message.generatedFiles.length > 0 && (
            <div className="mt-2 text-sm">
              <p className="font-medium">Files generated:</p>
              <ul className="list-disc list-inside">
                {message.generatedFiles.slice(0, 5).map((file, i) => (
                  <li key={i} className="text-xs">
                    {file.path}
                  </li>
                ))}
                {message.generatedFiles.length > 5 && (
                  <li className="text-xs">
                    ...and {message.generatedFiles.length - 5} more files
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Left side: Chat and Input - Taking 30% of the width */}
      <div className="w-1/3 flex flex-col border-r border-border">
        {/* Chat header */}
        <div className="p-3 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Project ID: {projectId}</h3>
          </div>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-md m-4">
            <p>{apiError}</p>
            <p className="mt-2">Please try again or contact support if the issue persists.</p>
          </div>
        )}

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Welcome to Blossom AI Website Builder</h2>
              <p className="text-gray-500 mb-6">
                Describe what you want to build, and we'll generate a complete website for you.
              </p>
              <div className="w-full max-w-md bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                <p className="font-medium mb-1">Try examples like:</p>
                <ul className="list-disc list-inside space-y-1 text-left">
                  <li>"Create a landing page for a vegan restaurant"</li>
                  <li>"Build a portfolio site for a professional photographer"</li>
                  <li>"Make a dashboard for a project management tool"</li>
                </ul>
              </div>
            </div>
          ) : (
            renderMessages()
          )}
        </div>
        
        {/* Input section */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the website or application you want to create in detail..."
              className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500"
              disabled={isLoading}
            />
            <Button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!prompt.trim() || isLoading}
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
        </div>
      </div>
      
      {/* Right side: Code Preview - Taking 70% of the width, Full Screen Responsive */}
      <div className="w-2/3 flex flex-col">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">Live Preview</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewportSize('mobile')}
              className={viewportSize === 'mobile' ? 'bg-blue-50' : ''}
            >
              Mobile
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewportSize('tablet')}
              className={viewportSize === 'tablet' ? 'bg-blue-50' : ''}
            >
              Tablet
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewportSize('desktop')}
              className={viewportSize === 'desktop' ? 'bg-blue-50' : ''}
            >
              Desktop
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden p-4">
          <CodePreview 
            projectFiles={projectFiles}
            activeTab={activeTab} 
            setActiveTab={(val) => setActiveTab(val as 'preview' | 'code')}
            activeFile={activeFile || ''}
            viewportSize={viewportSize}
            setViewportSize={setViewportSize}
            detectedType={detectedType}
            onDetectError={handleRuntimeError}
          />
        </div>

        {/* Show runtime error at the bottom of the page */}
        {runtimeError && (
          <div className="p-2 bg-red-50 border-t border-red-200">
            <ErrorDetectionHandler 
              error={runtimeError}
              onFixError={handleFixError}
              onIgnoreError={() => setRuntimeError(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
