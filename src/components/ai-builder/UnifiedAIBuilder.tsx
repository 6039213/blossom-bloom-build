
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import LivePreview from './LivePreview';
import CodePane from './CodePane';
import ChatInterface from './ChatInterface';
import FileExplorer from './FileExplorer';
import { FileContent, generateCode, extractFilesFromResponse } from '@/lib/services/claudeService';

// Define the props interface for ChatInterface
interface ChatInterfaceProps {
  onSendPrompt: (prompt: string, existingFiles?: FileContent[]) => Promise<void>;
  isLoading: boolean;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    files?: Array<{path: string, content: string}>;
  }>;
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
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    files?: Array<{path: string, content: string}>;
  }>>([]);
  
  // Initialize the builder
  useEffect(() => {
    const initializeBuilder = async () => {
      try {
        setIsLoading(true);
        
        // Add a small delay to ensure any required resources are loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize with an empty state/sample file if needed
        if (files.length === 0) {
          setFiles([{
            path: 'src/App.tsx',
            content: `import React from 'react';

export default function App() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to AI Builder</h1>
      <p className="mb-4">Start by describing what you want to build in the chat.</p>
    </div>
  );
}`,
            type: 'tsx'
          }]);
        }
        
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
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: prompt
    }]);
    
    try {
      const response = await generateCode(prompt, existingFiles, undefined, {
        system: "You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS."
      });
      
      const newFiles = extractFilesFromResponse(response);
      
      if (newFiles.length > 0) {
        // Add type property to files if it doesn't exist
        const filesWithType = newFiles.map(file => ({
          ...file,
          type: file.type || file.path.split('.').pop() || 'js'
        }));
        
        setFiles(prev => [...prev, ...filesWithType]);
        
        // Add assistant message with response
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: response.replace(/```[\s\S]*?```/g, ''), // Remove code blocks from the message
          files: newFiles.map(file => ({ path: file.path, content: file.content }))
        }]);
        
        toast.success(`Generated ${newFiles.length} files successfully`);
      } else {
        // Add assistant message with just the text response
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: response
        }]);
        
        toast.warning("No files were generated from the response");
      }
      
    } catch (error) {
      console.error('Error generating files:', error);
      toast.error(`Failed to generate files: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  
  // Layout is now modified to have chat on the left and preview/code on the right
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
