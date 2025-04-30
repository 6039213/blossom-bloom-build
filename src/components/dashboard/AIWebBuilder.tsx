
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Code, Upload, Send } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ChatMessages from './ChatMessages';
import CodePreviewPanel from './CodePreviewPanel';

export default function AIWebBuilder() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: prompt };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setPrompt('');
    
    // Simulate AI response (in a real app, this would call your AI service)
    setIsLoading(true);
    
    // Simulate delay
    setTimeout(() => {
      const aiResponse = { 
        role: 'assistant' as const, 
        content: `I'll create a website based on: "${prompt}"` 
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
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
            />
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Files
              </Button>
              <Button 
                type="submit"
                className="bg-blossom-500 hover:bg-blossom-600 text-white"
                disabled={!prompt.trim() || isLoading}
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Preview/Code section (right ~65%) */}
      <div className="w-2/3 flex flex-col">
        {/* Tab controls */}
        <div className="border-b border-border p-4">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger 
              value="preview" 
              onClick={() => setActiveTab('preview')} 
              className={activeTab === 'preview' ? 'bg-primary/20' : ''}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              onClick={() => setActiveTab('code')} 
              className={activeTab === 'code' ? 'bg-primary/20' : ''}
            >
              <Code className="h-4 w-4 mr-2" />
              Code
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <CodePreviewPanel activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
