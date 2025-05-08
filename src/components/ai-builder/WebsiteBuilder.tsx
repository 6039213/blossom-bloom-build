
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AIPromptInput from '@/components/shared/AIPromptInput';
import { extractFilesFromResponse, generateCode } from '@/lib/services/claudeService';
import WebsitePreview from './WebsitePreview';
import CodeEditor from './CodeEditor';

interface WebsiteFile {
  path: string;
  content: string;
}

export default function WebsiteBuilder() {
  const [activeTab, setActiveTab] = useState('prompt');
  const [isGenerating, setIsGenerating] = useState(false);
  const [responseContent, setResponseContent] = useState('');
  const [files, setFiles] = useState<WebsiteFile[]>([]);
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const handlePromptSubmit = async (prompt: string) => {
    setIsGenerating(true);
    setResponseContent('');
    
    try {
      // Stream response from Claude
      const response = await generateCode(
        prompt, 
        files, 
        (streamedText) => {
          setResponseContent(streamedText);
        },
        {
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      );
      
      // Extract files from the response
      const extractedFiles = extractFilesFromResponse(response);
      
      if (extractedFiles.length > 0) {
        setFiles(extractedFiles);
        setActiveFile(extractedFiles[0]?.path || null);
        setActiveTab('preview');
        toast.success(`Generated ${extractedFiles.length} files for your website`);
      } else {
        toast.error('No files were generated. Please try a more specific prompt.');
      }
    } catch (error) {
      console.error('Error generating website:', error);
      toast.error(`Failed to generate website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (filePath: string, newContent: string) => {
    setFiles(prev => 
      prev.map(file => 
        file.path === filePath ? { ...file, content: newContent } : file
      )
    );
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left panel: Prompt input and response */}
      <Card className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full grid grid-cols-2 p-1">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt" className="flex-1 flex flex-col p-4 m-0">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Claude AI Website Builder</h2>
              <p className="text-sm text-muted-foreground">
                Describe the website you want to build with Claude 3.7 Sonnet
              </p>
            </div>
            
            <AIPromptInput
              onSubmit={handlePromptSubmit}
              isProcessing={isGenerating}
            />
          </TabsContent>
          
          <TabsContent value="response" className="flex-1 p-4 m-0 overflow-auto">
            <div className="font-mono text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-md border">
              {responseContent || "Claude's response will appear here..."}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Right panel: Preview and code */}
      <Card className="lg:col-span-2 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <Tabs defaultValue="preview" className="flex-1 flex flex-col h-full">
          <TabsList className="w-full grid grid-cols-2 p-1">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="flex-1 p-4 m-0">
            <WebsitePreview 
              files={files} 
              viewportSize={viewportSize}
              onViewportChange={setViewportSize}
            />
          </TabsContent>
          
          <TabsContent value="code" className="flex-1 m-0">
            <CodeEditor 
              files={files}
              activeFile={activeFile}
              onFileSelect={setActiveFile}
              onFileChange={handleFileChange}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
