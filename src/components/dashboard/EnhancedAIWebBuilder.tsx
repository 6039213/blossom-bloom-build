
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Smartphone, Tablet, Monitor, Copy, Download, RefreshCw, Code, Eye, Play, Save } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { anthropicProvider } from "@/lib/providers/anthropic";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100
    }
  }
};

// Sample prompts
const samplePrompts = [
  "Create a modern landing page for a coffee shop with a gold and brown color scheme",
  "Build a photography portfolio website with a dark theme and image gallery",
  "Design a SaaS dashboard with analytics charts and user management",
  "Create a personal blog with featured posts and a newsletter signup"
];

export default function EnhancedAIWebBuilder() {
  const [activeTab, setActiveTab] = useState('prompt');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [generatedCode, setGeneratedCode] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Handle viewport change for responsive preview
  const handleViewportChange = (size) => {
    setViewportSize(size);
  };

  // Handle prompt submission
  const handleSubmitPrompt = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a website description");
      return;
    }
    
    // Start generation process
    setIsGenerating(true);
    setGenerationProgress(0);
    setResponseContent('');
    setGeneratedCode('');
    
    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Call Claude API via provider
      await anthropicProvider.generateStream(
        `Generate a complete React website based on this description: "${prompt}". 
         Use Tailwind CSS for styling. Create functional components with hooks.
         Format your response as JSX code blocks for each component.`,
        (token) => {
          setResponseContent(prev => prev + token);
          
          // Extract code blocks when they appear
          const codeBlockRegex = /```(?:jsx|tsx|js|javascript)([\s\S]*?)```/g;
          const matches = [...responseContent.matchAll(codeBlockRegex)];
          
          if (matches.length > 0) {
            const extractedCode = matches.map(match => match[1].trim()).join('\n\n');
            setGeneratedCode(extractedCode);
          }
        },
        {
          system: "You are an expert React developer who creates beautiful, functional websites using modern React and Tailwind CSS.",
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      );
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      toast.success("Website generated successfully!");
      setActiveTab('preview');
      
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle sample prompt selection
  const handleSelectSample = (samplePrompt) => {
    setPrompt(samplePrompt);
  };

  // Handle code copy to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard");
  };

  // Handle code download
  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-website.jsx';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Code downloaded successfully");
  };

  // Viewport styling based on selected size
  const getPreviewStyle = () => {
    switch (viewportSize) {
      case 'mobile':
        return { maxWidth: '375px', height: '667px' };
      case 'tablet':
        return { maxWidth: '768px', height: '1024px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left panel: Builder Interface */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-border overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>Prompt</span>
            </TabsTrigger>
            <TabsTrigger value="response" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Response</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="prompt" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="font-semibold bg-blue-100 text-blue-700 border-blue-300">
                AI Website Builder
              </Badge>
              <span className="text-xs opacity-70">Powered by Claude 3.7 Sonnet</span>
            </div>
            <h2 className="text-lg font-semibold">Create your website</h2>
            <p className="text-sm text-muted-foreground">
              Describe the website you want to build with AI
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <form onSubmit={handleSubmitPrompt} className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your website in detail... (e.g., 'Create a modern coffee shop website with online ordering')"
                className="min-h-32 focus:border-blue-500"
              />
              
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Website...
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
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span>Generating website...</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
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
                    onClick={() => handleSelectSample(samplePrompt)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors"
                  >
                    {samplePrompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="response" className="flex-1 flex flex-col p-0 m-0">
          <div className="flex-1 overflow-auto p-4">
            <div className="font-mono text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-md border">
              {responseContent || "AI response will appear here..."}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Right panel: Preview and code */}
      <motion.div 
        className="lg:col-span-2 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-border overflow-hidden"
        variants={itemVariants}
      >
        <Tabs defaultValue="preview" className="flex-1 flex flex-col h-full">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Code
              </TabsTrigger>
            </TabsList>
            
            {/* Viewport controls (only in preview mode) */}
            <div className="flex space-x-1">
              <Button
                variant={viewportSize === 'desktop' ? 'default' : 'outline'}
                size="icon"
                onClick={() => handleViewportChange('desktop')}
                className="h-8 w-8"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === 'tablet' ? 'default' : 'outline'}
                size="icon"
                onClick={() => handleViewportChange('tablet')}
                className="h-8 w-8"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewportSize === 'mobile' ? 'default' : 'outline'}
                size="icon"
                onClick={() => handleViewportChange('mobile')}
                className="h-8 w-8"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="preview" className="h-full p-4 m-0">
              <div className="flex items-center justify-center mx-auto h-full transition-all duration-300 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black rounded-lg border border-border/40 overflow-hidden" style={getPreviewStyle()}>
                {generatedCode ? (
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <script src="https://cdn.tailwindcss.com"></script>
                          <style>
                            body { font-family: system-ui, sans-serif; margin: 0; }
                          </style>
                        </head>
                        <body>
                          <div id="root">
                            ${generatedCode ? '<div class="min-h-screen flex items-center justify-center p-6"><div class="text-center"><h2 class="text-xl font-medium mb-2">Your AI-generated website</h2><p class="text-gray-600">Preview is available in live mode</p></div></div>' : ''}
                          </div>
                          <script type="module">
                            import React from 'https://cdn.skypack.dev/react';
                            import ReactDOM from 'https://cdn.skypack.dev/react-dom';
                            
                            // This would render the generated React components
                            // In a real implementation, we'd need to transform the JSX
                          </script>
                        </body>
                      </html>
                    `}
                    className="w-full h-full border-0"
                    title="Preview"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="text-center p-6 max-w-lg">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
                      <Play className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Website Preview</h3>
                    <p className="text-muted-foreground mb-6">
                      Enter your website description and click "Generate Website" to create your custom website with AI.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="h-full m-0">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-auto">
                  <div className="p-4 font-mono text-sm bg-gray-900 text-gray-200 h-full overflow-auto">
                    {generatedCode ? (
                      <pre className="whitespace-pre-wrap">{generatedCode}</pre>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Generate a website to see the code</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {generatedCode && (
                  <div className="p-4 border-t border-gray-800 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyCode}>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Code
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadCode}>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setGeneratedCode('')}>
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Reset
                    </Button>
                    <Button className="ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Save className="h-3.5 w-3.5 mr-1" />
                      Save Project
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
