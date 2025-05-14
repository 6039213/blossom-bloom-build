
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Sparkles, Send } from 'lucide-react';
import LivePreview from './LivePreview';
import { FileContent } from '@/lib/services/claudeService';
import { generateCode, extractFilesFromResponse } from '@/lib/services/claudeService';

const UnifiedAIBuilder = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState<FileContent[]>([]);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [currentTab, setCurrentTab] = useState('preview');

  // Handle code generation
  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description of what you want to build");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast.info("Generating website with Claude 3.7 Sonnet...");
      
      // Call Claude API and handle streaming response
      const response = await generateCode(
        prompt,
        [],
        (text) => {
          // This is the streaming callback if needed
          console.log("Streaming update:", text.length > 100 ? text.substring(0, 100) + "..." : text);
        }
      );
      
      // Process the response to extract files
      const extractedFiles = extractFilesFromResponse(response);
      
      if (extractedFiles.length === 0) {
        throw new Error("No valid code files could be extracted from Claude's response");
      }
      
      setFiles(extractedFiles);
      toast.success(`Generated ${extractedFiles.length} files successfully!`);
      setCurrentTab('preview'); // Switch to preview tab
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Sample prompts for quick selection
  const samplePrompts = [
    "Create a landing page for a coffee shop with a hero section and menu",
    "Build a simple todo list app with React",
    "Generate a responsive portfolio website with projects section",
    "Design a product showcase page with image gallery"
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 bg-background">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-bold">AI Website Builder</h2>
        </div>
        
        <div className="relative mb-4">
          <Textarea
            placeholder="Describe the website you want to build..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24 p-4 resize-none" 
            disabled={isGenerating}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button 
            onClick={handleGenerateCode}
            disabled={isGenerating || !prompt.trim()}
            className="flex-1 sm:flex-none"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generate Website
              </>
            )}
          </Button>
          
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sample, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(sample)}
                className="text-xs truncate max-w-40"
              >
                {sample.length > 25 ? sample.substring(0, 25) + "..." : sample}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="preview" className="h-full m-0">
              <LivePreview 
                files={files}
                viewportSize={viewportSize}
                onViewportChange={setViewportSize}
              />
            </TabsContent>
            
            <TabsContent value="code" className="h-full m-0 p-4">
              <div className="h-full overflow-auto">
                {files.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="border rounded-md overflow-hidden">
                        <div className="bg-muted px-3 py-2 text-sm font-medium border-b">
                          {file.path}
                        </div>
                        <pre className="p-4 overflow-auto text-xs bg-muted/30 max-h-96">
                          <code>{file.content}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p>No code generated yet. Enter a prompt to generate website code.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedAIBuilder;
