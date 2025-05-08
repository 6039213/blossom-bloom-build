
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Code, Terminal, FileCode, Folder, Monitor, RefreshCw, Sparkles, Send, Smartphone, Tablet, Download, Upload, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import AIResponseDisplay, { ChatMessage } from '@/components/dashboard/AIResponseDisplay';
import AIPromptInput from '@/components/dashboard/AIPromptInput';
import MonacoEditor from '@/components/ai-builder/MonacoEditor';
import FileExplorer from '@/components/ai-builder/FileExplorer';
import LivePreview from '@/components/ai-builder/LivePreview';
import { parseAiResponse } from '@/utils/codeGeneration';
import { v4 as uuidv4 } from 'uuid';

interface WebsiteFile {
  path: string;
  content: string;
  type: string;
}

export default function EnhancedAIWebBuilder() {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<WebsiteFile[]>([]);
  const [filesMap, setFilesMap] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const webContainerRef = useRef<any>(null);
  
  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content: 'Welcome to Blossom AI Web Builder! Describe the website you want to build, and I\'ll help you create it.',
        createdAt: new Date(),
      }
    ]);
  }, []);

  const handleViewportChange = (size: 'desktop' | 'tablet' | 'mobile') => {
    setViewportSize(size);
  };

  const handleFileSelect = (path: string) => {
    setActiveFile(path);
    if (!openFiles.includes(path)) {
      setOpenFiles([...openFiles, path]);
    }
  };

  const handleTabClose = (path: string) => {
    setOpenFiles(openFiles.filter(file => file !== path));
    if (activeFile === path) {
      setActiveFile(openFiles.find(file => file !== path) || null);
    }
  };

  const handleCodeChange = (path: string, content: string) => {
    // Update files array
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.path === path ? { ...file, content } : file
      )
    );
    
    // Update files map
    setFilesMap(prevMap => ({
      ...prevMap,
      [path]: content
    }));

    // Update WebContainer file if it's initialized
    if (webContainerRef.current) {
      try {
        const dirPath = path.substring(0, path.lastIndexOf('/'));
        if (dirPath) {
          webContainerRef.current.fs.mkdir(dirPath, { recursive: true })
            .then(() => webContainerRef.current.fs.writeFile(path, content))
            .then(() => console.log(`File ${path} updated in WebContainer`))
            .catch((error: any) => console.error(`Error updating file in WebContainer: ${error}`));
        } else {
          webContainerRef.current.fs.writeFile(path, content)
            .then(() => console.log(`File ${path} updated in WebContainer`))
            .catch((error: any) => console.error(`Error updating file in WebContainer: ${error}`));
        }
      } catch (error) {
        console.error('Error updating file in WebContainer:', error);
      }
    }
  };

  const handleGenerateCode = async (userPrompt: string) => {
    try {
      setIsGenerating(true);

      // Add user message to chat
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: userPrompt,
        createdAt: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Create an assistant message with streaming state
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        isStreaming: true,
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);

      // Call Claude API through our proxy
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userPrompt,
          system: "You are an expert web developer who creates beautiful, modern React + Tailwind webapps. Return code as markdown code blocks with filename headers.",
          temperature: 0.7,
          max_tokens: 4000,
          files: filesMap
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      let responseText = '';
      if (data.content) {
        responseText = data.content;
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Unexpected response format from Claude API");
      }

      // Update the assistant message with the response
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: responseText, isStreaming: false } 
            : msg
        )
      );

      // Parse the response and extract code blocks
      const { files: extractedFiles } = parseAiResponse(responseText);
      
      // Convert the extracted files to WebsiteFile[]
      const newWebsiteFiles: WebsiteFile[] = Object.entries(extractedFiles).map(([path, content]) => ({
        path,
        content,
        type: path.split('.').pop() || 'text'
      }));
      
      // Update files map
      const newFilesMap = { ...filesMap };
      newWebsiteFiles.forEach(file => {
        newFilesMap[file.path] = file.content;
      });
      setFilesMap(newFilesMap);

      // Update files array - merge with existing files
      setFiles(prevFiles => {
        const updatedFiles = [...prevFiles];
        
        newWebsiteFiles.forEach(newFile => {
          const existingFileIndex = updatedFiles.findIndex(file => file.path === newFile.path);
          if (existingFileIndex >= 0) {
            updatedFiles[existingFileIndex] = newFile;
          } else {
            updatedFiles.push(newFile);
          }
        });
        
        return updatedFiles;
      });

      // Update WebContainer with new files
      if (webContainerRef.current) {
        for (const file of newWebsiteFiles) {
          try {
            const dirPath = file.path.substring(0, file.path.lastIndexOf('/'));
            if (dirPath) {
              await webContainerRef.current.fs.mkdir(dirPath, { recursive: true });
            }
            await webContainerRef.current.fs.writeFile(file.path, file.content);
            console.log(`File ${file.path} created in WebContainer`);
          } catch (error) {
            console.error(`Error creating file ${file.path} in WebContainer:`, error);
          }
        }
        
        // Check if we need to install dependencies
        const hasPackageJson = newWebsiteFiles.some(file => file.path.includes('package.json'));
        if (hasPackageJson) {
          try {
            setTerminalOutput(prev => prev + "\nInstalling dependencies...\n");
            const installProcess = await webContainerRef.current.spawn('npm', ['install']);
            installProcess.output.pipeTo(new WritableStream({
              write(data) {
                setTerminalOutput(prev => prev + data);
              }
            }));
            
            setTerminalOutput(prev => prev + "\nStarting development server...\n");
            const devProcess = await webContainerRef.current.spawn('npm', ['run', 'dev']);
            devProcess.output.pipeTo(new WritableStream({
              write(data) {
                setTerminalOutput(prev => prev + data);
              }
            }));
          } catch (error) {
            console.error('Error in WebContainer operations:', error);
            setTerminalOutput(prev => prev + `\nError: ${error.message}\n`);
          }
        }
      }

      toast.success('Website code generated successfully!');
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error(`Failed to generate website code: ${error.message}`);
      
      // Update the last message to show the error
      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage.role === 'assistant' && lastMessage.isStreaming) {
          return prevMessages.map(msg => 
            msg.id === lastMessage.id 
              ? { ...msg, content: `Error: ${error.message}`, isStreaming: false } 
              : msg
          );
        }
        return prevMessages;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Initialize WebContainer when the component mounts
    const initWebContainer = async () => {
      try {
        // Import WebContainer dynamically
        const { WebContainer } = await import('@webcontainer/api');
        
        // Boot the WebContainer
        const webcontainer = await WebContainer.boot();
        webContainerRef.current = webcontainer;
        
        setTerminalOutput("WebContainer initialized. Ready to build your web application!\n");
        
        // Create a basic structure for the WebContainer
        await webcontainer.mount({
          'index.html': {
            file: {
              contents: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Blossom AI Builder</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root">
      <div class="flex items-center justify-center h-screen bg-gradient-to-r from-blossom-100 to-blossom-50">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-blossom-800">Blossom AI Web Builder</h1>
          <p class="mt-2 text-blossom-600">Describe your website and let AI build it for you!</p>
        </div>
      </div>
    </div>
  </body>
</html>
              `,
            },
          },
          'package.json': {
            file: {
              contents: `
{
  "name": "blossom-ai-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
              `,
            },
          },
        });
        
        // Set up the terminal for the WebContainer
        const install = await webcontainer.spawn('npm', ['install']);
        install.output.pipeTo(new WritableStream({
          write(data) {
            setTerminalOutput(prev => prev + data);
          }
        }));
        
        // Wait for install to complete
        await install.exit;
        
        // Start the dev server
        const dev = await webcontainer.spawn('npm', ['run', 'dev']);
        dev.output.pipeTo(new WritableStream({
          write(data) {
            setTerminalOutput(prev => prev + data);
          }
        }));
        
        // Wait for server URL to be ready
        webcontainer.on('server-ready', (port, url) => {
          console.log('Server ready at:', url);
        });
        
      } catch (error) {
        console.error('Failed to initialize WebContainer:', error);
        setTerminalOutput(`Error initializing WebContainer: ${error.message}\n`);
        toast.error(`WebContainer initialization failed: ${error.message}`);
      }
    };

    initWebContainer();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b p-4 bg-white flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-blossom-500 mr-2" />
          <h1 className="font-bold text-xl text-gray-800">Blossom AI Web Builder</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1" /> Import
          </Button>
          <Button className="bg-blossom-500 hover:bg-blossom-600 text-white">
            <Sparkles className="h-4 w-4 mr-1" /> Deploy
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane - Chat */}
        <div className="w-1/3 flex flex-col border-r">
          <div className="flex-1 overflow-y-auto">
            <AIResponseDisplay messages={messages} isLoading={isGenerating} />
          </div>
          <div className="border-t p-4 bg-white">
            <AIPromptInput 
              onSubmit={handleGenerateCode} 
              isProcessing={isGenerating} 
            />
          </div>
        </div>

        {/* Right Pane - Editor and Preview */}
        <div className="flex-1 flex flex-col">
          {/* Editor Section */}
          <div className="flex h-1/2 border-b overflow-hidden">
            {/* File Explorer */}
            <div className="w-1/4 border-r overflow-y-auto">
              <div className="p-2 border-b bg-gray-50">
                <h3 className="font-medium text-sm text-gray-700">Files</h3>
              </div>
              <FileExplorer 
                files={files}
                activeFile={activeFile}
                onFileSelect={handleFileSelect}
              />
            </div>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              {openFiles.length > 0 ? (
                <MonacoEditor 
                  files={Object.fromEntries(files.map(file => [file.path, file.content]))}
                  activeFile={activeFile}
                  onContentChange={handleCodeChange}
                  openFiles={openFiles}
                  onTabChange={handleFileSelect}
                  onTabClose={handleTabClose}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No file selected. Click on a file in the explorer to edit.
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex-1 flex overflow-hidden">
            <Tabs defaultValue="preview" className="w-full">
              <div className="border-b bg-white px-4">
                <TabsList>
                  <TabsTrigger value="preview" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> Preview
                  </TabsTrigger>
                  <TabsTrigger value="terminal" className="flex items-center gap-1">
                    <Terminal className="h-4 w-4" /> Terminal
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="preview" className="h-full m-0 p-0 border-none">
                <LivePreview 
                  files={files}
                  viewportSize={viewportSize}
                  onViewportChange={handleViewportChange}
                />
              </TabsContent>
              
              <TabsContent value="terminal" className="h-full m-0 p-0 border-none">
                <div className="h-full bg-gray-900 text-gray-200 font-mono text-sm p-4 overflow-auto">
                  <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
