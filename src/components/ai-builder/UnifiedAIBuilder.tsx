
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Smartphone, Tablet, Monitor, Copy, Download, 
  Code, Eye, FileText, Settings, CheckCircle, RefreshCw,
  Sparkles, Cpu, RotateCcw
} from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import FileExplorer from './FileExplorer';
import CodePane from './CodePane';

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
const websiteTemplates = [
  {
    title: "Coffee Shop Website",
    description: "Modern landing page for a specialty coffee shop with online ordering",
    prompt: "Create a modern landing page for a coffee shop with a gold and brown color scheme, featuring hero section, about us, coffee menu, and online ordering form."
  },
  {
    title: "Portfolio Website",
    description: "Photography portfolio with dark theme and image gallery",
    prompt: "Build a photography portfolio website with a dark theme, full-screen image gallery, contact form, and about section for a professional photographer."
  },
  {
    title: "SaaS Dashboard",
    description: "Admin dashboard with analytics charts and user management",
    prompt: "Design a SaaS dashboard with analytics charts, user management table, settings panel, and notification system, using a modern blue and white color scheme."
  },
  {
    title: "Blog Platform",
    description: "Personal blog with featured posts and newsletter signup",
    prompt: "Create a personal blog with featured posts section, category filtering, newsletter signup form, and author profile, using a clean minimal design."
  }
];

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface WebsiteFile {
  path: string;
  content: string;
  type: string;
}

// Helper function to extract code blocks
const extractCodeBlocks = (text: string): Record<string, string> => {
  const files: Record<string, string> = {};
  
  // Match code blocks with format: ```jsx filename.jsx ... ```
  const codeBlockRegex = /```(?:jsx|tsx|ts|js|css|html|json)?\s+([^\n]+)\s*\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const [_, filePath, code] = match;
    if (filePath && code) {
      // Clean up the file path
      const cleanPath = filePath.trim();
      files[cleanPath] = code.trim();
    }
  }
  
  return files;
};

// Helper function to get file type from path
const getFileType = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase() || '';
  
  const typeMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown'
  };
  
  return typeMap[extension] || 'text';
};

export default function UnifiedAIBuilder() {
  // State
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [files, setFiles] = useState<WebsiteFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [responseContent, setResponseContent] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("New AI Website");
  const [temperature, setTemperature] = useState<number>(70); // 0-100 scale for UI
  const [thinkingBudget, setThinkingBudget] = useState<number>(1000);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [projectId] = useState(uuidv4().substring(0, 6));
  
  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle viewport change for responsive preview
  const handleViewportChange = (size: 'desktop' | 'tablet' | 'mobile') => {
    setViewportSize(size);
  };

  // Handle file selection
  const handleFileSelect = (filePath: string) => {
    setActiveFile(filePath);
  };

  // Update file content
  const handleFileContentChange = (filePath: string, content: string) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.path === filePath ? { ...file, content } : file
      )
    );
  };

  // Handle prompt submission
  const handleSubmitPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a website description");
      return;
    }
    
    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Start generation process
    setIsGenerating(true);
    setGenerationProgress(0);
    setResponseContent('');
    
    try {
      // Add AI message placeholder
      const aiMessageId = uuidv4();
      setMessages(prev => [...prev, {
        id: aiMessageId,
        role: 'assistant',
        content: 'Generating your website...',
        timestamp: new Date()
      }]);
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      const actualTemperature = temperature / 100; // Convert to 0-1 scale
      
      // Call Claude API
      const response = await callClaudeAPI(prompt, actualTemperature, thinkingBudget);
      clearInterval(progressInterval);
      
      setResponseContent(response);
      
      // Extract code blocks from response
      const codeBlocks = extractCodeBlocks(response);
      
      if (Object.keys(codeBlocks).length === 0) {
        // No code blocks found, update message with just text
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, content: response } : msg
          )
        );
        toast.error("No code was generated. Please try a more specific prompt.");
      } else {
        // Format files for our system
        const generatedFiles: WebsiteFile[] = Object.entries(codeBlocks).map(([path, code]) => ({
          path: path.startsWith('/') ? path.substring(1) : path,
          content: code as string,
          type: getFileType(path)
        }));
        
        setFiles(generatedFiles);
        setActiveFile(generatedFiles[0]?.path || null);
        
        // Update AI message with summary
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId ? { 
              ...msg, 
              content: `Generated ${generatedFiles.length} files for your website. You can now explore the code and see the preview.` 
            } : msg
          )
        );
        
        // Switch to preview
        setActiveTab('preview');
        toast.success(`Website generated with ${generatedFiles.length} files!`);
      }
      
      setGenerationProgress(100);
      setPrompt('');
      
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error("Generation error:", error);
      
      // Update error in AI message
      setMessages(prev => {
        const lastAssistantMessage = prev.findLast(m => m.role === 'assistant');
        if (lastAssistantMessage) {
          return prev.map(msg => 
            msg.id === lastAssistantMessage.id 
              ? { ...msg, content: `Error: ${error instanceof Error ? error.message : 'Failed to generate website'}` } 
              : msg
          );
        }
        return prev;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Call Claude API 
  const callClaudeAPI = async (userPrompt: string, temp: number, thinkingBudget: number): Promise<string> => {
    try {
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      const model = import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-7-sonnet-20240229';
      
      const systemPrompt = `You are an expert web developer specializing in creating beautiful, modern websites with React and Tailwind CSS. 
      
When given a website description, you will:
1. Generate ALL necessary files with complete, working code.
2. Structure your response as multiple file blocks using this format:
\`\`\`jsx src/components/ComponentName.tsx
// Complete file content here with imports, component code, etc.
\`\`\`
3. Include:
   - All import statements
   - All component definitions with proper TypeScript types
   - Complete Tailwind CSS styling
   - All necessary utility functions
4. Create a fully functional, responsive design
5. Use modern React patterns (hooks, context if needed)
6. Ensure the code is immediately runnable
7. Include at minimum:
   - App.tsx or index.tsx as the entry point
   - Multiple component files organized logically
   - Any utility files needed

The code will be directly executed in a preview environment, so it must be complete and error-free.`;

      // Make the request to Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true' // Add CORS header
        },
        body: JSON.stringify({
          model: model,
          system: systemPrompt,
          max_tokens: 4000,
          temperature: temp,
          messages: [
            {
              role: 'user',
              content: `Create a complete website based on this description: "${userPrompt}". Provide all necessary files to make it functional.`
            }
          ],
          thinking: {
            enabled: true,
            budget_tokens: thinkingBudget
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      return data.content[0].text || '';
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  };

  // Handle sample template selection
  const handleSelectTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  // Generate preview HTML
  const generatePreviewHTML = () => {
    // Find index.html file if it exists
    const indexHtml = files.find(file => file.path === 'index.html');
    
    // Find CSS files
    const cssFiles = files.filter(file => file.path.endsWith('.css'));
    const cssContent = cssFiles.map(file => file.content).join('\n');
    
    // Find JS/JSX files
    const jsFiles = files.filter(file => 
      file.path.endsWith('.js') || 
      file.path.endsWith('.jsx') || 
      file.path.endsWith('.ts') || 
      file.path.endsWith('.tsx')
    );

    // Use index.html as template if it exists, otherwise create a basic HTML structure
    const html = indexHtml ? indexHtml.content : `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <title>${projectName}</title>
          <style id="embedded-css"></style>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `;

    // Create a DOM parser to modify the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Embed CSS
    const styleElement = doc.getElementById('embedded-css') || doc.createElement('style');
    styleElement.id = 'embedded-css';
    styleElement.textContent = cssContent;
    if (!doc.getElementById('embedded-css')) {
      doc.head.appendChild(styleElement);
    }
    
    // Add tailwind if not already included
    if (!html.includes('tailwindcss')) {
      const tailwindScript = doc.createElement('script');
      tailwindScript.src = 'https://cdn.tailwindcss.com';
      doc.head.appendChild(tailwindScript);
    }
    
    // Add React and ReactDOM
    const reactScript = doc.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.development.js';
    doc.head.appendChild(reactScript);
    
    const reactDomScript = doc.createElement('script');
    reactDomScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';
    doc.head.appendChild(reactDomScript);
    
    // Create script to initialize react component
    const appInitScript = doc.createElement('script');
    appInitScript.type = 'text/babel';
    
    // Convert JSX to JS (simplified, not a full conversion)
    let initCode = '';
    
    // First add all component definitions
    jsFiles.forEach(file => {
      initCode += `\n// File: ${file.path}\n${file.content}\n`;
    });
    
    // Then add code to render App component if it exists
    initCode += `
      // Initialize React app
      try {
        const rootElement = document.getElementById('root');
        if (typeof App !== 'undefined' && rootElement) {
          ReactDOM.render(React.createElement(App), rootElement);
        } else {
          document.getElementById('root').innerHTML = '<div class="p-8 bg-gradient-to-b from-blue-50 to-white min-h-screen"><h1 class="text-2xl font-bold text-blue-800 mb-4">Website Preview</h1><p>This is a preview of your generated website.</p></div>';
        }
      } catch (error) {
        console.error("Error rendering React app:", error);
        document.getElementById('root').innerHTML = '<div class="p-8 bg-red-50 text-red-800"><h2 class="text-xl font-bold mb-2">Error rendering React app</h2><pre class="bg-red-100 p-2 rounded overflow-auto">' + error.message + '</pre></div>';
      }
    `;
    
    appInitScript.textContent = initCode;
    doc.body.appendChild(appInitScript);
    
    // Add Babel for JSX support
    const babelScript = doc.createElement('script');
    babelScript.src = 'https://unpkg.com/babel-standalone@6/babel.min.js';
    doc.head.appendChild(babelScript);
    
    // Return the modified HTML
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  };

  // Download all files as zip
  const handleDownloadFiles = () => {
    if (files.length === 0) {
      toast.error("No files to download");
      return;
    }
    
    // This is a placeholder - in a real implementation we'd use JSZip
    // But for now we'll just download the active file
    if (activeFile) {
      const file = files.find(f => f.path === activeFile);
      if (file) {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = activeFile.split('/').pop() || 'file.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };

  // Handle code refresh to update preview
  const handleRefreshPreview = () => {
    // Force a state update to trigger preview refresh
    setFiles([...files]);
  };

  // Get viewport style for preview container
  const getViewportStyle = () => {
    switch (viewportSize) {
      case 'mobile':
        return { maxWidth: '375px', height: '667px', margin: '0 auto' };
      case 'tablet':
        return { maxWidth: '768px', height: '1024px', margin: '0 auto' };
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
      {/* Left panel: Chat, prompt input, and file explorer */}
      <motion.div 
        className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-border overflow-hidden"
        variants={itemVariants}
      >
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 border-purple-300">
              AI Website Builder
            </Badge>
            <span className="text-xs opacity-70">ID: {projectId}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="advanced-mode" 
              checked={showAdvanced} 
              onCheckedChange={setShowAdvanced} 
              className="data-[state=checked]:bg-purple-600"
            />
            <Label htmlFor="advanced-mode" className="text-xs">Advanced</Label>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow overflow-hidden">
          <TabsList className="p-2 justify-center">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Files</span>
            </TabsTrigger>
            {showAdvanced && (
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="chat" className="flex-grow flex flex-col overflow-hidden m-0 p-0">
            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Sparkles className="h-10 w-10 text-purple-500" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      AI Website Builder
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                      Describe the website you want to create, and AI will generate it for you in seconds.
                    </p>
                  </div>

                  <div className="w-full">
                    <h4 className="font-medium mb-3 text-sm">Quick Start Templates</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {websiteTemplates.map((template, index) => (
                        <Card 
                          key={index} 
                          className="cursor-pointer hover:border-purple-300 hover:shadow-md transition-all duration-200"
                          onClick={() => handleSelectTemplate(template.prompt)}
                        >
                          <CardContent className="p-3">
                            <h5 className="font-medium text-sm">{template.title}</h5>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`rounded-lg px-4 py-2 max-w-[85%] ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="text-xs opacity-70 text-right mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-border p-4">
              <form onSubmit={handleSubmitPrompt} className="space-y-4">
                <Textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the website you want to create..."
                  className="min-h-28 resize-none focus:border-purple-500"
                  disabled={isGenerating}
                />

                {showAdvanced && (
                  <div className="grid grid-cols-2 gap-4 py-2">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs">Temperature: {temperature/100}</Label>
                        <span className="text-xs text-muted-foreground">
                          {temperature <= 30 ? "Focused" : temperature >= 70 ? "Creative" : "Balanced"}
                        </span>
                      </div>
                      <Slider
                        value={[temperature]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(vals) => setTemperature(vals[0])}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs">Thinking Budget</Label>
                        <span className="text-xs text-muted-foreground">{thinkingBudget}</span>
                      </div>
                      <Slider
                        value={[thinkingBudget]}
                        min={500}
                        max={2000}
                        step={100}
                        onValueChange={(vals) => setThinkingBudget(vals[0])}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating... {Math.round(generationProgress)}%
                    </div>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4 mr-2" />
                      Generate Website
                    </>
                  )}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="files" className="flex-grow flex flex-col overflow-hidden m-0 p-0">
            {/* File explorer */}
            <div className="p-2 border-b border-border flex justify-between items-center">
              <h3 className="font-medium text-sm">Project Files</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={handleDownloadFiles} disabled={files.length === 0}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={handleRefreshPreview} disabled={files.length === 0}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <FileText className="h-12 w-12 text-muted-foreground mb-2 opacity-30" />
                  <p className="text-sm text-muted-foreground">No files generated yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate a website from the chat tab to see files here
                  </p>
                </div>
              ) : (
                <FileExplorer 
                  files={files} 
                  activeFile={activeFile} 
                  onFileSelect={handleFileSelect}
                />
              )}
            </div>
          </TabsContent>

          {showAdvanced && (
            <TabsContent value="settings" className="flex-grow overflow-auto m-0 p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Project Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <input
                        id="project-name"
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Claude Model</Label>
                      <Select defaultValue={import.meta.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229"}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="claude-3-7-sonnet-20240229">Claude 3.7 Sonnet</SelectItem>
                          <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">AI Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Temperature</Label>
                        <span className="text-sm text-muted-foreground">{temperature/100}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Focused</span>
                        <Slider
                          value={[temperature]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(vals) => setTemperature(vals[0])}
                          className="w-full"
                        />
                        <span className="text-xs">Creative</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Thinking Budget (tokens)</Label>
                        <span className="text-sm text-muted-foreground">{thinkingBudget}</span>
                      </div>
                      <Slider
                        value={[thinkingBudget]}
                        min={500}
                        max={2000}
                        step={100}
                        onValueChange={(vals) => setThinkingBudget(vals[0])}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">About</h3>
                  <div className="bg-muted/40 p-3 rounded text-sm">
                    <p>AI Website Builder powered by Claude 3.7 Sonnet</p>
                    <p className="text-xs text-muted-foreground mt-1">Version 1.0.0</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </motion.div>

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
              {showAdvanced && responseContent && (
                <TabsTrigger value="response" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Claude Response
                </TabsTrigger>
              )}
            </TabsList>
            
            {/* Viewport controls */}
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
            <TabsContent value="preview" className="h-full m-0">
              <div className="w-full h-full bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-center overflow-auto">
                <div
                  className="bg-white dark:bg-gray-900 rounded-md shadow-lg transition-all duration-300 h-full overflow-hidden border border-gray-200 dark:border-gray-700"
                  style={getViewportStyle()}
                >
                  {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                        <Eye className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Website Preview</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Enter your website description in the chat and click "Generate Website" to create your custom website with AI.
                      </p>
                      <Button
                        onClick={() => setActiveTab('chat')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Start Building
                      </Button>
                    </div>
                  ) : (
                    <iframe
                      srcDoc={generatePreviewHTML()}
                      className="w-full h-full border-0"
                      title="Website Preview"
                      sandbox="allow-scripts"
                    />
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="h-full m-0 p-0">
              <CodePane 
                files={files}
                activeFile={activeFile}
                onContentChange={handleFileContentChange}
              />
            </TabsContent>
            
            {showAdvanced && (
              <TabsContent value="response" className="h-full m-0 p-0">
                <div className="h-full bg-gray-900 text-gray-300 p-4 overflow-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {responseContent || "No response content yet. Generate a website to see Claude's raw response."}
                  </pre>
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
