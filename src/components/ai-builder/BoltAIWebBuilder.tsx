import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles, Send, Code, Eye, Loader2, FileCode, CheckCircle, Terminal, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { generateCode, extractFilesFromResponse, FileContent } from '@/lib/services/claudeService';
import { createProjectZip } from '@/lib/services/zipService';
import WebsitePreview from './WebsitePreview';
import CodePane from './CodePane';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: FileContent[];
  isTyping?: boolean;
}

interface WebsiteFile extends FileContent {
  type: string;
}

// Helper function to get file type
const getFileTypeFromPath = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'jsx':
    case 'tsx':
      return 'react';
    case 'js':
    case 'ts':
      return 'javascript';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'json':
      return 'json';
    default:
      return 'text';
  }
};

// Convert FileContent to WebsiteFile
const convertToWebsiteFile = (file: FileContent): WebsiteFile => ({
  ...file,
  type: getFileTypeFromPath(file.path)
});

const samplePrompts = [
  "Create a modern landing page for a tech startup",
  "Build a portfolio website for a photographer",
  "Design a restaurant website with online ordering",
  "Make a blog template with dark mode support"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export default function BoltAIWebBuilder() {
  const [activeTab, setActiveTab] = useState('preview');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
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

  // Handle sample prompt selection
  const handleSelectSample = (sample: string) => {
    setPrompt(sample);
  };

  // Simulate typing effect
  const simulateTyping = async (text: string, messageIndex: number) => {
    const words = text.split(' ');
    let currentText = '';
    
    for (const word of words) {
      currentText += word + ' ';
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[messageIndex].content = currentText;
        return newMessages;
      });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };

  // Handle prompt submission
  const handleSubmitPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');

    setIsGenerating(true);
    setGenerationProgress(0);
    setResponseContent('');

    try {
      // Add initial assistant message with typing effect
      const assistantMessage: Message = {
        role: 'assistant',
        content: "I'll help you create your website. Let me analyze your request...",
        timestamp: new Date(),
        isTyping: true
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Generate code
      const response = await generateCode(
        prompt,
        files,
        (accumulatedText) => {
          setResponseContent(accumulatedText);
          setGenerationProgress(Math.min(95, Math.floor(accumulatedText.length / 40)));
        }
      );

      // Extract files from response
      const extractedFiles = extractFilesFromResponse(response);
      
      if (extractedFiles.length === 0) {
        throw new Error("No valid code files could be extracted from the response");
      }

      // Convert to website files and update state
      const websiteFiles = extractedFiles.map(convertToWebsiteFile);
      setFiles(prevFiles => {
        const updatedFiles = [...prevFiles];
        websiteFiles.forEach(newFile => {
          const existingIndex = updatedFiles.findIndex(f => f.path === newFile.path);
          if (existingIndex >= 0) {
            updatedFiles[existingIndex] = newFile;
          } else {
            updatedFiles.push(newFile);
          }
        });
        return updatedFiles;
      });

      // Update assistant message with file changes
      const fileChanges = websiteFiles.map(file => `Created/Updated: ${file.path}`).join('\n');
      const finalMessage = `I've created/updated the following files:\n${fileChanges}\n\nYou can now preview the website or view the code.`;
      
      // Update the last message with typing effect
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.isTyping = false;
        lastMessage.content = finalMessage;
        lastMessage.files = extractedFiles;
        return newMessages;
      });

      setGenerationProgress(100);
      toast.success("Website generated successfully!");
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error(`Failed to generate code: ${error.message}`);
      
      // Update assistant message with error
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.isTyping = false;
        lastMessage.content = `Sorry, I encountered an error: ${error.message}`;
        return newMessages;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left panel: Chat (30%) */}
      <div className="w-[30%] border-r flex flex-col bg-white dark:bg-gray-900">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="font-semibold bg-blue-100 text-blue-700 border-blue-300">
              Blossom AI Builder
            </Badge>
            <span className="text-xs opacity-70">ID: {projectId}</span>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10"
              >
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
              </motion.div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <div className="whitespace-pre-wrap">
                      {message.content}
                      {message.isTyping && (
                        <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                      )}
                    </div>
                    {message.files && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs font-medium mb-1">Files created/updated:</div>
                        <ul className="space-y-1">
                          {message.files.map((file, i) => (
                            <li key={i} className="flex items-center text-xs">
                              <FileCode className="w-3 h-3 mr-1" />
                              {file.path}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt input */}
        <div className="border-t p-4">
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
                  <Loader2 className="h-4 w-4 animate-spin" />
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
      </div>

      {/* Right panel: Preview/Code (70%) */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-2 flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center">
                <Code className="w-4 h-4 mr-2" />
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-hidden">
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
        </div>
      </div>
    </div>
  );
}
