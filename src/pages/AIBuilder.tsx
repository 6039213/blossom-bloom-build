
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AIResponseDisplay, { ChatMessage } from '@/components/dashboard/AIResponseDisplay';
import { useProjectStore, ProjectStatus } from '@/stores/projectStore';
import { useAuth } from '@/contexts/AuthContext';
import { createDefaultFilesForTemplate, projectTemplates, ProjectTemplate } from '@/utils/projectTemplates';
import { 
  CodeGenerator, 
  CodePreview, 
  EmptyStateView, 
  ProjectInput
} from './ai-builder';
import { ProjectFiles } from '@/components/dashboard/ai-builder/types';
import { findMainFile } from '@/components/dashboard/ai-builder/utils';

export default function AIBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>({});
  const [activeTab, setActiveTab] = useState('preview');
  const [projectName, setProjectName] = useState('');
  const [activeFile, setActiveFile] = useState('/src/App.tsx');
  const [viewportSize, setViewportSize] = useState('desktop');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { createProject } = useProjectStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const { handlePromptSubmit } = CodeGenerator({
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
    selectedTemplate
  });
  
  const handleTemplateSelect = (template: ProjectTemplate) => {
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
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard");
  };
  
  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded successfully");
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

  const handleCodeChange = (updatedFiles: ProjectFiles) => {
    setProjectFiles(updatedFiles);
    setGeneratedCode(JSON.stringify(updatedFiles, null, 2));
  };

  const handleOpenInNewTab = () => {
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
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
