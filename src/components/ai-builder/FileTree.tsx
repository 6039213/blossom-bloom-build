
import React from 'react';
import { FileContent } from '@/lib/services/claudeService';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  files: FileContent[];
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

const sortFiles = (files: FileContent[]) => {
  return [...files].sort((a, b) => {
    // Put root files at top
    const aDepth = a.path.split('/').length;
    const bDepth = b.path.split('/').length;
    
    if (aDepth !== bDepth) {
      return aDepth - bDepth;
    }
    
    // Put package.json at the top of each directory
    if (a.path.endsWith('package.json')) return -1;
    if (b.path.endsWith('package.json')) return 1;
    
    // Then README
    if (a.path.endsWith('README.md')) return -1;
    if (b.path.endsWith('README.md')) return 1;
    
    // Then index files
    if (a.path.includes('index.') && !b.path.includes('index.')) return -1;
    if (b.path.includes('index.') && !a.path.includes('index.')) return 1;
    
    // Then alphabetically
    return a.path.localeCompare(b.path);
  });
};

interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children: FileTreeNode[];
}

const buildFileTree = (files: FileContent[]) => {
  const root: FileTreeNode = { name: '', path: '', type: 'directory', children: [] };
  
  for (const file of files) {
    const pathParts = file.path.split('/');
    let currentNode = root;
    
    // Process directory parts
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      let found = currentNode.children.find(child => child.name === part && child.type === 'directory');
      
      if (!found) {
        const newNode: FileTreeNode = {
          name: part,
          path: pathParts.slice(0, i + 1).join('/'),
          type: 'directory',
          children: [],
        };
        currentNode.children.push(newNode);
        found = newNode;
      }
      
      currentNode = found;
    }
    
    // Add file
    const fileName = pathParts[pathParts.length - 1];
    currentNode.children.push({
      name: fileName,
      path: file.path,
      type: 'file',
      children: [],
    });
  }
  
  // Sort each directory's children
  const sortTreeNodes = (node: FileTreeNode) => {
    node.children.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
    for (const child of node.children) {
      if (child.type === 'directory') {
        sortTreeNodes(child);
      }
    }
  };
  
  sortTreeNodes(root);
  return root;
};

interface TreeNodeProps {
  node: FileTreeNode;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, activeFile, onFileSelect }) => {
  const [expanded, setExpanded] = React.useState(true);
  
  // Skip rendering the root node itself
  if (node.name === '') {
    return (
      <ul className="space-y-1 mt-1">
        {node.children.map((child) => (
          <TreeNode
            key={child.path}
            node={child}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
          />
        ))}
      </ul>
    );
  }

  const handleToggle = () => {
    if (node.type === 'directory') {
      setExpanded(!expanded);
    }
  };

  const handleClick = () => {
    if (node.type === 'file') {
      onFileSelect(node.path);
    } else {
      handleToggle();
    }
  };

  const isActive = activeFile === node.path;
  
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
        return <span className="text-gray-400 mr-1">FILE</span>;
    }
  };

  return (
    <li>
      <div
        className={cn(
          "flex items-center py-1 px-2 cursor-pointer hover:bg-gray-700 rounded",
          isActive && "bg-gray-700 font-medium"
        )}
        onClick={handleClick}
      >
        {node.type === 'directory' ? (
          <>
            <span className="mr-1">{expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</span>
            <Folder className="h-4 w-4 mr-2 text-blue-300" />
            <span>{node.name}</span>
          </>
        ) : (
          <>
            <span className="ml-5"></span>
            <File className="h-4 w-4 mr-2 text-gray-300" />
            {getFileIcon(node.name)}
            <span>{node.name}</span>
          </>
        )}
      </div>
      
      {node.type === 'directory' && expanded && node.children.length > 0 && (
        <ul className="pl-4 space-y-1 mt-1 border-l border-gray-700">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const FileTree: React.FC<FileTreeProps> = ({ files, activeFile, onFileSelect }) => {
  const sortedFiles = sortFiles(files);
  const fileTree = buildFileTree(sortedFiles);

  return (
    <div className="h-full overflow-auto bg-gray-900 p-2 text-sm">
      <div className="font-medium text-gray-300 mb-2 flex items-center">
        <Folder className="h-4 w-4 mr-2" />
        Project Files
      </div>
      <TreeNode node={fileTree} activeFile={activeFile} onFileSelect={onFileSelect} />
    </div>
  );
};

export default FileTree;
