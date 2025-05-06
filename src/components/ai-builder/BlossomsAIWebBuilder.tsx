
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, Download, Send, Smartphone, Tablet, Monitor, Code, Play } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function BlossomsAIWebBuilder() {
  const [prompt, setPrompt] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<Array<{path: string; content: string; type: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [activeTab, setActiveTab] = useState('preview');
  const [rawResponse, setRawResponse] = useState('');
  const [conversation, setConversation] = useState<Array<{role: string; content: string; id: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract code blocks from AI response
  const extractCodeFromResponse = (text: string) => {
    const files: Array<{path: string; content: string; type: string}> = [];
    const fileRegex = /```(?:jsx|tsx|html|css|javascript|js|typescript|ts)?(?:\s+([^\n]+))?\n([\s\S]*?)```/g;
    
    let match;
    while ((match = fileRegex.exec(text)) !== null) {
      const filePath = match[1] || `file-${files.length + 1}.tsx`;
      const content = match[2];
      const fileExtension = filePath.split('.').pop() || 'tsx';
      
      files.push({
        path: filePath.trim(),
        content: content.trim(),
        type: fileExtension
      });
    }
    
    return files;
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  // Handle prompt submission
  const handleSubmitPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      setIsLoading(true);
      
      // Add user message to conversation
      const userMessage = {
        role: 'user',
        content: prompt,
        id: uuidv4()
      };
      
      setConversation(prev => [...prev, userMessage]);
      
      // Call Claude API
      const response = await callClaudeAPI(prompt);
      setRawResponse(response);
      
      // Extract code blocks from response
      const files = extractCodeFromResponse(response);
      setGeneratedFiles(files);
      
      // Add assistant response to conversation
      const assistantMessage = {
        role: 'assistant',
        content: response,
        id: uuidv4()
      };
      
      setConversation(prev => [...prev, assistantMessage]);
      
      // Show success toast if we got files
      if (files.length > 0) {
        toast.success(`Generated ${files.length} files for your website`);
      }
      
      // Clear prompt
      setPrompt('');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Error generating website. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Call Claude API
  const callClaudeAPI = async (userPrompt: string) => {
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "claude-3-7-sonnet-20250219",
          max_tokens: 4000,
          messages: [
            {
              role: "system",
              content: `You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS. When given a description of a website, you generate the complete code for it.
              
              Rules:
              1. Generate clean, well-structured code with proper TypeScript typing
              2. Use Tailwind CSS for all styling
              3. Create responsive designs that work on mobile, tablet, and desktop
              4. Break down your solution into multiple files/components
              5. Format your response with code blocks using the triple backtick syntax and language specifier
              6. Include file names at the top of each code block like: \`\`\`tsx src/components/Header.tsx
              7. Focus on creating beautiful, professional UI with attention to detail
              8. Include comments to explain complex parts of the code
              9. If creating a complex component, break it down into smaller sub-components`
            },
            {
              role: "user",
              content: `Create the code for: ${userPrompt}
              
              Please provide all necessary files to implement this.`
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw new Error('Failed to communicate with AI service');
    }
  };

  // Format code for display
  const formatCodeForDisplay = (code: string) => {
    return code
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  // Download all files as zip
  const downloadFiles = () => {
    if (generatedFiles.length === 0) {
      toast.error('No files to download');
      return;
    }

    try {
      // This would be replaced with actual zip functionality in a production environment
      const content = generatedFiles.map(file => `/* ${file.path} */\n${file.content}`).join('\n\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'website-code.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Files downloaded');
    } catch (error) {
      toast.error('Error downloading files');
    }
  };

  // Simple website preview component
  const WebsitePreview = () => {
    if (generatedFiles.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
            <Play className="h-6 w-6 text-amber-800 dark:text-amber-300" />
          </div>
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-2">
            No Preview Available
          </h2>
          <p className="text-amber-700 dark:text-amber-400 max-w-md">
            Enter a prompt and click "Generate Website" to create your custom website code.
          </p>
        </div>
      );
    }
    
    // Find HTML or JSX files to render
    const mainFile = generatedFiles.find(file => file.path.includes('App.tsx') || file.path.includes('index.tsx')) || generatedFiles[0];
    
    return (
      <div className={`h-full w-full overflow-auto transition-all duration-300 ${
        viewportSize === 'mobile' ? 'max-w-[320px] mx-auto' : 
        viewportSize === 'tablet' ? 'max-w-[768px] mx-auto' : 
        'w-full'
      }`}>
        <iframe 
          className="w-full h-full border-0"
          title="preview"
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                  body { font-family: system-ui, sans-serif; margin: 0; padding: 0; }
                </style>
              </head>
              <body>
                <div id="root" class="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 p-6">
                  <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-amber-900/20">
                    <h2 class="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-4">Preview</h2>
                    <p class="text-amber-700 dark:text-amber-400">
                      This is a simplified preview. In a production environment, this would render the actual generated React components.
                    </p>
                    <div class="mt-6 p-4 bg-amber-50 dark:bg-gray-900 rounded-lg border border-amber-200 dark:border-amber-900/20">
                      <pre class="whitespace-pre-wrap text-sm font-mono text-amber-800 dark:text-amber-300">${mainFile?.path || 'No file selected'}</pre>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `}
          sandbox="allow-scripts"
        />
      </div>
    );
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel: Chat & Input */}
      <div className="flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-amber-200 dark:border-amber-900/20 overflow-hidden">
        <div className="p-4 border-b border-amber-200 dark:border-amber-900/20 bg-amber-50 dark:bg-gray-900">
          <h1 className="text-xl font-bold text-amber-900 dark:text-amber-300 flex items-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 10 }}
              className="mr-2"
            >
              ✨
            </motion.div>
            Blossom AI Website Builder
          </h1>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Describe the website you want to create, and our AI will generate it for you.
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-amber-50/30 dark:bg-gray-900/30">
          {conversation.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-700 dark:to-amber-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Code className="h-8 w-8 text-amber-900 dark:text-amber-100" />
              </div>
              <h2 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-2">
                Start Building Your Website
              </h2>
              <p className="text-amber-700 dark:text-amber-400 max-w-md mb-6">
                Describe what kind of website you want to create, and our AI will generate the code for you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
                <Button 
                  variant="outline" 
                  className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                  onClick={() => setPrompt("Create a modern landing page for a coffee shop with a hero section, menu highlights, and contact form.")}
                >
                  Coffee Shop Website
                </Button>
                <Button 
                  variant="outline"
                  className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                  onClick={() => setPrompt("Build a professional portfolio website with a hero section, project gallery, about me, and contact form.")}
                >
                  Portfolio Website
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {conversation.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-900/20'
                    }`}
                  >
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                      {message.role === 'user' ? (
                        <p>{message.content}</p>
                      ) : (
                        <div>
                          <p className="mb-2 font-medium text-amber-900 dark:text-amber-300">Blossom AI</p>
                          <p>
                            I've created {extractCodeFromResponse(message.content).length} files for your website. 
                            Check the preview tab to see how it looks!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-amber-200 dark:border-amber-900/20 p-4 bg-white dark:bg-gray-900">
          <form onSubmit={handleSubmitPrompt} className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="min-h-[100px] resize-none focus:border-amber-500 border-amber-200 dark:border-amber-900/20 dark:bg-gray-800"
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white"
              >
                {isLoading ? (
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
          </form>
        </div>
      </div>

      {/* Right Panel: Preview & Code */}
      <div className="flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-amber-200 dark:border-amber-900/20 overflow-hidden">
        <div className="border-b border-amber-200 dark:border-amber-900/20 bg-amber-50 dark:bg-gray-900">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center px-4 py-3">
              <TabsList className="bg-amber-100 dark:bg-gray-800">
                <TabsTrigger value="preview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                  <Play className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                {activeTab === 'preview' && (
                  <div className="flex border border-amber-200 dark:border-amber-900/20 rounded-md bg-white dark:bg-gray-800 p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`px-2 ${viewportSize === 'desktop' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-900 dark:text-amber-300' : 'text-gray-600 dark:text-gray-400'}`}
                      onClick={() => setViewportSize('desktop')}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`px-2 ${viewportSize === 'tablet' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-900 dark:text-amber-300' : 'text-gray-600 dark:text-gray-400'}`}
                      onClick={() => setViewportSize('tablet')}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`px-2 ${viewportSize === 'mobile' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-900 dark:text-amber-300' : 'text-gray-600 dark:text-gray-400'}`}
                      onClick={() => setViewportSize('mobile')}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {activeTab === 'code' && generatedFiles.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                    onClick={downloadFiles}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Code
                  </Button>
                )}
              </div>
            </div>
          </Tabs>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab}>
            <TabsContent value="preview" className="h-full">
              <WebsitePreview />
            </TabsContent>
            
            <TabsContent value="code" className="h-full p-4 overflow-auto">
              {generatedFiles.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-amber-800 dark:text-amber-300" />
                  </div>
                  <h2 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-2">
                    No Code Generated Yet
                  </h2>
                  <p className="text-amber-700 dark:text-amber-400 max-w-md">
                    Enter a prompt and click "Generate Website" to create your custom website code.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-300">
                      Generated Files ({generatedFiles.length})
                    </h2>
                  </div>
                  
                  {generatedFiles.map((file, index) => (
                    <Card key={index} className="overflow-hidden border-amber-200 dark:border-amber-900/20">
                      <div className="bg-amber-50 dark:bg-gray-800 px-4 py-2 border-b border-amber-200 dark:border-amber-900/20 flex justify-between items-center">
                        <span className="font-mono text-sm text-amber-900 dark:text-amber-300">
                          {file.path}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(file.content);
                            toast.success(`Copied ${file.path}`);
                          }}
                          className="text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="p-4 overflow-x-auto bg-gray-50 dark:bg-gray-900 text-sm font-mono">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: formatCodeForDisplay(file.content),
                          }}
                        />
                      </pre>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
