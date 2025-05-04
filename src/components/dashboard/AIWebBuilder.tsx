
import React, { useState, useEffect } from 'react';
import { Send, Smartphone, Tablet, Monitor, Copy, Download, RefreshCw } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

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

export default function AIWebBuilder() {
  const [activeTab, setActiveTab] = useState('preview');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectId] = useState(uuidv4().substring(0, 6));
  const [projectName, setProjectName] = useState("New AI Project");
  const [viewportSize, setViewportSize] = useState('desktop');
  const [generatedCode, setGeneratedCode] = useState('');
  
  const handleViewportChange = (size) => {
    setViewportSize(size);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Simulate processing
    setIsLoading(true);
    
    // In a real app, we'd call the AI here
    setTimeout(() => {
      const newMessage = {
        id: uuidv4(),
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString()
      };
      
      setMessages([...messages, newMessage]);
      setGeneratedCode(`// Generated code from prompt: "${prompt}"\n\nfunction App() {\n  return (\n    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">\n      <h1 className="text-3xl font-bold text-blue-800 mb-6">AI Generated Website</h1>\n      <p className="text-gray-700">This is a website generated based on your prompt.</p>\n    </div>\n  );\n}`);
      toast.success("Generated website preview!");
      setIsLoading(false);
      setPrompt('');
    }, 1500);
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
      {/* Left panel: Chat and prompt input */}
      <motion.div 
        className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-border overflow-hidden"
        variants={itemVariants}
      >
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="font-semibold bg-blue-100 text-blue-700 border-blue-300">
              AI Builder
            </Badge>
            <span className="text-xs opacity-70">ID: {projectId}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setProjectName(prompt || "New AI Project")} className="text-xs">
            {projectName}
          </Button>
        </div>

        {/* Chat messages area */}
        <motion.div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          variants={itemVariants}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <motion.div
                className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-3xl">🚀</span>
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">AI Website Builder</h3>
                <p className="text-muted-foreground max-w-sm">
                  Describe the website you want to create, and AI will generate it for you.
                </p>
              </div>
              <Card className="w-full bg-blue-50/50">
                <CardContent className="p-4 text-sm">
                  <h4 className="font-medium mb-2">Try prompts like:</h4>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>"Create a landing page for a coffee shop"</li>
                    <li>"Build a photography portfolio website"</li>
                    <li>"Make a dashboard for project management"</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-[85%] ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className="text-xs opacity-70 text-right mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Input area */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the website or application you want to create..."
              className="min-h-28 resize-none focus:border-blue-500"
            />
            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!prompt.trim() || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Generate Website
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Right panel: Preview and code */}
      <motion.div 
        className="lg:col-span-2 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-border overflow-hidden"
        variants={itemVariants}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="preview">
                <Monitor className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code">
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                Code
              </TabsTrigger>
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
            {activeTab === 'code' && (
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  toast.success("Code copied to clipboard");
                }}>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  const blob = new Blob([generatedCode], { type: 'text/javascript' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'generated-code.jsx';
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Code downloaded");
                }}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setGeneratedCode('');
                  toast.info("Code reset");
                }}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Reset
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden p-4">
            <TabsContent value="preview" className="h-full m-0">
              <div className="h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black rounded-lg border border-border/40 overflow-hidden flex flex-col items-center justify-center transition-all duration-300" style={getPreviewStyle()}>
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
                          <div id="root" class="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
                            <h1 class="text-3xl font-bold text-blue-800 mb-6">AI Generated Website</h1>
                            <p class="text-gray-700">This is a website generated based on your prompt.</p>
                          </div>
                        </body>
                      </html>
                    `}
                    className="w-full h-full border-0"
                    title="Preview"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="text-center p-12 max-w-xl">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                      <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Your AI Website Preview</h3>
                    <p className="text-muted-foreground mb-6">
                      Enter your website description in the prompt field on the left and click "Generate Website" to create your custom website.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="h-full m-0">
              <div className="h-full bg-gray-900 text-gray-100 rounded-lg overflow-auto p-4 font-mono text-sm">
                {generatedCode ? (
                  <pre>{generatedCode}</pre>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">No code generated yet. Enter a prompt to generate code.</p>
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
