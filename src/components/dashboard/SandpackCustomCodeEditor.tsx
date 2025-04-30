
import { useEffect } from 'react';
import { 
  SandpackCodeEditor, 
  FileTabs, 
  useSandpack,
} from '@codesandbox/sandpack-react';

interface ProjectFile {
  code: string;
}

interface ProjectFiles {
  [filePath: string]: ProjectFile;
}

interface CustomCodeEditorProps {
  onCodeChange: (files: ProjectFiles) => void;
}

export default function SandpackCustomCodeEditor({ onCodeChange }: CustomCodeEditorProps) {
  const { sandpack } = useSandpack();
  
  useEffect(() => {
    // Check if clients property exists and is an array with at least one client
    if (!sandpack.clients || !Array.isArray(sandpack.clients) || sandpack.clients.length === 0) return;
    
    // Access the first client
    const client = sandpack.clients[0];
    
    const unsubscribe = client.listen((message: any) => {
      if (message.type === "fs/update") {
        const currentFiles = Object.entries(sandpack.files).reduce((acc, [path, file]) => {
          return {
            ...acc,
            [path]: { code: file.code || '' }
          };
        }, {} as ProjectFiles);
        
        onCodeChange(currentFiles);
      }
    });
    
    // Force initial render of code
    setTimeout(() => {
      const currentFiles = Object.entries(sandpack.files).reduce((acc, [path, file]) => {
        return {
          ...acc,
          [path]: { code: file.code || '' }
        };
      }, {} as ProjectFiles);
      
      onCodeChange(currentFiles);
    }, 500);
    
    return () => {
      unsubscribe();
    };
  }, [sandpack, onCodeChange]);
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FileTabs />
      <div className="flex-1 overflow-auto">
        <SandpackCodeEditor 
          showLineNumbers={true}
          showTabs={false}
          readOnly={false}
          wrapContent
          className="h-full"
          style={{ height: '100%', minHeight: '300px' }}
        />
      </div>
    </div>
  );
}
