
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import LivePreview from './LivePreview';
import CodePane from './CodePane';
import ChatInterface from './ChatInterface';
import FileExplorer from './FileExplorer';
import { anthropicService, FileContent } from '@/lib/services/anthropicService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  files?: Array<{path: string, content: string}>;
}

export default function UnifiedAIBuilder() {
  const [activeTab, setActiveTab] = useState('preview');
  const [files, setFiles] = useState<FileContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Initialize the builder
  useEffect(() => {
    const initializeBuilder = async () => {
      try {
        setIsLoading(true);
        
        // Initialize with a welcome file
        const welcomeFile: FileContent = {
          path: 'src/App.tsx',
          content: `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Blossom AI Builder
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Start by describing what you want to build in the chat.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 text-left">
            <h2 className="text-xl font-semibold mb-4">Getting Started:</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Describe your website or app idea</li>
              <li>• I'll generate React components with Tailwind CSS</li>
              <li>• Review and iterate on the generated code</li>
              <li>• See live preview of your creation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}`,
          type: 'tsx'
        };
        
        setFiles([welcomeFile]);
        setCurrentFile(welcomeFile.path);
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize AI Builder:", err);
        setError("Failed to initialize the preview. Please refresh the page and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeBuilder();
  }, []);
  
  // Handle file generation from AI chat
  const handleGenerateFiles = async (prompt: string, existingFiles: FileContent[] = []) => {
    setIsGenerating(true);
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await anthropicService.generateCode(prompt, existingFiles);
      const newFiles = anthropicService.extractFilesFromResponse(response);
      
      if (newFiles.length > 0) {
        // Merge new files with existing ones
        setFiles(prev => {
          const fileMap = new Map(prev.map(file => [file.path, file]));
          newFiles.forEach(file => fileMap.set(file.path, file));
          return Array.from(fileMap.values());
        });
        
        // Add assistant message with response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.replace(/```[\s\S]*?```/g, ''), // Remove code blocks from display
          files: newFiles.map(file => ({ path: file.path, content: file.content }))
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        toast.success(`Generated ${newFiles.length} files successfully`);
        
        // Switch to preview tab to show results
        setActiveTab('preview');
      } else {
        // Add assistant message with just the text response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        toast.warning("No files were generated from the response");
      }
      
    } catch (error) {
      console.error('Error generating files:', error);
      toast.error(`Failed to generate files: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler for viewport size changes
  const handleViewportChange = (size: 'desktop' | 'tablet' | 'mobile') => {
    setViewportSize(size);
  };
  
  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-medium mb-2">Initializing AI Builder</h2>
          <p className="text-muted-foreground">Loading preview environment...</p>
        </div>
      </div>
    );
  }
  
  // Show error state if initialization failed
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Chat interface on the left */}
      <div className="w-full lg:w-1/3 flex flex-col">
        <ChatInterface 
          onSendPrompt={handleGenerateFiles}
          isLoading={isGenerating}
          messages={messages}
        />
      </div>
      
      {/* Preview and code on the right */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center border-b">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            
            {activeTab === 'preview' && (
              <div className="flex gap-2 pr-2">
                <button 
                  onClick={() => handleViewportChange('mobile')}
                  className={`px-2 py-1 rounded ${viewportSize === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  Mobile
                </button>
                <button 
                  onClick={() => handleViewportChange('tablet')}
                  className={`px-2 py-1 rounded ${viewportSize === 'tablet' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  Tablet
                </button>
                <button 
                  onClick={() => handleViewportChange('desktop')}
                  className={`px-2 py-1 rounded ${viewportSize === 'desktop' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  Desktop
                </button>
              </div>
            )}
          </div>
          
          <TabsContent value="preview" className="flex-1 p-0">
            <LivePreview 
              files={files} 
              viewportSize={viewportSize}
              onViewportChange={handleViewportChange}
            />
          </TabsContent>
          
          <TabsContent value="code" className="flex-1 p-0">
            <CodePane 
              files={files} 
              activeFile={currentFile}
            />
          </TabsContent>
          
          <TabsContent value="files" className="flex-1 p-0">
            <FileExplorer 
              files={files} 
              activeFile={currentFile}
              onFileSelect={setCurrentFile}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
