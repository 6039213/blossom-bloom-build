
import React from 'react';
import { File, Folder } from 'lucide-react';

interface FileTreeProps {
  files: string[];
  activeFile: string | null;
  onFileClick: (fileName: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({ files, activeFile, onFileClick }) => {
  // Group files by directories
  const fileStructure: { [key: string]: string[] } = {
    '/': []
  };

  files.forEach(file => {
    if (file.includes('/')) {
      const parts = file.split('/');
      const directory = parts.slice(0, -1).join('/');
      const fileName = parts[parts.length - 1];
      
      if (!fileStructure[directory]) {
        fileStructure[directory] = [];
      }
      fileStructure[directory].push(fileName);
    } else {
      fileStructure['/'].push(file);
    }
  });

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx') || fileName.endsWith('.ts') || fileName.endsWith('.js')) {
      return <File className="h-4 w-4 text-blossom-500" />;
    } else if (fileName.endsWith('.css') || fileName.endsWith('.scss')) {
      return <File className="h-4 w-4 text-blue-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-2">
      <h3 className="text-sm font-semibold mb-2">Project Files</h3>
      <div className="space-y-1">
        {Object.keys(fileStructure).map(directory => (
          <div key={directory}>
            {directory !== '/' && (
              <div className="flex items-center space-x-1 pl-2 py-1">
                <Folder className="h-4 w-4 text-blossom-500" />
                <span className="text-sm">{directory}</span>
              </div>
            )}
            <div className={directory !== '/' ? 'pl-4' : ''}>
              {fileStructure[directory].map(file => (
                <button
                  key={`${directory === '/' ? '' : directory + '/'}${file}`}
                  className={`flex items-center space-x-2 w-full text-left py-1 px-2 rounded ${
                    activeFile === `${directory === '/' ? '' : directory + '/'}${file}`
                      ? 'bg-blossom-100'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => onFileClick(`${directory === '/' ? '' : directory + '/'}${file}`)}
                >
                  {getFileIcon(file)}
                  <span className="text-sm truncate">{file}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
