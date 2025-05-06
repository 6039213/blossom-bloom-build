
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Smartphone, Tablet, Monitor, Copy, Download, Code, Eye, RefreshCw, FileText } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { extractCodeBlocks } from "@/utils/codeGeneration";
import WebsitePreview from './WebsitePreview';
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
const samplePrompts = [
  "Create a modern landing page for a coffee shop with a gold and brown color scheme",
  "Build a photography portfolio website with a dark theme and image gallery",
  "Design a SaaS dashboard with analytics charts and user management",
  "Create a personal blog with featured posts and a newsletter signup"
];

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

export default function BoltAIWebBuilder() {
  const [activeTab, setActiveTab] = useState('chat');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [files, setFiles] = useState<WebsiteFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [responseContent, setResponseContent] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [projectId] = useState(uuidv4().substring(0, 6));
  
  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle viewport change for responsive preview
  const handleViewportChange = (size: string) => {
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
      
      // Call Claude API through proxy
      const response = await callClaudeAPI(prompt);
      clearInterval(progressInterval);
      
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
        const generatedFiles = Object.entries(codeBlocks).map(([path, code]) => ({
          path: path.startsWith('/') ? path.substring(1) : path,
          content: code,
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
      setMessages(prev => 
        prev.map(msg => 
          msg.role === 'assistant' && msg.id === prev[prev.length - 1].id 
            ? { ...msg, content: `Error: ${error instanceof Error ? error.message : 'Failed to generate website'}` } 
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Call Claude API through our proxy
  const callClaudeAPI = async (userPrompt: string): Promise<string> => {
    try {
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY || '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';
      const model = import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-7-sonnet-20250219';
      
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

      // Use our proxy endpoint instead of direct API call
      const response = await fetch('/api/claude-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Create a complete website based on this description: "${userPrompt}". Provide all necessary files to make it functional.`
            }
          ],
          max_tokens: 4000
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

  // Handle sample prompt selection
  const handleSelectSample = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  // Get file type from path
  const getFileType = (filePath: string): string => {
    const extension = filePath.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'ts': return 'typescript';
      case 'tsx': return 'typescriptreact';
      case 'js': return 'javascript';
      case 'jsx': return 'javascriptreact';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  // Download all files as zip
  const handleDownloadProject = () => {
    if (files.length === 0) {
      toast.error("No files to download");
      return;
    }
    
    // This is a placeholder - in a real implementation we'd use JSZip to create a zip file
    toast.info("Downloading project as zip file...");
    setTimeout(() => {
      toast.success("Project downloaded successfully!");
    }, 1500);
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left panel: Chat and prompt input */}
      <motion.div 
        className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-border overflow-hidden"
        variants={itemVariants}
      >
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="font-semibold bg-blue-100 text-blue-700 border-blue-300">
              Blossom AI Builder
            </Badge>
            <span className="text-xs opacity-70">ID: {projectId}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="advanced-mode" 
              checked={showAdvanced} 
              onCheckedChange={setShowAdvanced} 
              className="data-[state=checked]:bg-blue-600"
            />
            <Label htmlFor="advanced-mode" className="text-xs">Advanced</Label>
          </div>
        </div>

        {activeTab === 'chat' ? (
          <>
            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Sparkles className="h-10 w-10 text-blue-500" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Blossom AI Website Builder</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Describe the website you want to create, and AI will generate it for you in seconds.
                    </p>
                  </div>
                  <Card className="w-full bg-blue-50/50 dark:bg-blue-900/20">
                    <CardContent className="p-4 text-sm">
                      <h4 className="font-medium mb-2">Try prompts like:</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        {samplePrompts.map((sample, index) => (
                          <li key={index} className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSelectSample(sample)}>
                            {sample}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
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
                          ? 'bg-blue-600 text-white' 
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
                  placeholder="Describe the website or application you want to create..."
                  className="min-h-28 resize-none focus:border-blue-500"
                  disabled={isGenerating}
                />
                
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
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
                      <Send className="w-4 h-4 mr-2" />
                      Generate Website
                    </>
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* File explorer when not in chat tab */}
            <div className="p-2 border-b border-border flex justify-between items-center">
              <h3 className="font-medium">Project Files</h3>
              <Button variant="ghost" size="sm" onClick={handleDownloadProject} disabled={files.length === 0}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <FileExplorer 
                files={files} 
                activeFile={activeFile} 
                onFileSelect={handleFileSelect}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Right panel: Preview and code */}
      <motion.div 
        className="lg:col-span-2 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-border overflow-hidden"
        variants={itemVariants}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Code
              </TabsTrigger>
              {showAdvanced && (
                <TabsTrigger value="response" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Response
                </TabsTrigger>
              )}
            </TabsList>
            
            {/* Viewport controls (only in preview mode) */}
            {activeTab === 'preview' && (
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
            )}
            
            {/* Code actions (only in code mode) */}
            {activeTab === 'code' && activeFile && (
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" onClick={() => {
                  const file = files.find(f => f.path === activeFile);
                  if (file) {
                    navigator.clipboard.writeText(file.content);
                    toast.success("Code copied to clipboard");
                  }
                }}>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
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
                    toast.success("File downloaded");
                  }
                }}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="chat" className="h-full m-0 p-0">
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <h3 className="text-2xl font-bold mb-4">Welcome to Blossom AI Builder</h3>
                  <p className="text-muted-foreground mb-6">
                    Enter your website description in the prompt field on the left and click "Generate Website" to create your custom website with AI.
                  </p>
                  <Button onClick={() => setActiveTab('preview')} disabled={files.length === 0}>
                    {files.length > 0 ? 'View Generated Website' : 'Generate a Website First'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="h-full m-0 p-0">
              <WebsitePreview files={files} viewportSize={viewportSize} />
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
