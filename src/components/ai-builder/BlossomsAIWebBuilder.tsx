
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Code, Sparkles, FileCode, Download, RefreshCw, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { generateCode, extractFilesFromResponse } from '@/lib/services/claudeService';
import { getFileType } from '@/utils/codeGeneration';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_PROMPT = "Create a modern landing page for a SaaS application with hero section, features, pricing, and contact form. Use a professional gold and white color scheme.";

const BlossomsAIWebBuilder = () => {
  // State for handling files and code generation
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [files, setFiles] = useState<Array<{ path: string; content: string; type: string }>>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>('');
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>('preview');
  const [viewportSize, setViewportSize] = useState<string>('desktop');
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  
  // Project metadata
  const [projectId] = useState<string>(uuidv4().substring(0, 8));
  const [projectName, setProjectName] = useState<string>("Blossom AI Project");

  // Example prompts for inspiration
  const examplePrompts = [
    "Create a modern landing page for a tech startup with a hero section, features, and testimonials",
    "Build a project management dashboard with task lists, calendar, and analytics charts",
    "Design an e-commerce product page with image gallery, reviews, and add to cart functionality",
    "Create a personal portfolio website with projects showcase, skills section, and contact form"
  ];
  
  // Handle prompt submission
  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate code");
      return;
    }
    
    setIsGenerating(true);
    setResponseText('');
    setGenerationProgress(0);
    
    // Progress simulation
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 800);
    
    try {
      // Generate code using Claude API
      const response = await generateCode(
        prompt,
        files.map(file => ({ path: file.path, content: file.content })),
        (streamedText) => {
          setResponseText(streamedText);
          // Complete the progress
          if (streamedText.length > 100) {
            setGenerationProgress(100);
            clearInterval(progressInterval);
          }
        },
        {
          system: "You are an expert web developer who creates beautiful, modern React + Tailwind webapps. Return code as markdown code blocks with filename headers.",
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      );
      
      // Extract files from Claude's response
      const extractedFiles = extractFilesFromResponse(response);
      
      if (extractedFiles.length === 0) {
        toast.warning("No code files were generated. Try a more specific prompt.");
      } else {
        // Convert the extracted files to our file format
        const newFiles = extractedFiles.map(file => ({
          path: file.path,
          content: file.content,
          type: getFileType(file.path)
        }));
        
        // Update the files state
        setFiles(prevFiles => {
          // Create a map of existing files to check for duplicates
          const existingFilesMap = new Map(prevFiles.map(file => [file.path, file]));
          
          // Add or update files
          newFiles.forEach(newFile => {
            existingFilesMap.set(newFile.path, newFile);
          });
          
          // Convert map back to array
          const updatedFiles = Array.from(existingFilesMap.values());
          
          // Set the active file to the first file if no active file
          if (!activeFile && updatedFiles.length > 0) {
            setActiveFile(updatedFiles[0].path);
          }
          
          return updatedFiles;
        });
        
        toast.success(`Generated ${newFiles.length} files successfully!`);
        
        // Switch to preview tab after generation
        setActiveTab('preview');
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Failed to generate code"}`);
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  // Select an example prompt
  const selectExamplePrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };
  
  // Handle file selection in explorer
  const handleFileSelect = (filePath: string) => {
    setActiveFile(filePath);
    setActiveTab('code');
  };
  
  // Get file extension
  const getFileExtension = (filePath: string) => {
    return filePath.split('.').pop() || '';
  };
  
  // Get responsive classes for preview
  const getPreviewClasses = () => {
    switch(viewportSize) {
      case 'mobile':
        return 'max-w-[375px] mx-auto border border-blossom-200 rounded-lg shadow-lg';
      case 'tablet':
        return 'max-w-[768px] mx-auto border border-blossom-200 rounded-lg shadow-lg';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  // Download all generated files as a zip
  const handleDownloadFiles = () => {
    if (files.length === 0) {
      toast.error("No files to download");
      return;
    }
    
    // This is a placeholder - in a real implementation, you would use JSZip or a similar library
    toast.success("Downloading files...");
    
    // Create a text file with all code
    const allCode = files.map(file => `// ${file.path}\n\n${file.content}`).join('\n\n// --------------------------------\n\n');
    const blob = new Blob([allCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="px-4 py-3 border-b border-blossom-100 bg-gradient-to-r from-blossom-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blossom-800 dark:text-blossom-300">
            <span className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blossom-500" />
              Blossom AI Web Builder
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">Powered by Claude 3.7 Sonnet</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-blossom-100 text-blossom-800 px-2 py-1 rounded">
            Project ID: {projectId}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-blossom-200 text-blossom-700 hover:bg-blossom-50"
            onClick={() => setProjectName(prompt.split('.')[0].substring(0, 20) || "Blossom AI Project")}
          >
            {projectName}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left panel: Prompt and Generation */}
        <div className="w-full lg:w-1/3 border-r border-blossom-100 flex flex-col overflow-hidden">
          {/* Prompt input area */}
          <div className="p-4">
            <form onSubmit={handleGenerateCode} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-blossom-700 dark:text-blossom-300">Describe Your Website</h3>
                <span className="text-xs font-medium text-blossom-500">Claude 3.7 Sonnet</span>
              </div>
              
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={DEFAULT_PROMPT}
                className="min-h-[120px] resize-none border-blossom-200 focus:border-blossom-400"
              />
              
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blossom-500 to-blossom-600 hover:from-blossom-600 hover:to-blossom-700 text-white" 
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Generate Website
                    </>
                  )}
                </Button>
              </div>
              
              {isGenerating && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-blossom-500 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              )}
              
              {/* Example prompts */}
              <div className="pt-4 border-t border-blossom-100 dark:border-gray-800">
                <h4 className="text-sm font-medium text-blossom-700 dark:text-blossom-300 mb-2">Example Prompts</h4>
                <div className="space-y-2">
                  {examplePrompts.map((examplePrompt, index) => (
                    <div 
                      key={index}
                      className="text-xs cursor-pointer p-2 bg-blossom-50 dark:bg-gray-800/50 hover:bg-blossom-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                      onClick={() => selectExamplePrompt(examplePrompt)}
                    >
                      {examplePrompt}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
          
          {/* File explorer */}
          <div className="flex-1 overflow-hidden border-t border-blossom-100">
            <div className="p-3 bg-blossom-50/50 dark:bg-gray-900 border-b border-blossom-100 flex justify-between items-center">
              <h3 className="text-sm font-medium text-blossom-700 dark:text-blossom-300 flex items-center">
                <FileCode className="w-4 h-4 mr-1" />
                Files
              </h3>
              <span className="text-xs text-muted-foreground">{files.length} files</span>
            </div>
            
            <div className="p-2 overflow-y-auto max-h-[calc(100%-3rem)]">
              {files.length > 0 ? (
                <div className="space-y-1">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className={`text-xs p-2 rounded-md cursor-pointer flex items-center ${
                        activeFile === file.path 
                          ? 'bg-blossom-100 dark:bg-blossom-900/30 text-blossom-800 dark:text-blossom-300' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }`}
                      onClick={() => handleFileSelect(file.path)}
                    >
                      <span className="mr-2">
                        {getFileExtension(file.path) === 'tsx' || getFileExtension(file.path) === 'jsx' ? (
                          <Code className="w-3.5 h-3.5 text-blue-500" />
                        ) : getFileExtension(file.path) === 'css' ? (
                          <div className="w-3.5 h-3.5 text-pink-500">#</div>
                        ) : (
                          <FileCode className="w-3.5 h-3.5 text-gray-500" />
                        )}
                      </span>
                      <span className="truncate">{file.path}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                  <FileCode className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-xs text-muted-foreground">
                    No files generated yet.<br />Enter a prompt and click Generate.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Response display (collapsible) */}
          {responseText && (
            <div className="border-t border-blossom-100 p-2">
              <details className="text-xs">
                <summary className="cursor-pointer font-medium text-blossom-700 dark:text-blossom-300 pb-2">Claude Response</summary>
                <div className="max-h-[200px] overflow-auto bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                  <pre className="whitespace-pre-wrap text-xs">{responseText}</pre>
                </div>
              </details>
            </div>
          )}
        </div>
        
        {/* Right side: Preview and Code */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            {/* Tab navigation */}
            <div className="px-4 py-2 border-b border-blossom-100 flex justify-between items-center">
              <TabsList className="bg-blossom-50/50 dark:bg-gray-900">
                <TabsTrigger value="preview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                  <Code className="w-4 h-4 mr-2" />
                  Code
                </TabsTrigger>
              </TabsList>
              
              {/* Actions for current tab */}
              {activeTab === 'preview' && (
                <div className="flex space-x-1">
                  <Button
                    variant={viewportSize === 'desktop' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewportSize('desktop')}
                    className="h-8 w-8 bg-blossom-500 text-white hover:bg-blossom-600"
                  >
                    <Monitor className="h-4 w-4" />
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
                    variant={viewportSize === 'mobile' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewportSize('mobile')}
                    className="h-8 w-8"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {activeTab === 'code' && (
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={handleDownloadFiles}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    setFiles([]);
                    setActiveFile(null);
                    setResponseText('');
                    toast.success("Project reset");
                  }}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
              )}
            </div>
            
            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              <TabsContent value="preview" className="h-full m-0">
                <div className={`h-full overflow-auto p-4 ${getPreviewClasses()} transition-all duration-300`}>
                  {files.length > 0 ? (
                    <iframe
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                              body { 
                                font-family: system-ui, sans-serif; 
                                margin: 0; 
                              }
                            </style>
                          </head>
                          <body>
                            <div id="root"></div>
                            <script type="module">
                              import React from 'https://esm.sh/react@18.2.0';
                              import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
                              
                              // This is a very simplified preview
                              const App = () => {
                                return (
                                  <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-8">
                                    <h1 className="text-3xl font-bold text-amber-800 mb-6">AI Generated Website Preview</h1>
                                    <p className="text-gray-700 mb-4">This is a preview of the generated website based on your prompt:</p>
                                    <div className="bg-amber-100 p-4 rounded-lg mb-6">
                                      <p className="italic">"${prompt}"</p>
                                    </div>
                                    <p className="text-sm text-gray-500">Generated ${files.length} files - view the Code tab to see the implementation</p>
                                  </div>
                                );
                              };
                              
                              ReactDOM.render(React.createElement(App), document.getElementById('root'));
                            </script>
                          </body>
                        </html>
                      `}
                      className="w-full h-full border-0"
                      title="Preview"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <motion.div 
                      className="flex flex-col items-center justify-center h-full p-8 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-blossom-100 rounded-full flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Sparkles className="w-8 h-8 text-blossom-500" />
                      </motion.div>
                      <motion.h2 
                        className="text-xl font-semibold mb-2 text-blossom-800 dark:text-blossom-300"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Welcome to Blossom AI Website Builder
                      </motion.h2>
                      <motion.p 
                        className="text-muted-foreground max-w-md mx-auto"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        Describe what you want to build in the text input on the left side, and Claude 3.7 Sonnet will generate a complete website for you.
                      </motion.p>
                    </motion.div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="h-full m-0">
                <div className="h-full overflow-auto">
                  {activeFile && files.find(f => f.path === activeFile) ? (
                    <pre className="p-4 text-sm overflow-auto bg-gray-50 dark:bg-gray-900 h-full">
                      <code>{files.find(f => f.path === activeFile)?.content}</code>
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <FileCode className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No File Selected</h3>
                      <p className="text-muted-foreground text-sm max-w-md">
                        {files.length > 0 
                          ? "Select a file from the list on the left to view its code."
                          : "Generate a website to view the code."}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BlossomsAIWebBuilder;
