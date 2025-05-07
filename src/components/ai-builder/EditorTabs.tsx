
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFileLanguage } from './MonacoEditor';

interface EditorTabsProps {
  openFiles: string[];
  activeFile: string | null;
  onSelectTab: (filePath: string) => void;
  onCloseTab: (filePath: string) => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({
  openFiles,
  activeFile,
  onSelectTab,
  onCloseTab
}) => {
  // Get icon based on file extension
  const getFileIcon = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return <span className="text-yellow-500">js</span>;
      case 'ts':
      case 'tsx':
        return <span className="text-blue-500">ts</span>;
      case 'css':
        return <span className="text-purple-500">css</span>;
      case 'json':
        return <span className="text-green-500">{ }</span>;
      case 'html':
        return <span className="text-orange-500">html</span>;
      case 'md':
        return <span className="text-gray-500">md</span>;
      default:
        return <span className="text-gray-500">txt</span>;
    }
  };
  
  // Handle tab close button click
  const handleTabClose = (e: React.MouseEvent, filePath: string) => {
    e.stopPropagation();
    onCloseTab(filePath);
  };

  return (
    <div className="bg-gray-900 border-b border-gray-700 overflow-x-auto">
      <div className="flex">
        {openFiles.map((filePath) => {
          const isActive = filePath === activeFile;
          const fileName = filePath.split('/').pop() || '';
          
          return (
            <div
              key={filePath}
              className={cn(
                "flex items-center px-3 py-2 border-r border-gray-700 min-w-0 cursor-pointer group",
                isActive ? "bg-gray-800 text-white" : "bg-gray-900 text-gray-400 hover:bg-gray-800"
              )}
              onClick={() => onSelectTab(filePath)}
            >
              <div className="mr-1 text-xs">
                {getFileIcon(filePath)}
              </div>
              <span className="truncate max-w-[120px] text-sm">
                {fileName}
              </span>
              <button
                onClick={(e) => handleTabClose(e, filePath)}
                className={cn(
                  "ml-2 text-gray-500 hover:text-white rounded opacity-60 hover:opacity-100",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                )}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditorTabs;
