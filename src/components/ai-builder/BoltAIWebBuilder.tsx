
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Eye, Download, Copy, Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { anthropicProvider } from "@/lib/providers/anthropic";

// Sample prompts to help users get started
const samplePrompts = [
  "Create a modern landing page for a coffee shop with a gold and brown color scheme",
  "Build a photography portfolio website with a dark theme and image gallery",
  "Design a SaaS dashboard with analytics charts and user management",
  "Create a personal blog with featured posts and a newsletter signup"
];

export default function BoltAIWebBuilder() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [rawResponse, setRawResponse] = useState('');
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');
  const [activeFile, setActiveFile] = useState('');
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Effect to clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Process generated code to extract components and files
  useEffect(() => {
    if (rawResponse) {
      const extractedCode = extractCodeBlocks(rawResponse);
      setGeneratedCode(extractedCode);
      
      // Set first file as active if we have files and none is selected
      const fileKeys = Object.keys(extractedCode);
      if (fileKeys.length > 0 && !activeFile) {
        setActiveFile(fileKeys[0]);
      }
    }
  }, [rawResponse]);

  // Update iframe content with HTML when code changes
  useEffect(() => {
    if (iframeRef.current && Object.keys(generatedCode).length > 0) {
      updateIframeContent();
    }
  }, [generatedCode, viewportSize]);

  // Extract code blocks from AI response
  const extractCodeBlocks = (response: string) => {
    const codeBlocks: Record<string, string> = {};
    
    // Match code blocks with filename in the format ```jsx filename.jsx
    const codeBlockRegex = /```(?:jsx|js|tsx|javascript|html|css)?\s*(?:\/\/\s*)?([a-zA-Z0-9_\-./]+)?\n([\s\S]*?)```/g;
    
    let match;
    while ((match = codeBlockRegex.exec(response)) !== null) {
      let fileName = match[1] || `Component${Object.keys(codeBlocks).length + 1}.jsx`;
      // Clean up the filename if needed
      fileName = fileName.trim();
      if (!fileName.includes('.')) {
        fileName += '.jsx'; // Add default extension if none
      }
      
      codeBlocks[fileName] = match[2].trim();
    }
    
    return codeBlocks;
  };

  // Update iframe with generated code
  const updateIframeContent = () => {
    if (!iframeRef.current) return;
    
    try {
      // Find HTML file, or create one from components
      let htmlContent = '';
      
      if (generatedCode['index.html']) {
        htmlContent = generatedCode['index.html'];
      } else {
        // Create basic HTML wrapper with all JS embedded
        htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
    ${generatedCode['styles.css'] || ''}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // This is a simplified preview and doesn't support all React features
    ${Object.entries(generatedCode)
      .filter(([filename]) => filename.endsWith('.jsx') || filename.endsWith('.js') || filename.endsWith('.tsx'))
      .map(([_, code]) => code)
      .join('\n\n')}
      
    // Mount the App component to the root div
    ReactDOM.render(React.createElement(App), document.getElementById('root'));
  </script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</body>
</html>`;
      }
      
      // Write content to iframe
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    } catch (error) {
      console.error("Error updating preview:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a website description");
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    setRawResponse('');
    setGeneratedCode({});
    
    // Start progress simulation
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 2 + 1; // 1-3% increment
        const newProgress = prev + increment;
        return newProgress > 92 ? 92 : newProgress; // Cap at 92% until complete
      });
    }, 300);
    
    try {
      // Call the Anthropic API through our provider
      await anthropicProvider.generateStream(
        `Generate a complete React website based on this description: "${prompt}".
        Use functional components, React Hooks, and Tailwind CSS for styling.
        Include all necessary components, with each in a separate file.
        Format your response with code blocks that include the filename as a comment or in the format syntax.
        For example: \`\`\`jsx App.jsx\n// Component code\n\`\`\`
        Create at minimum: App.jsx, multiple component files, any necessary styling.
        Make sure components render properly when imported into the App component.`,
        (token) => {
          setRawResponse(prev => prev + token);
        },
        {
          system: "You are an expert React developer who creates beautiful, functional websites using React and Tailwind CSS. You organize your code well, creating a file for each component.",
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      );
      
      // Clean up interval and set to 100%
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      
      setProgress(100);
      toast.success("Website generated successfully!");
      setActiveTab('preview');
      
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      setIsGenerating(false);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (activeFile && generatedCode[activeFile]) {
      navigator.clipboard.writeText(generatedCode[activeFile]);
      toast.success(`Copied ${activeFile} to clipboard`);
    } else {
      // Copy all code
      const allCode = Object.entries(generatedCode)
        .map(([filename, code]) => `/* ${filename} */\n${code}`)
        .join('\n\n');
      
      navigator.clipboard.writeText(allCode);
      toast.success("Copied all code to clipboard");
    }
  };

  // Download code as a zip file
  const handleDownload = () => {
    // In a real app, you'd create a zip file with all the components
    toast.success("Download functionality would save all components as a zip file");
  };

  // Get appropriate class for viewport size
  const getPreviewContainerClass = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'max-w-[375px] h-[667px]';
      case 'tablet':
        return 'max-w-[768px] h-[1024px]';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 h-full">
      {/* Left panel - Prompt input */}
      <Card className="lg:col-span-2 flex flex-col overflow-hidden bg-white dark:bg-gray-900 border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className="font-semibold bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Website Builder
            </Badge>
            <span className="text-xs text-muted-foreground">Powered by Claude 3.7</span>
          </div>
          <h2 className="text-lg font-medium">Create your website</h2>
          <p className="text-sm text-muted-foreground">
            Describe the website you want to build with AI
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your website in detail... (e.g., 'Create a modern coffee shop website with online ordering')"
              className="min-h-[120px] resize-none focus-visible:ring-blue-500"
            />
            
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Website
                </>
              )}
            </Button>
          </form>

          {isGenerating && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span>Generating website...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Example prompts
            </h3>
            <div className="space-y-2">
              {samplePrompts.map((samplePrompt, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(samplePrompt)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors"
                >
                  {samplePrompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Right panel - Preview and code */}
      <Card className="lg:col-span-5 flex flex-col overflow-hidden bg-white dark:bg-gray-900 border rounded-lg shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b p-4 bg-muted/30">
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1.5">
                <Code className="h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'preview' && (
              <div className="flex items-center gap-2">
                <Button
                  variant={viewportSize === 'mobile' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewportSize('mobile')}
                  className="h-8 w-8"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewportSize === 'tablet' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewportSize('tablet')}
                  className="h-8 w-8"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewportSize === 'desktop' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewportSize('desktop')}
                  className="h-8 w-8"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={updateIframeContent}
                  className="h-8 w-8"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="preview" className="flex-1 p-4 m-0 overflow-hidden">
            <div className={`flex items-center justify-center mx-auto transition-all duration-300 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black rounded-lg border overflow-hidden h-full ${getPreviewContainerClass()}`}>
              {Object.keys(generatedCode).length > 0 ? (
                <iframe
                  ref={iframeRef}
                  title="Website Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <motion.div 
                  className="text-center p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Website Preview</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Enter your website description and click "Generate Website" to create your custom website with AI.
                  </p>
                </motion.div>
              )}
            </div>
          </TabsContent>
            
          <TabsContent value="code" className="flex-1 flex flex-col m-0 overflow-hidden">
            {Object.keys(generatedCode).length > 0 ? (
              <>
                <div className="border-b overflow-x-auto">
                  <div className="flex p-2">
                    {Object.keys(generatedCode).map((filename) => (
                      <button
                        key={filename}
                        onClick={() => setActiveFile(filename)}
                        className={`px-3 py-1.5 text-xs rounded-md mr-2 transition-colors ${
                          activeFile === filename
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {filename}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <pre className="p-4 text-sm font-mono bg-gray-900 text-gray-100 h-full overflow-auto">
                    {activeFile && generatedCode[activeFile]}
                  </pre>
                </div>

                <div className="border-t p-3 flex justify-between items-center bg-gray-800">
                  <div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                      className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      {activeFile ? `Copy ${activeFile}` : 'Copy All'}
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="text-xs ml-2 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download All
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {activeFile ? `${generatedCode[activeFile]?.length || 0} characters` : `${Object.keys(generatedCode).length} files`}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <Code className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-xl font-medium mb-2">No code generated yet</h3>
                  <p className="text-muted-foreground">
                    Generate a website to see the code. You'll be able to view and download all the components.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
