
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Code, Upload, Send } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ChatMessages from './ChatMessages';
import FileExplorer, { FileSystemItem } from './FileExplorer';
import MonacoEditor from './MonacoEditor';
import { buildFileTree, createNewFile } from '@/utils/fileSystem';
import CodePreview from './ai-builder/CodePreview';
import { detectProjectType } from './ai-builder/utils';
import { ProjectFiles } from './ai-builder/types';
import { v4 as uuidv4 } from 'uuid';

// Define types for our AI response
interface FileEdit {
  file: string;
  action: 'replace' | 'create' | 'delete';
  content: string;
}

interface AIResponse {
  edits: FileEdit[];
  message: string;
  npmChanges?: string[];
}

export default function AIWebBuilder() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; edits?: FileEdit[]; npmChanges?: string[] }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectId, setProjectId] = useState<string>(uuidv4());
  const [projectName, setProjectName] = useState<string>("Nieuw Project");
  
  // File system state
  const [files, setFiles] = useState<Record<string, string>>({
    'src/App.tsx': 'import React from "react";\n\nexport default function App() {\n  return (\n    <div className="p-4">\n      <h1 className="text-2xl font-bold text-blue-600">Hello World</h1>\n      <p className="mt-2">Start building your app by describing it to the AI.</p>\n    </div>\n  );\n}',
    'src/index.tsx': 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\nimport "./styles/tailwind.css";\n\nReactDOM.createRoot(document.getElementById("root")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n);',
    'src/styles/tailwind.css': '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
  });
  
  const [fileTree, setFileTree] = useState<FileSystemItem[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>('src/App.tsx');
  const [openFiles, setOpenFiles] = useState<string[]>(['src/App.tsx']);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>({});
  const [viewportSize, setViewportSize] = useState('desktop');
  const [detectedType, setDetectedType] = useState<string | null>('react');
  const [runtimeError, setRuntimeError] = useState<{ message: string; file?: string } | null>(null);
  
  // Update project files when files change
  useEffect(() => {
    const formattedFiles: ProjectFiles = {};
    Object.entries(files).forEach(([path, content]) => {
      formattedFiles[path] = { code: content };
    });
    setProjectFiles(formattedFiles);
    
    // Detect project type
    const type = detectProjectType(formattedFiles);
    setDetectedType(type);
  }, [files]);

  // Update file tree when files change
  useEffect(() => {
    const tree = buildFileTree(files);
    setFileTree(tree);
  }, [files]);

  const handleFileSelect = (path: string) => {
    setActiveFile(path);
    
    // Add to open files if not already open
    if (!openFiles.includes(path)) {
      setOpenFiles(prev => [...prev, path]);
    }
  };

  const handleTabChange = (path: string) => {
    setActiveFile(path);
  };
  
  const handleTabClose = (path: string) => {
    // Remove from open files
    const newOpenFiles = openFiles.filter(file => file !== path);
    setOpenFiles(newOpenFiles);
    
    // Set a new active file if the closed one was active
    if (activeFile === path && newOpenFiles.length > 0) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1]);
    } else if (newOpenFiles.length === 0) {
      setActiveFile(null);
    }
  };

  const handleContentChange = (path: string, content: string) => {
    setFiles(prev => ({
      ...prev,
      [path]: content
    }));
  };
  
  const handleProjectFilesChange = (newProjectFiles: ProjectFiles) => {
    // Update the files state from the editor
    const newFiles: Record<string, string> = {};
    Object.entries(newProjectFiles).forEach(([path, { code }]) => {
      newFiles[path] = code;
    });
    setFiles(newFiles);
  };

  const handleRuntimeError = (error: { message: string; file?: string } | null) => {
    setRuntimeError(error);
  };

  const handleFixError = async () => {
    if (!runtimeError) return;
    
    const errorFile = runtimeError.file || '';
    const errorMessage = runtimeError.message || '';
    
    // Automatically generate a prompt to fix the error
    const fixPrompt = `Fix deze fout in ${errorFile}: ${errorMessage}. Alleen deze file aanpassen, geen andere bestanden wijzigen.`;
    
    // Add the prompt to messages
    const userMessage = { role: 'user' as const, content: fixPrompt };
    setMessages(prev => [...prev, userMessage]);
    
    // Auto-submit this prompt
    await processPrompt(fixPrompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    await processPrompt(prompt);
  };
  
  const processPrompt = async (promptText: string) => {
    // Add user message
    const userMessage = { role: 'user' as const, content: promptText };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input if this was from the input field
    if (prompt === promptText) {
      setPrompt('');
    }
    
    // Call AI service
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call your AI service
      // For demonstration, we'll simulate the AI response
      const aiResponse = await callAIModel(promptText);
      
      // Process file edits
      if (aiResponse.edits && aiResponse.edits.length > 0) {
        const updatedFiles = { ...files };
        
        // Apply each edit to the files
        aiResponse.edits.forEach(edit => {
          if (edit.action === 'replace' || edit.action === 'create') {
            updatedFiles[edit.file] = edit.content;
          } else if (edit.action === 'delete') {
            delete updatedFiles[edit.file];
          }
        });
        
        // Update files state
        setFiles(updatedFiles);
      }
      
      // Add AI message with edits info
      const aiMessage = { 
        role: 'assistant' as const,
        content: aiResponse.message,
        edits: aiResponse.edits,
        npmChanges: aiResponse.npmChanges
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Show success notification
      toast.success("Changes applied successfully");
      
      // Switch to preview tab to show changes
      setActiveTab('preview');
    } catch (error) {
      console.error('Error calling AI:', error);
      toast.error("Failed to generate response");
      
      // Add error message
      const errorMessage = { 
        role: 'assistant' as const, 
        content: `Sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Simulated AI model call
  const callAIModel = async (userPrompt: string): Promise<AIResponse> => {
    // This is a placeholder for the actual API call
    // In a real implementation, you would call Gemini or Claude here
    
    try {
      // In a real implementation, this would integrate with the Gemini provider
      // For now, just simulate a response with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate a response based on the prompt
      if (userPrompt.toLowerCase().includes('hero')) {
        return {
          edits: [
            { 
              file: "src/components/Hero.tsx", 
              action: "create", 
              content: "import React from 'react';\n\nexport default function Hero() {\n  return (\n    <div className=\"bg-blue-50 py-16\">\n      <div className=\"container mx-auto px-4\">\n        <h1 className=\"text-4xl font-bold text-center text-blue-900\">Welcome to Our Platform</h1>\n        <p className=\"mt-4 text-xl text-center text-blue-600\">The future of web development is here</p>\n        <div className=\"mt-8 flex justify-center\">\n          <button className=\"bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition\">Get Started</button>\n        </div>\n      </div>\n    </div>\n  );\n}"
            },
            {
              file: "src/App.tsx",
              action: "replace",
              content: "import React from 'react';\nimport Hero from './components/Hero';\n\nexport default function App() {\n  return (\n    <div>\n      <Hero />\n      <div className=\"container mx-auto px-4 py-8\">\n        <h2 className=\"text-2xl font-semibold mb-4\">Features</h2>\n        <p>Our platform offers amazing features...</p>\n      </div>\n    </div>\n  );\n}"
            }
          ],
          message: "✅ Created a Hero component and updated App.tsx to use it"
        };
      } else if (userPrompt.toLowerCase().includes('button')) {
        return {
          edits: [
            { 
              file: "src/components/Button.tsx", 
              action: "create", 
              content: "import React from 'react';\n\ninterface ButtonProps {\n  children: React.ReactNode;\n  variant?: 'primary' | 'secondary' | 'outline';\n  size?: 'sm' | 'md' | 'lg';\n  onClick?: () => void;\n}\n\nexport default function Button({ children, variant = 'primary', size = 'md', onClick }: ButtonProps) {\n  const baseClasses = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';\n  \n  const variantClasses = {\n    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',\n    secondary: 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-300',\n    outline: 'bg-transparent border border-blue-300 text-blue-700 hover:bg-blue-50 focus:ring-blue-300',\n  };\n  \n  const sizeClasses = {\n    sm: 'px-3 py-1.5 text-sm',\n    md: 'px-4 py-2 text-base',\n    lg: 'px-6 py-3 text-lg',\n  };\n  \n  return (\n    <button\n      onClick={onClick}\n      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}\n    >\n      {children}\n    </button>\n  );\n}" 
            },
            {
              file: "src/App.tsx",
              action: "replace",
              content: "import React from 'react';\nimport Button from './components/Button';\n\nexport default function App() {\n  return (\n    <div className=\"p-8\">\n      <h1 className=\"text-2xl font-bold mb-6\">Button Component Demo</h1>\n      <div className=\"space-y-4\">\n        <div className=\"flex space-x-4\">\n          <Button variant=\"primary\">Primary Button</Button>\n          <Button variant=\"secondary\">Secondary Button</Button>\n          <Button variant=\"outline\">Outline Button</Button>\n        </div>\n        <div className=\"flex space-x-4\">\n          <Button size=\"sm\">Small Button</Button>\n          <Button size=\"md\">Medium Button</Button>\n          <Button size=\"lg\">Large Button</Button>\n        </div>\n      </div>\n    </div>\n  );\n}"
            }
          ],
          message: "✅ Created a new Button.tsx component with multiple variants and sizes and updated App.tsx",
          npmChanges: []
        };
      } else {
        return {
          edits: [
            { 
              file: "src/components/Feature.tsx", 
              action: "create", 
              content: "import React from 'react';\n\ninterface FeatureProps {\n  title: string;\n  description: string;\n  icon: React.ReactNode;\n}\n\nexport default function Feature({ title, description, icon }: FeatureProps) {\n  return (\n    <div className=\"p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow\">\n      <div className=\"w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4\">\n        {icon}\n      </div>\n      <h3 className=\"text-xl font-semibold text-gray-900 mb-2\">{title}</h3>\n      <p className=\"text-gray-600\">{description}</p>\n    </div>\n  );\n}"
            },
            {
              file: "src/App.tsx",
              action: "replace",
              content: "import React from 'react';\nimport Feature from './components/Feature';\n\nexport default function App() {\n  // Simulate icons with emoji for simplicity\n  const starIcon = <span className=\"text-xl\">⭐</span>;\n  const lightningIcon = <span className=\"text-xl\">⚡</span>;\n  const diamondIcon = <span className=\"text-xl\">💎</span>;\n\n  return (\n    <div className=\"container mx-auto p-6\">\n      <h1 className=\"text-3xl font-bold text-center mb-10\">Our Amazing Features</h1>\n      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">\n        <Feature \n          icon={starIcon} \n          title=\"Premium Quality\" \n          description=\"Our products are made with the finest materials for durability and comfort.\"\n        />\n        <Feature \n          icon={lightningIcon} \n          title=\"Fast Delivery\" \n          description=\"We offer quick and reliable shipping to get your items to you as soon as possible.\"\n        />\n        <Feature \n          icon={diamondIcon} \n          title=\"Best Value\" \n          description=\"Competitive pricing without compromising on quality, giving you the best value.\"\n        />\n      </div>\n    </div>\n  );\n}"
            }
          ],
          message: "✅ Created Feature.tsx component for showcasing product features and updated App.tsx",
          npmChanges: []
        };
      }
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Chat section (left ~25%) */}
      <div className="w-1/4 flex flex-col border-r border-border">
        {/* Chat header */}
        <div className="p-3 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{projectName}</h3>
            <span className="text-xs text-muted-foreground">Project ID: {projectId.substring(0, 6)}</span>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading} 
          />
        </div>
        
        {/* Input section */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Beschrijf de website die je wilt bouwen..."
              className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500"
              disabled={isLoading}
            />
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Upload className="w-4 h-4" />
                Upload Files
              </Button>
              <Button 
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={!prompt.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Genereren...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Genereren
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* File explorer (middle) */}
      <div className="w-1/6 flex flex-col">
        <FileExplorer 
          files={fileTree} 
          activeFile={activeFile}
          onFileSelect={handleFileSelect}
        />
      </div>
      
      {/* Code Editor / Preview section */}
      <div className="w-7/12 flex flex-col">
        {/* Tab controls */}
        <div className="border-b border-border p-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'code')}>
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger 
                value="preview" 
                className={activeTab === 'preview' ? 'bg-primary/20' : ''}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="code" 
                className={activeTab === 'code' ? 'bg-primary/20' : ''}
              >
                <Code className="h-4 w-4 mr-2" />
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="preview" className="mt-0 h-full">
              <CodePreview 
                projectFiles={projectFiles}
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                activeFile={activeFile || ''}
                viewportSize={viewportSize}
                setViewportSize={setViewportSize}
                detectedType={detectedType}
                onDetectError={handleRuntimeError}
              />
            </TabsContent>
            <TabsContent value="code" className="mt-0 h-full">
              <MonacoEditor 
                files={files} 
                activeFile={activeFile}
                onContentChange={handleContentChange}
                openFiles={openFiles}
                onTabChange={handleTabChange}
                onTabClose={handleTabClose}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Show runtime error at the bottom of the page */}
        {runtimeError && (
          <div className="p-2 bg-red-50 border-t border-red-200">
            <ErrorDetectionHandler 
              error={runtimeError}
              onFixError={handleFixError}
              onIgnoreError={() => setRuntimeError(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
