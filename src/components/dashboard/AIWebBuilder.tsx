
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Code, Upload, Send } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ChatMessages from './ChatMessages';
import CodePreviewPanel from './CodePreviewPanel';
import { geminiProvider } from '@/lib/providers/gemini';

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
  const [projectFiles, setProjectFiles] = useState<Record<string, { code: string }>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: prompt };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setPrompt('');
    
    // Call AI service
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call your AI service
      // For demonstration, we'll simulate the AI response
      const aiResponse = await callAIModel(prompt);
      
      // Process file edits
      if (aiResponse.edits && aiResponse.edits.length > 0) {
        const updatedFiles = { ...projectFiles };
        
        // Apply each edit to the files
        aiResponse.edits.forEach(edit => {
          if (edit.action === 'replace' || edit.action === 'create') {
            updatedFiles[edit.file] = { code: edit.content };
          } else if (edit.action === 'delete') {
            delete updatedFiles[edit.file];
          }
        });
        
        // Update project files state
        setProjectFiles(updatedFiles);
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
              action: "replace", 
              content: 'import React from \'react\';\n\nexport default function Hero() {\n  return (\n    <div className="bg-blossom-50 py-16">\n      <div className="container mx-auto px-4">\n        <h1 className="text-4xl font-bold text-center text-blossom-900">Welcome to Our Platform</h1>\n        <p className="mt-4 text-xl text-center text-blossom-600">The future of web development is here</p>\n        <div className="mt-8 flex justify-center">\n          <button className="bg-blossom-500 text-white px-6 py-2 rounded-md hover:bg-blossom-600 transition">Get Started</button>\n        </div>\n      </div>\n    </div>\n  );\n}'
            }
          ],
          message: "✅ Hero.tsx updated with new heading and button styling"
        };
      } else if (userPrompt.toLowerCase().includes('button')) {
        return {
          edits: [
            { 
              file: "src/components/Button.tsx", 
              action: "create", 
              content: 'import React from \'react\';\n\ninterface ButtonProps {\n  children: React.ReactNode;\n  variant?: \'primary\' | \'secondary\' | \'outline\';\n  size?: \'sm\' | \'md\' | \'lg\';\n  onClick?: () => void;\n}\n\nexport default function Button({ children, variant = \'primary\', size = \'md\', onClick }: ButtonProps) {\n  const baseClasses = \'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2\';\n  \n  const variantClasses = {\n    primary: \'bg-blossom-500 text-white hover:bg-blossom-600 focus:ring-blossom-500\',\n    secondary: \'bg-blossom-100 text-blossom-700 hover:bg-blossom-200 focus:ring-blossom-300\',\n    outline: \'bg-transparent border border-blossom-300 text-blossom-700 hover:bg-blossom-50 focus:ring-blossom-300\',\n  };\n  \n  const sizeClasses = {\n    sm: \'px-3 py-1.5 text-sm\',\n    md: \'px-4 py-2 text-base\',\n    lg: \'px-6 py-3 text-lg\',\n  };\n  \n  return (\n    <button\n      onClick={onClick}\n      className={baseClasses + " " + variantClasses[variant] + " " + sizeClasses[size]}\n    >\n      {children}\n    </button>\n  );\n}'
            }
          ],
          message: "✅ Created a new Button.tsx component with multiple variants and sizes",
          npmChanges: []
        };
      } else {
        return {
          edits: [
            { 
              file: "src/components/Feature.tsx", 
              action: "create", 
              content: 'import React from \'react\';\n\ninterface FeatureProps {\n  title: string;\n  description: string;\n  icon: React.ReactNode;\n}\n\nexport default function Feature({ title, description, icon }: FeatureProps) {\n  return (\n    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">\n      <div className="w-12 h-12 bg-blossom-100 rounded-full flex items-center justify-center text-blossom-600 mb-4">\n        {icon}\n      </div>\n      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>\n      <p className="text-gray-600">{description}</p>\n    </div>\n  );\n}'
            }
          ],
          message: "✅ Created Feature.tsx component for showcasing product features",
          npmChanges: ["npm install framer-motion"]
        };
      }
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Chat section (left ~35%) */}
      <div className="w-1/3 flex flex-col border-r border-border">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
        
        {/* Input section */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the website you want to build..."
              className="min-h-[120px] resize-none border-blossom-200 focus:border-blossom-500"
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
                className="bg-blossom-500 hover:bg-blossom-600 text-white"
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
                    Generate
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Preview/Code section (right ~65%) */}
      <div className="w-2/3 flex flex-col">
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
          <CodePreviewPanel activeTab={activeTab} projectFiles={projectFiles} />
        </div>
      </div>
    </div>
  );
}
