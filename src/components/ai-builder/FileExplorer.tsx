
import React from 'react';
import { Folder, FileText, Code, Image, File } from 'lucide-react';

interface FileExplorerProps {
  files: Array<{path: string; content: string; type: string}>;
  activeFile: string | null;
  onFileSelect: (filePath: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, activeFile, onFileSelect }) => {
  const getFileIcon = (filePath: string) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      return <Code className="h-4 w-4 mr-2 text-blue-500" />;
    }
    if (filePath.endsWith('.css') || filePath.endsWith('.scss')) {
      return <FileText className="h-4 w-4 mr-2 text-pink-500" />;
    }
    if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.svg')) {
      return <Image className="h-4 w-4 mr-2 text-green-500" />;
    }
    if (filePath.endsWith('.html')) {
      return <FileText className="h-4 w-4 mr-2 text-orange-500" />;
    }
    return <File className="h-4 w-4 mr-2 text-gray-500" />;
  };

  // Group files by directories
  const groupedFiles: Record<string, Array<{path: string; content: string; type: string}>> = {};
  
  files.forEach(file => {
    const parts = file.path.split('/');
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '/';
    
    if (!groupedFiles[dir]) {
      groupedFiles[dir] = [];
    }
    
    groupedFiles[dir].push(file);
  });

  // Sort directories and files
  const sortedDirs = Object.keys(groupedFiles).sort();

  if (files.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No files generated yet
      </div>
    );
  }

  return (
    <div className="text-sm">
      {sortedDirs.map(dir => (
        <div key={dir} className="mb-2">
          {dir !== '/' && (
            <div className="flex items-center py-1 px-2 text-gray-600 dark:text-gray-300 font-medium">
              <Folder className="h-4 w-4 mr-2 text-amber-500" />
              {dir}
            </div>
          )}
          <div className="ml-2">
            {groupedFiles[dir].sort((a, b) => a.path.localeCompare(b.path)).map(file => {
              const fileName = file.path.split('/').pop() || '';
              
              return (
                <div
                  key={file.path}
                  className={`flex items-center py-1 px-2 rounded-md cursor-pointer ${
                    activeFile === file.path 
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => onFileSelect(file.path)}
                >
                  {getFileIcon(file.path)}
                  <span className="truncate">{fileName}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileExplorer;
