import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AIResponseDisplay, { ChatMessage } from '@/components/dashboard/AIResponseDisplay';
import { useProjectStore, ProjectStatus } from '@/stores/projectStore';
import { useAuth } from '@/contexts/AuthContext';
import { createDefaultFilesForTemplate, projectTemplates } from '@/utils/projectTemplates';
import { 
  CodeGenerator, 
  CodePreview, 
  EmptyStateView, 
  ErrorMessage,
  ProjectInput,
  WebContainerService,
  Types,
  InternalChatMessage
} from './ai-builder';
import { findMainFile } from '@/components/dashboard/ai-builder/utils';
import { geminiProvider } from '@/lib/providers/gemini';

export default function AIBuilder() {
  // State variables
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [projectFiles, setProjectFiles] = useState<Types.ProjectFiles>({});
  const [activeTab, setActiveTab] = useState('preview');
  const [projectName, setProjectName] = useState('');
  const [activeFile, setActiveFile] = useState('/src/App.tsx');
  const [viewportSize, setViewportSize] = useState('desktop');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Types.ProjectTemplate | null>(null);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [webContainerInstance, setWebContainerInstance] = useState<Types.WebContainerInstance | null>(null);

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { createProject } = useProjectStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Scroll to bottom of chat container when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Handle terminal data from WebContainer
  const handleTerminalData = useCallback((data: string) => {
    setTerminalOutput(prev => prev + data);
  }, []);
  
  // Handle WebContainer ready
  const handleWebContainerReady = useCallback((instance: Types.WebContainerInstance) => {
    setWebContainerInstance(instance);
    toast.success("AI Builder is ready");
  }, []);
  
  // Handle prompt submission
  const handlePromptSubmit = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;
    
    // Generate a new message ID
    const messageId = uuidv4();
    setCurrentMessageId(messageId);
    
    // Create new chat messages with createdAt property
    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      id: uuidv4(),
      createdAt: new Date()
    };
    
    // Add user message to chat
    setChatMessages(prev => [...prev, userMessage]);
    
    // Reset streaming message
    setStreamingMessage('');
    
    // Show generating state
    setIsGenerating(true);
    
    try {
      // Prepare system message
      const systemMessage = {
        role: 'system',
        content: 'You are an AI assistant that helps with generating code for web applications. ' +
                 'Always output React components in TypeScript (.tsx). ' +
                 'Never emit .js / .jsx. ' +
                 'Do not offer model switching.'
      };
      
      // Stream response from Gemini
      await geminiProvider.stream({
        messages: [
          systemMessage,
          ...chatMessages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: prompt }
        ],
        onToken: (token: string) => {
          setStreamingMessage(prev => prev + token);
        },
      });
      
      // Create assistant message with createdAt property
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: streamingMessage,
        id: messageId,
        createdAt: new Date()
      };
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, assistantMessage]);
      
      // Parse code blocks from response
      const parsedFiles = parseCodeBlocks(streamingMessage);
      if (Object.keys(parsedFiles).length > 0) {
        setProjectFiles(parsedFiles);
        setGeneratedCode(JSON.stringify(parsedFiles, null, 2));
        
        // Find main file and set as active
        const mainFile = findMainFile(parsedFiles, detectedType || 'react');
        setActiveFile(mainFile);
        
        // Switch to preview tab
        setActiveTab('preview');
        
        // Detect project type if not already set
        if (!detectedType) {
          detectProjectType(parsedFiles);
        }
        
        // Set project name if not already set
        if (!projectName) {
          setProjectName(extractProjectName(prompt));
        }
        
        // Hide template selector
        setShowTemplateSelector(false);
        
        // Apply changes to WebContainer if available
        if (webContainerInstance) {
          try {
            // Create a simple diff string for demonstration
            const diffString = createDiffString(parsedFiles);
            await webContainerInstance.applyDiff(diffString);
            
            // Check if we need to install dependencies
            const filesChanged = Object.keys(parsedFiles);
            const needsInstall = filesChanged.some(file => file.includes('package.json'));
            
            if (needsInstall) {
              await webContainerInstance.installAndRestartIfNeeded(filesChanged);
            }
          } catch (error) {
            console.error("Failed to apply changes to WebContainer:", error);
            setErrorMessage("Failed to apply changes to WebContainer");
          }
        }
      }
    } catch (error) {
      console.error("Error generating code:", error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error generating code');
    } finally {
      // Hide generating state
      setIsGenerating(false);
      setCurrentMessageId(null);
    }
  }, [chatMessages, streamingMessage, webContainerInstance, detectedType, projectName]);
  
  // Helper functions
  const parseCodeBlocks = (text: string): Types.ProjectFiles => {
    // Mock implementation - in reality, you would parse the code blocks from the AI response
    const files: Types.ProjectFiles = {};
    return files;
  };
  
  const detectProjectType = (files: Types.ProjectFiles): void => {
    // Mock implementation - in reality, you would detect the project type based on the files
    setDetectedType('react');
  };
  
  const extractProjectName = (prompt: string): string => {
    // Mock implementation - in reality, you would extract a project name from the prompt
    return prompt.split(' ')[0] || 'New Project';
  };
  
  const createDiffString = (files: Types.ProjectFiles): string => {
    // Mock implementation - in reality, you would create a diff string from the files
    return Object.keys(files).map(path => `create ${path}`).join('\n');
  };
  
  // Template selection handler
  const handleTemplateSelect = (template: Types.ProjectTemplate) => {
    setSelectedTemplate(template);
    setDetectedType(template.type);
    setShowTemplateSelector(false);
    
    const defaultFiles = createDefaultFilesForTemplate(template.type);
    if (Object.keys(defaultFiles).length > 0) {
      setProjectFiles(defaultFiles);
      setGeneratedCode(JSON.stringify(defaultFiles, null, 2));
      
      let mainFile = findMainFile(defaultFiles, template.type);
      setActiveFile(mainFile);
      
      toast.success("Template files created! You can customize with AI prompt or edit directly.");
    }
  };
  
  // Action handlers
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard");
  };
  
  const handleDownloadCode = () => {
    if (webContainerInstance) {
      webContainerInstance.packZip().then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName || 'generated-project'}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Code downloaded successfully");
      }).catch(error => {
        console.error("Failed to download ZIP:", error);
        setErrorMessage("Failed to download ZIP");
      });
    } else {
      const blob = new Blob([generatedCode], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName || 'generated-project'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Code downloaded successfully");
    }
  };

  const handleSaveProject = async () => {
    if (!user) {
      toast.error("You must be logged in to save a project");
      navigate('/auth');
      return;
    }

    if (Object.keys(projectFiles).length === 0) {
      toast.error("No project to save");
      return;
    }

    try {
      const projectData = {
        title: projectName,
        description: `${detectedType ? `${detectedType.charAt(0).toUpperCase() + detectedType.slice(1)} clone ` : ""}Generated with AI Builder`,
        code: JSON.stringify(projectFiles),
        status: 'draft' as ProjectStatus
      };

      const newProject = await createProject(projectData);
      
      toast.success("Project saved successfully");
      navigate(`/dashboard/projects/${newProject.id}`);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };

  const handleCodeChange = (updatedFiles: Types.ProjectFiles) => {
    setProjectFiles(updatedFiles);
    setGeneratedCode(JSON.stringify(updatedFiles, null, 2));
  };

  const handleOpenInNewTab = () => {
    // Implementation unchanged
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${projectName || 'AI Generated Project'}</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; }
          iframe { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <div id="sandbox-container"></div>
        <script type="module">
          const iframe = document.createElement('iframe');
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          document.getElementById('sandbox-container').appendChild(iframe);
          
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          doc.open();
          doc.write('<html><head><title>Preview</title><style>body{margin:0;padding:20px;font-family:sans-serif;}</style></head><body><h1>Preview Mode</h1><p>This is a preview of your project: ${projectName || 'Untitled Project'}</p></body></html>');
          doc.close();
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };
  
  const handleReportError = (error: Error) => {
    setErrorMessage(error.message);
    toast.error("Error reported. Our AI assistant will help resolve this issue.");
  };
  
  const handleResetSelection = () => {
    setSelectedTemplate(null);
    setShowTemplateSelector(true);
    setProjectFiles({});
    setGeneratedCode('');
  };

  const handleUseTemplatePrompt = () => {
    if (selectedTemplate) {
      handlePromptSubmit(selectedTemplate.defaultPrompt);
    }
  };

  const handleSnapshot = () => {
    if (webContainerInstance) {
      webContainerInstance.snapshot()
        .then(() => toast.success("Snapshot created successfully"))
        .catch(error => {
          console.error("Failed to create snapshot:", error);
          setErrorMessage("Failed to create snapshot");
        });
    }
  };

  const handleRevert = () => {
    if (webContainerInstance) {
      webContainerInstance.revert()
        .then(() => toast.success("Reverted to previous snapshot"))
        .catch(error => {
          console.error("Failed to revert to snapshot:", error);
          setErrorMessage("Failed to revert to snapshot");
        });
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AI Website Builder</h1>
            {detectedType && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Project type:</span>
                <span className="bg-blossom-100 dark:bg-blossom-900/30 px-2 py-1 rounded text-xs font-medium text-blossom-700 dark:text-blossom-300 capitalize">
                  {detectedType}
                </span>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col h-full overflow-hidden border-r border-border lg:col-span-2">
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto" 
              style={{ scrollBehavior: 'smooth' }}
            >
              <AIResponseDisplay messages={chatMessages} isLoading={false} />
              
              {/* Terminal Output Section */}
              {terminalOutput && (
                <div className="p-4 bg-gray-900 text-gray-300 font-mono text-xs">
                  <div className="mb-2 text-gray-500 flex items-center">
                    <span>Terminal Output</span>
                    <div className="flex-1 ml-2 border-t border-gray-700" />
                  </div>
                  <pre className="whitespace-pre-wrap">
                    {terminalOutput}
                  </pre>
                </div>
              )}
            </div>
            
            <ProjectInput 
              showTemplateSelector={showTemplateSelector}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              onResetSelection={handleResetSelection}
              onUseTemplatePrompt={handleUseTemplatePrompt}
              errorMessage={errorMessage}
              onDismissError={() => setErrorMessage(null)}
              onPromptSubmit={handlePromptSubmit}
              isGenerating={isGenerating}
              onSaveCode={handleSaveProject}
              showSaveButton={Object.keys(projectFiles).length > 0}
              onReportError={handleReportError}
              onSnapshot={handleSnapshot}
              onRevert={handleRevert}
            />
          </div>
          
          <div className="overflow-hidden p-2 h-full border-t md:border-t-0 lg:col-span-3">
            {Object.keys(projectFiles).length === 0 ? (
              <EmptyStateView selectedTemplate={selectedTemplate} />
            ) : (
              <CodePreview 
                projectFiles={projectFiles}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeFile={activeFile}
                viewportSize={viewportSize}
                setViewportSize={setViewportSize}
                detectedType={detectedType}
                onCodeChange={handleCodeChange}
                onCopy={handleCopyCode}
                onDownload={handleDownloadCode}
                onReset={() => {
                  setProjectFiles({});
                  setGeneratedCode('');
                  if (selectedTemplate) {
                    setShowTemplateSelector(false);
                  } else {
                    setShowTemplateSelector(true);
                  }
                }}
                onSave={handleSaveProject}
                onOpenInNewTab={handleOpenInNewTab}
                terminalOutput={terminalOutput}
              />
            )}
          </div>
        </main>
      </div>
      
      {/* WebContainer Service (invisible component) */}
      <WebContainerService 
        onTerminalData={handleTerminalData}
        onReady={handleWebContainerReady}
      />
    </div>
  );
}
