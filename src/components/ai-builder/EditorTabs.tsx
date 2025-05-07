
import React from 'react';
import { X } from 'lucide-react';

interface EditorTabsProps {
  openFiles: string[];
  activeFile: string | null;
  onSelectTab: (path: string) => void;
  onCloseTab: (path: string) => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({
  openFiles,
  activeFile,
  onSelectTab,
  onCloseTab
}) => {
  if (openFiles.length === 0) {
    return (
      <div className="bg-gray-800 p-2 text-sm text-gray-400 border-b border-gray-700">
        No files open
      </div>
    );
  }

  // Get filename from path
  const getFileName = (path: string) => {
    return path.split('/').pop() || path;
  };

  // Get icon for file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return <span className="text-yellow-300 mr-1">JS</span>;
      case 'ts':
      case 'tsx':
        return <span className="text-blue-400 mr-1">TS</span>;
      case 'css':
        return <span className="text-purple-400 mr-1">CSS</span>;
      case 'html':
        return <span className="text-orange-400 mr-1">HTML</span>;
      case 'json':
        return <span className="text-green-300 mr-1">JSON</span>;
      case 'md':
        return <span className="text-gray-300 mr-1">MD</span>;
      default:
        return <span className="text-gray-400 mr-1">•</span>;
    }
  };

  return (
    <div className="flex overflow-x-auto bg-gray-800 border-b border-gray-700">
      {openFiles.map(file => (
        <div
          key={file}
          className={`
            flex items-center px-3 py-2 text-sm border-r border-gray-700 cursor-pointer group
            ${activeFile === file ? 'bg-gray-900 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
          `}
          onClick={() => onSelectTab(file)}
        >
          {getFileIcon(file)}
          <span className="truncate max-w-xs">{getFileName(file)}</span>
          <button
            className="ml-2 opacity-0 group-hover:opacity-100 hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(file);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;
