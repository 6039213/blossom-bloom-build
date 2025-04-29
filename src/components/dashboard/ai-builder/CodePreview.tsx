
import React from 'react';
import { SandpackProvider, SandpackLayout, SandpackPreview } from '@codesandbox/sandpack-react';
import CodePreviewTabs from '@/components/dashboard/CodePreviewTabs';
import CodeActionButtons from '@/components/dashboard/CodeActionButtons';
import SandpackCustomCodeEditor from '@/components/dashboard/SandpackCustomCodeEditor';
import { ProjectFiles } from './types';
import { getProjectDependencies } from './utils';
import { projectTemplates } from '@/utils/projectTemplates';

interface CodePreviewProps {
  projectFiles: ProjectFiles;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeFile: string;
  viewportSize: string;
  setViewportSize: (size: string) => void;
  detectedType: string | null;
  onCodeChange: (files: ProjectFiles) => void;
  onCopy: () => void;
  onDownload: () => void;
  onReset: () => void;
  onSave: () => void;
  onOpenInNewTab: () => void;
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
  onOpenInNewTab
}: CodePreviewProps) {
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

  return (
    <div className="w-full h-full mx-auto flex flex-col">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
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
                  }}
                >
                  <SandpackLayout className="h-full">
                    <SandpackPreview
                      showRefreshButton
                      className="flex-grow h-full"
                    />
                  </SandpackLayout>
                </SandpackProvider>
              )}
            </div>
          </TabsContent>
          <TabsContent value="code" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden">
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
                <SandpackCustomCodeEditor onCodeChange={onCodeChange} />
              </SandpackLayout>
            </SandpackProvider>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Import non-type dependencies
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SandpackFileExplorer } from '@codesandbox/sandpack-react';
