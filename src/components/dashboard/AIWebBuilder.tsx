
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Send } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ChatMessages from './ChatMessages';
import FileExplorer, { FileSystemItem } from './FileExplorer';
import MonacoEditor from './MonacoEditor';
import { buildFileTree, createNewFile } from '@/utils/fileSystem';
import CodePreview from './ai-builder/CodePreview';
import ErrorDetectionHandler from './ai-builder/ErrorDetectionHandler';
import { detectProjectType } from './ai-builder/utils';
import { ProjectFiles } from './ai-builder/types';
import { v4 as uuidv4 } from 'uuid';
import { getSelectedModel } from '@/lib/llm/modelSelection';
import AIModelSelector from './ai-builder/AIModelSelector';
import EmptyStateView from './ai-builder/EmptyStateView';

// Define types for our AI response
interface FileEdit {
  file: string;
  action: 'replace' | 'create' | 'delete';
  content: string;
}

interface AIResponse {
  edits: FileEdit[];
  message: string;
  npmChanges?: string[];
}

// Define message type with ID
interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  edits?: FileEdit[];
  npmChanges?: string[];
}

export default function AIWebBuilder() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [projectId, setProjectId] = useState<string>(uuidv4());
  const [projectName, setProjectName] = useState<string>("Nieuw Project");
  const [selectedModel, setSelectedModel] = useState('claude');
  
  // File system state
  const [files, setFiles] = useState<Record<string, string>>({
    'src/App.tsx': 'import React from "react";\n\nexport default function App() {\n  return (\n    <div className="p-4">\n      <h1 className="text-2xl font-bold text-blue-600">Hello World</h1>\n      <p className="mt-2">Start building your app by describing it to the AI.</p>\n    </div>\n  );\n}',
    'src/index.tsx': 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\nimport "./styles/tailwind.css";\n\nReactDOM.createRoot(document.getElementById("root")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n);',
    'src/styles/tailwind.css': '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
  });
  
  const [fileTree, setFileTree] = useState<FileSystemItem[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>('src/App.tsx');
  const [openFiles, setOpenFiles] = useState<string[]>(['src/App.tsx']);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>({});
  const [viewportSize, setViewportSize] = useState('desktop');
  const [detectedType, setDetectedType] = useState<string | null>('react');
  const [runtimeError, setRuntimeError] = useState<{ message: string; file?: string } | null>(null);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);

  // Handle model change
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    toast.success(`Now using ${model === 'claude' ? 'Claude 3.7 Sonnet' : 'Gemini 2.5 Flash'}`);
  };
  
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
    const tree = buildFileTree(files);
    setFileTree(tree);
  }, [files]);

  const handleFileSelect = (path: string) => {
    setActiveFile(path);
    
    // Add to open files if not already open
    if (!openFiles.includes(path)) {
      setOpenFiles(prev => [...prev, path]);
    }
  };

  const handleTabChange = (path: string) => {
    setActiveFile(path);
  };
  
  const handleTabClose = (path: string) => {
    // Remove from open files
    const newOpenFiles = openFiles.filter(file => file !== path);
    setOpenFiles(newOpenFiles);
    
    // Set a new active file if the closed one was active
    if (activeFile === path && newOpenFiles.length > 0) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1]);
    } else if (newOpenFiles.length === 0) {
      setActiveFile(null);
    }
  };

  const handleContentChange = (path: string, content: string) => {
    setFiles(prev => ({
      ...prev,
      [path]: content
    }));
  };
  
  const handleProjectFilesChange = (newProjectFiles: ProjectFiles) => {
    // Update the files state from the editor
    const newFiles: Record<string, string> = {};
    Object.entries(newProjectFiles).forEach(([path, { code }]) => {
      newFiles[path] = code;
    });
    setFiles(newFiles);
  };

  const handleRuntimeError = (error: { message: string; file?: string } | null) => {
    setRuntimeError(error);
  };

  const handleFixError = async () => {
    if (!runtimeError) return;
    
    const errorFile = runtimeError.file || '';
    const errorMessage = runtimeError.message || '';
    
    // Automatically generate a prompt to fix the error
    const fixPrompt = `Fix deze fout in ${errorFile}: ${errorMessage}. Alleen deze file aanpassen, geen andere bestanden wijzigen.`;
    
    // Add the prompt to messages
    const userMessage = { role: 'user' as const, content: fixPrompt, id: uuidv4() };
    setMessages(prev => [...prev, userMessage]);
    
    // Auto-submit this prompt
    await processPrompt(fixPrompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    await processPrompt(prompt);
  };

  // Parse code blocks from AI response
  const parseFileEditsFromResponse = useCallback((response: string) => {
    const fileEdits: FileEdit[] = [];
    const fileRegex = /```(?:tsx|jsx|ts|js|css|html|json)(?: ([^\n]+))?\n([\s\S]*?)```/g;
    
    let match;
    while ((match = fileRegex.exec(response)) !== null) {
      const fileName = match[1]?.trim();
      const fileContent = match[2];
      
      if (fileName && fileContent) {
        fileEdits.push({
          file: fileName,
          action: files[fileName] ? 'replace' : 'create',
          content: fileContent
        });
      }
    }
    
    // Also check for FILE: format
    const fileBlockRegex = /\/\/ FILE: ([^\n]+)\n([\s\S]*?)(?=\/\/ FILE:|$)/g;
    while ((match = fileBlockRegex.exec(response)) !== null) {
      const fileName = match[1]?.trim();
      const fileContent = match[2].trim();
      
      if (fileName && fileContent) {
        fileEdits.push({
          file: fileName,
          action: files[fileName] ? 'replace' : 'create',
          content: fileContent
        });
      }
    }
    
    // Extract npm dependencies
    const npmChanges: string[] = [];
    const npmRegex = /(?:npm install|yarn add) ([\w\s@\/-]+)/g;
    while ((match = npmRegex.exec(response)) !== null) {
      npmChanges.push(match[1].trim());
    }
    
    return { fileEdits, npmChanges };
  }, [files]);
  
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
      
      // Add current files context to the prompt
      const filesList = Object.keys(files).map(path => `- ${path}`).join('\n');
      const contextPrompt = `
      The user is building a website with these files:
      ${filesList}
      
      Generate or modify code based on this request: "${promptText}"
      
      Return your response with code blocks like:
      \`\`\`tsx src/components/NewComponent.tsx
      // component code here
      \`\`\`
      
      Or use FILE: format:
      // FILE: src/components/AnotherComponent.tsx
      // component code here
      
      Let me know which files you've created or modified.
      `;
      
      // Get the selected AI model
      const model = getSelectedModel();
      
      // Stream response from the model
      let fullResponse = '';
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
      
      // Use the selected model's generateStream method
      await model.generateStream(contextPrompt, addToken, {
        temperature: 0.7,
        maxOutputTokens: 4096
      });
      
      // When stream is complete, parse the file edits from the response
      const { fileEdits, npmChanges } = parseFileEditsFromResponse(fullResponse);
      
      // Apply file edits
      if (fileEdits.length > 0) {
        const updatedFiles = { ...files };
        
        fileEdits.forEach(edit => {
          if (edit.action === 'replace' || edit.action === 'create') {
            updatedFiles[edit.file] = edit.content;
          } else if (edit.action === 'delete') {
            delete updatedFiles[edit.file];
          }
        });
        
        // Update files state
        setFiles(updatedFiles);
        
        // If a new file was created, set it as active
        if (fileEdits.some(edit => edit.action === 'create')) {
          const newFile = fileEdits.find(edit => edit.action === 'create')?.file;
          if (newFile) {
            setActiveFile(newFile);
            setOpenFiles(prev => [...prev, newFile]);
          }
        }
        
        // Set flag that we have generated content
        setHasGeneratedContent(true);
      }
      
      // Update the final assistant message with edits info
      const aiMessage = { 
        role: 'assistant' as const,
        content: fullResponse,
        edits: fileEdits,
        npmChanges,
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
      toast.success("Changes applied successfully");
      
      // Switch to preview tab to show changes
      setActiveTab('preview');
    } catch (error) {
      console.error('Error calling AI:', error);
      toast.error("Failed to generate response");
      
      // Add error message
      const errorMessage = { 
        role: 'assistant' as const, 
        content: `Sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        id: uuidv4()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Chat section (left ~25%) */}
      <div className="w-1/4 flex flex-col border-r border-border">
        {/* Chat header */}
        <div className="p-3 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{projectName}</h3>
            <span className="text-xs text-muted-foreground">Project ID: {projectId.substring(0, 6)}</span>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading} 
          />
        </div>
        
        {/* Model selector and input section */}
        <div className="border-t border-border p-4">
          <div className="mb-3">
            <AIModelSelector 
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
            />
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Beschrijf de website die je wilt bouwen..."
              className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500"
              disabled={isLoading}
            />
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Upload className="w-4 h-4" />
                Upload Files
              </Button>
              <Button 
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={!prompt.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Genereren...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Genereren
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* File explorer (middle) */}
      <div className="w-1/6 flex flex-col">
        <FileExplorer 
          files={fileTree} 
          activeFile={activeFile}
          onFileSelect={handleFileSelect}
        />
      </div>
      
      {/* Code Editor / Preview section */}
      <div className="w-7/12 flex flex-col">
        {/* Content area */}
        <div className="flex-1 overflow-hidden p-4">
          {!hasGeneratedContent ? (
            <EmptyStateView selectedTemplate={null} />
          ) : (
            <CodePreview 
              projectFiles={projectFiles}
              activeTab={activeTab} 
              setActiveTab={(val) => setActiveTab(val as 'preview' | 'code')}
              activeFile={activeFile || ''}
              viewportSize={viewportSize}
              setViewportSize={setViewportSize}
              detectedType={detectedType}
              onDetectError={handleRuntimeError}
              onCodeChange={handleProjectFilesChange}
            />
          )}
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
