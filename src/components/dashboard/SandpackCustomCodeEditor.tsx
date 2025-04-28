
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
  
  // Update parent component when code changes
  useEffect(() => {
    // No sandpack.clients means no editor is ready yet
    if (!sandpack.clients || sandpack.clients.length === 0) return;
    
    // Use the first client to listen for changes
    const client = sandpack.clients[0];
    
    // Subscribe to file changes
    const unsubscribe = client.listen((message: any) => {
      // Check if the message is a file update by checking its type property
      if (message.type === "fs/update") {
        // Get the current files with their updated content
        const currentFiles = Object.entries(sandpack.files).reduce((acc, [path, file]) => {
          return {
            ...acc,
            [path]: { code: file.code || '' }
          };
        }, {} as ProjectFiles);
        
        onCodeChange(currentFiles);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [sandpack, onCodeChange]);
  
  return (
    <div className="flex flex-col h-full">
      <FileTabs />
      <SandpackCodeEditor 
        showLineNumbers={true}
        readOnly={false}
      />
    </div>
  );
}
