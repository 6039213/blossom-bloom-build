
import React, { useEffect, useState } from 'react';
import { SandpackProvider, SandpackLayout, SandpackPreview, SandpackConsole, SandpackFileExplorer } from '@codesandbox/sandpack-react';
import CodePreviewTabs from '@/components/dashboard/CodePreviewTabs';
import CodeActionButtons from '@/components/dashboard/CodeActionButtons';
import SandpackCustomCodeEditor from '@/components/dashboard/SandpackCustomCodeEditor';
import { ProjectFiles } from './types';
import { getProjectDependencies } from './utils';
import { projectTemplates } from '@/utils/projectTemplates';
import ErrorDetectionHandler from './ErrorDetectionHandler';

// Import non-type dependencies
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface CodePreviewProps {
  projectFiles: ProjectFiles;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeFile: string;
  viewportSize: string;
  setViewportSize: (size: string) => void;
  detectedType: string | null;
  onCodeChange?: (files: ProjectFiles) => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  onOpenInNewTab?: () => void;
  terminalOutput?: string;
  onDetectError?: (error: { message: string; file?: string } | null) => void;
}

export default function CodePreview({
  projectFiles,
  activeTab,
  setActiveTab,
  activeFile,
  viewportSize,
  setViewportSize,
  detectedType,
  onCodeChange,
  onCopy,
  onDownload,
  onReset,
  onSave,
  onOpenInNewTab,
  terminalOutput,
  onDetectError
}: CodePreviewProps) {
  const [error, setError] = useState<{ message: string; file?: string } | null>(null);
  const [isJsxFile, setIsJsxFile] = useState(false);
  
  // Check if active file is JSX/TSX to enable specific tooling
  useEffect(() => {
    if (activeFile) {
      setIsJsxFile(activeFile.endsWith('.jsx') || activeFile.endsWith('.tsx'));
    }
  }, [activeFile]);
  
  // Get responsive viewport classes
  const getViewportClasses = () => {
    switch(viewportSize) {
      case 'mobile':
        return 'w-[320px] mx-auto border border-border rounded-lg shadow-lg';
      case 'tablet':
        return 'w-[768px] mx-auto border border-border rounded-lg shadow-lg';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  // Handle errors from Sandpack
  const handleSandpackError = (error: any) => {
    if (!error) {
      setError(null);
      if (onDetectError) onDetectError(null);
      return;
    }
    
    let errorInfo = {
      message: error.message || 'Unknown error',
      file: 'unknown file'
    };
    
    // Try to determine the file from the error message
    const fileMatch = error.message?.match(/(?:in|at) ([^:(\s]+)/) || 
                     error.message?.match(/([^\/\s]+\.(?:js|jsx|ts|tsx))/);
    if (fileMatch && fileMatch[1]) {
      errorInfo.file = fileMatch[1];
    }
    
    setError(errorInfo);
    if (onDetectError) onDetectError(errorInfo);
  };

  return (
    <div className="w-full h-full mx-auto flex flex-col">
      <Tabs 
        value={activeTab} 
        onValueChange={(val) => setActiveTab(val)} 
        className="w-full h-full flex flex-col"
      >
        <div className="flex items-center justify-between w-full mb-2">
          <CodePreviewTabs 
            activeTab={activeTab}
            viewportSize={viewportSize}
            onTabChange={setActiveTab}
            onViewportChange={setViewportSize}
          />
          
          <CodeActionButtons
            onCopy={onCopy}
            onDownload={onDownload}
            onReset={onReset}
            onSave={onSave}
            onOpenInNewTab={onOpenInNewTab}
            showExternalLink={activeTab === 'preview'}
            hasGeneratedCode={Object.keys(projectFiles).length > 0}
          />
        </div>
        
        <div className="flex-1 overflow-hidden border border-border rounded-lg">
          <TabsContent value="preview" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
            <div className={`h-full w-full overflow-auto transition-all duration-300 ${getViewportClasses()}`}>
              {Object.keys(projectFiles).length > 0 && (
                <SandpackProvider
                  template="react-ts"
                  theme="auto"
                  files={projectFiles}
                  customSetup={{
                    dependencies: getProjectDependencies(projectFiles, detectedType, projectTemplates),
                  }}
                  options={{
                    visibleFiles: [activeFile],
                    externalResources: [
                      "https://cdn.tailwindcss.com"
                    ]
                  }}
                >
                  {error && (
                    <div className="px-4 py-2">
                      <ErrorDetectionHandler 
                        error={error}
                        onFixError={() => {
                          if (onDetectError && error) onDetectError(error);
                        }}
                        onIgnoreError={() => {
                          setError(null);
                          if (onDetectError) onDetectError(null);
                        }}
                      />
                    </div>
                  )}
                  <SandpackLayout className="h-full">
                    <SandpackPreview
                      showRefreshButton
                      className="flex-grow h-full"
                      showOpenInCodeSandbox={false}
                      showSandpackErrorOverlay={false}
                      onError={handleSandpackError}
                    />
                  </SandpackLayout>
                </SandpackProvider>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden">
            {Object.keys(projectFiles).length > 0 && (
              <SandpackProvider
                template="react-ts"
                theme="auto"
                files={projectFiles}
                customSetup={{
                  dependencies: getProjectDependencies(projectFiles, detectedType, projectTemplates),
                }}
              >
                <SandpackLayout className="h-full">
                  <SandpackFileExplorer className="min-w-[180px]" />
                  <SandpackCustomCodeEditor onCodeChange={onCodeChange || (() => {})} />
                </SandpackLayout>
                <SandpackConsole className="h-40" />
              </SandpackProvider>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
