
import React from 'react';
import { SandpackProvider, SandpackLayout, SandpackPreview } from '@codesandbox/sandpack-react';
import CodePreviewTabs from '@/components/dashboard/CodePreviewTabs';
import { ProjectFiles } from '../dashboard/ai-builder/types';
import { getProjectDependencies } from '../dashboard/ai-builder/utils';
import { projectTemplates } from '@/utils/projectTemplates';

interface CodePreviewProps {
  projectFiles: ProjectFiles;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeFile: string;
  viewportSize: string;
  setViewportSize: (size: string) => void;
  detectedType: string | null;
  onCodeChange?: (files: ProjectFiles) => void;
}

export default function CodePreview({
  projectFiles,
  activeTab,
  setActiveTab,
  activeFile,
  viewportSize,
  setViewportSize,
  detectedType,
  onCodeChange
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
      <div className="flex items-center justify-between w-full mb-2">
        <CodePreviewTabs 
          activeTab={activeTab}
          viewportSize={viewportSize}
          onTabChange={setActiveTab}
          onViewportChange={setViewportSize}
        />
      </div>
      
      <div className="flex-1 overflow-hidden border border-border rounded-lg">
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
    </div>
  );
}
