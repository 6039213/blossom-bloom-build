
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Code } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Import components
import ProjectInput from './ProjectInput';
import CodePreview from './CodePreview';
import EmptyStateView from './EmptyStateView';
import ErrorMessage from './ErrorMessage';
import ErrorDetectionHandler from './ErrorDetectionHandler';
import { ChatMessage } from '@/components/dashboard/AIResponseDisplay';
import FileExplorer from '@/components/dashboard/FileExplorer';
import { buildFileTree } from '@/utils/fileSystem';
import { projectTemplates } from '@/utils/projectTemplates';

// Import utils and types
import { ProjectFiles, ProjectTemplate, RuntimeError } from './types';
import { FileSystemItem } from '@/components/dashboard/FileExplorer';
import CodeGenerator from './CodeGenerator';

export default function AIWebBuilder() {
  // State for project files and code generation
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>({});
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileSystemItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('preview');
  const [viewportSize, setViewportSize] = useState<string>('desktop');
  
  // State for project metadata
  const [projectName, setProjectName] = useState<string>('New Project');
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState<boolean>(true);
  
  // State for UI display
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  
  // Chat and messaging state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  
  // Runtime error handling
  const [runtimeError, setRuntimeError] = useState<RuntimeError | null>(null);
  
  // Get code generation functions
  const { handlePromptSubmit, handleFixError, isGenerating } = CodeGenerator({
    setProjectFiles,
    setGeneratedCode,
    setActiveFile,
    setProjectName,
    setDetectedType,
    setActiveTab,
    setShowTemplateSelector,
    setErrorMessage,
    setChatMessages,
    setStreamingMessage,
    setCurrentMessageId,
    selectedTemplate,
    runtimeError
  });
  
  // Update file tree when project files change
  useEffect(() => {
    if (Object.keys(projectFiles).length > 0) {
      // Convert ProjectFiles format to format needed by buildFileTree
      const filesForTree: Record<string, string> = {};
      Object.entries(projectFiles).forEach(([path, { code }]) => {
        filesForTree[path] = code;
      });
      
      const tree = buildFileTree(filesForTree);
      setFileTree(tree);
      
      // If no active file is set, select the first one
      if (!activeFile && Object.keys(projectFiles).length > 0) {
        setActiveFile(Object.keys(projectFiles)[0]);
      }
    }
  }, [projectFiles, activeFile]);
  
  // Handle template selection
  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
  };
  
  // Reset template selection
  const handleResetSelection = () => {
    setSelectedTemplate(null);
    setShowTemplateSelector(true);
  };
  
  // Use template prompt
  const handleUseTemplatePrompt = () => {
    if (!selectedTemplate) return;
    
    const template = projectTemplates[selectedTemplate.type];
    const defaultPrompt = template?.defaultPrompt || `Create a ${selectedTemplate.displayName} website`;
    
    // Execute the default prompt
    handlePromptSubmit(defaultPrompt);
  };
  
  // Handle file selection in file explorer
  const handleFileSelect = (path: string) => {
    setActiveFile(path);
  };
  
  // Handle code changes in editor
  const handleCodeChange = (files: ProjectFiles) => {
    setProjectFiles(files);
    setGeneratedCode(JSON.stringify(files, null, 2));
    setShowSaveButton(true);
  };
  
  // Handle save code
  const handleSaveCode = () => {
    toast.success("Project saved successfully");
    setShowSaveButton(false);
  };
  
  // Handle runtime error detection
  const handleRuntimeError = (error: RuntimeError | null) => {
    setRuntimeError(error);
  };
  
  // Handle error fixing
  const handleFixRuntimeError = () => {
    handleFixError();
  };
  
  // Handle error ignoring
  const handleIgnoreError = () => {
    setRuntimeError(null);
  };
  
  // Handle file upload
  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      // In a real implementation, this would upload the file to storage
      // For now, we'll just return a placeholder URL
      const placeholderUrl = `uploaded-${file.name}`;
      
      toast.success(`Uploaded ${file.name}`);
      return placeholderUrl;
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload file");
      throw error;
    }
  };
  
  // Handle report error
  const handleReportError = (error: Error) => {
    console.error("Reported error:", error);
    setErrorMessage(error.message);
    
    // Add error to chat
    const errorMessageId = uuidv4();
    setChatMessages(prev => [...prev, {
      id: errorMessageId,
      role: 'assistant',
      content: `Error: ${error.message}`,
      createdAt: new Date(),
    }]);
  };
  
  // Handle snapshot (for undo/redo)
  const handleSnapshot = () => {
    toast.success("Project snapshot created");
  };
  
  // Handle revert
  const handleRevert = () => {
    toast.success("Project reverted to previous snapshot");
  };
  
  return (
    <div className="flex h-full flex-col">
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* ChatMessages will be here in a real implementation */}
        
        {/* Preview/Code panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {Object.keys(projectFiles).length === 0 ? (
            <EmptyStateView onTemplateSelect={handleTemplateSelect} />
          ) : (
            <div className="flex h-full">
              {/* Only show file explorer when in code tab */}
              {activeTab === 'code' && (
                <div className="w-64 border-r border-border">
                  <FileExplorer 
                    files={fileTree} 
                    activeFile={activeFile}
                    onFileSelect={handleFileSelect}
                  />
                </div>
              )}
              
              {/* Code preview area */}
              <div className="flex-1 p-4 overflow-hidden">
                <CodePreview 
                  projectFiles={projectFiles}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  activeFile={activeFile || ''}
                  viewportSize={viewportSize}
                  setViewportSize={setViewportSize}
                  detectedType={detectedType}
                  onCodeChange={handleCodeChange}
                  onCopy={() => toast.success("Code copied to clipboard")}
                  onDownload={() => toast.success("Project downloaded")}
                  onReset={() => setProjectFiles({})}
                  onSave={handleSaveCode}
                  onOpenInNewTab={() => window.open('about:blank', '_blank')}
                  terminalOutput={terminalOutput}
                  onDetectError={handleRuntimeError}
                  runtimeError={runtimeError}
                  onFixError={handleFixRuntimeError}
                  onIgnoreError={handleIgnoreError}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input area */}
      <div className="border-t border-border">
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
          onSaveCode={handleSaveCode}
          showSaveButton={showSaveButton}
          onReportError={handleReportError}
          onSnapshot={handleSnapshot}
          onRevert={handleRevert}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
}
