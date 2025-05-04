
import React, { useEffect, useState } from 'react';
import { SandpackProvider, SandpackLayout, SandpackPreview, SandpackConsole, SandpackFileExplorer } from '@codesandbox/sandpack-react';
import CodePreviewTabs from '@/components/dashboard/CodePreviewTabs';
import CodeActionButtons from '@/components/dashboard/CodeActionButtons';
import SandpackCustomCodeEditor from '@/components/dashboard/SandpackCustomCodeEditor';
import { ProjectFiles } from './types';
import { getProjectDependencies } from './utils';
import { projectTemplates } from '@/utils/projectTemplates';
import ErrorDetectionHandler from './ErrorDetectionHandler';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

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
  const [loading, setLoading] = useState(true);
  
  // Check if active file is JSX/TSX to enable specific tooling
  useEffect(() => {
    if (activeFile) {
      setIsJsxFile(activeFile.endsWith('.jsx') || activeFile.endsWith('.tsx'));
    }
  }, [activeFile]);
  
  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
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
    
    console.log("Preview error detected:", errorInfo);
    setError(errorInfo);
    if (onDetectError) onDetectError(errorInfo);
  };

  return (
    <div className="w-full h-full mx-auto flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between w-full mb-4">
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
              {Object.keys(projectFiles).length > 0 ? (
                <SandpackProvider
                  template="react-ts"
                  theme="auto"
                  files={projectFiles}
                  customSetup={{
                    dependencies: getProjectDependencies(projectFiles, detectedType, projectTemplates),
                  }}
                  options={{
                    visibleFiles: [activeFile],
                    externalResources: ["https://cdn.tailwindcss.com"]
                  }}
                >
                  {error && (
                    <motion.div 
                      className="px-4 py-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    >
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
                    </motion.div>
                  )}
                  <SandpackLayout className="h-full">
                    <SandpackPreview
                      showRefreshButton
                      className="flex-grow h-full"
                      showOpenInCodeSandbox={false}
                      showSandpackErrorOverlay={false}
                      onError={handleSandpackError}
                      actionsChildren={
                        <div className="flex items-center">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Claude 3.7 Sonnet Generated
                          </span>
                        </div>
                      }
                    />
                  </SandpackLayout>
                </SandpackProvider>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-2xl">✨</span>
                  </motion.div>
                  <motion.h2 
                    className="text-xl font-semibold mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome to AI Website Builder
                  </motion.h2>
                  <motion.p 
                    className="text-gray-500 max-w-md mx-auto"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Describe what you want to build in the text input on the left side, and Claude 3.7 Sonnet will generate a complete website for you.
                  </motion.p>
                </motion.div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden">
            {Object.keys(projectFiles).length > 0 ? (
              <SandpackProvider
                template="react-ts"
                theme="dark"
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
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No code generated yet</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
