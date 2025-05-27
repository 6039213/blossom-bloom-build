
import React, { useState } from 'react';
import { FileContent } from '@/lib/services/anthropicService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface CodePaneProps {
  files: FileContent[];
  activeFile: string | null;
}

export default function CodePane({ files, activeFile }: CodePaneProps) {
  const [selectedFile, setSelectedFile] = useState<string>(activeFile || '');
  
  const currentFile = files.find(f => f.path === (selectedFile || activeFile));
  
  const handleCopyCode = () => {
    if (currentFile) {
      navigator.clipboard.writeText(currentFile.content);
      toast.success('Code copied to clipboard');
    }
  };

  const handleDownloadCode = () => {
    if (currentFile) {
      const blob = new Blob([currentFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFile.path.split('/').pop() || 'file.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('File downloaded');
    }
  };

  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>No files generated yet. Start by chatting with the AI!</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={selectedFile || activeFile || ''} onValueChange={setSelectedFile} className="flex-1 flex flex-col">
        <div className="border-b p-2 flex items-center justify-between">
          <TabsList className="flex-1 justify-start overflow-x-auto">
            {files.map((file) => (
              <TabsTrigger 
                key={file.path} 
                value={file.path}
                className="text-xs whitespace-nowrap"
              >
                {file.path.split('/').pop()}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {currentFile && (
            <div className="flex gap-2 ml-2">
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadCode}>
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          {files.map((file) => (
            <TabsContent key={file.path} value={file.path} className="h-full m-0">
              <div className="h-full bg-gray-900 text-gray-100 p-4 overflow-auto">
                <div className="mb-2 text-sm text-gray-400">
                  {file.path}
                </div>
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {file.content}
                </pre>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
