
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import LivePreview from './LivePreview';
import CodePane from './CodePane';
import ChatInterface from './ChatInterface';
import FileExplorer from './FileExplorer';
import EditorTabs from './EditorTabs';
import { FileContent, generateCode, extractFilesFromResponse } from '@/lib/services/claudeService';

export default function UnifiedAIBuilder() {
  const [activeTab, setActiveTab] = useState('preview');
  const [files, setFiles] = useState<FileContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  
  // Handle file generation from AI chat
  const handleGenerateFiles = async (prompt: string, existingFiles: FileContent[] = []) => {
    setIsGenerating(true);
    
    try {
      const response = await generateCode(prompt, existingFiles, undefined, {
        system: "You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS."
      });
      
      const newFiles = extractFilesFromResponse(response);
      
      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles]);
        toast.success(`Generated ${newFiles.length} files successfully`);
      } else {
        toast.warning("No files were generated from the response");
      }
      
    } catch (error) {
      console.error('Error generating files:', error);
      toast.error(`Failed to generate files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Layout is now modified to have chat on the left and preview/code on the right
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Chat interface on the left */}
      <div className="w-full lg:w-1/3 flex flex-col">
        <ChatInterface 
          onSendPrompt={handleGenerateFiles}
          isLoading={isGenerating}
        />
      </div>
      
      {/* Preview and code on the right */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center border-b">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            
            {activeTab === 'preview' && (
              <div className="flex gap-2 pr-2">
                <button 
                  onClick={() => setViewportSize('mobile')}
                  className={`px-2 py-1 rounded ${viewportSize === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  Mobile
                </button>
                <button 
                  onClick={() => setViewportSize('tablet')}
                  className={`px-2 py-1 rounded ${viewportSize === 'tablet' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  Tablet
                </button>
                <button 
                  onClick={() => setViewportSize('desktop')}
                  className={`px-2 py-1 rounded ${viewportSize === 'desktop' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  Desktop
                </button>
              </div>
            )}
          </div>
          
          <TabsContent value="preview" className="flex-1 p-0">
            <LivePreview 
              files={files} 
              viewportSize={viewportSize} 
            />
          </TabsContent>
          
          <TabsContent value="code" className="flex-1 p-0">
            <CodePane 
              files={files} 
              currentFile={currentFile}
              onFileChange={setCurrentFile}
            />
          </TabsContent>
          
          <TabsContent value="files" className="flex-1 p-0">
            <FileExplorer 
              files={files} 
              onFileSelect={setCurrentFile}
              currentFile={currentFile}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
