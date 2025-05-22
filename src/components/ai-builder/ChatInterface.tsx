
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface ChatInterfaceProps {
  onSendPrompt: (prompt: string) => Promise<void>;
  isLoading: boolean;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    files?: Array<{path: string, content: string}>;
  }>;
}

export default function ChatInterface({
  onSendPrompt,
  isLoading,
  messages
}: ChatInterfaceProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    try {
      await onSendPrompt(prompt);
      setPrompt('');
    } catch (error) {
      console.error('Error sending prompt:', error);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-medium">AI Website Builder</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Describe what you want to build and I'll generate the code for you
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <Card 
                key={message.id} 
                className={`p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary/10 border-primary/20' 
                    : 'bg-muted/50'
                }`}
              >
                <div className="text-sm">
                  <div className="font-medium mb-1">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Generated {message.files.length} file(s):
                      </div>
                      <ul className="text-xs text-muted-foreground list-disc list-inside">
                        {message.files.map((file, index) => (
                          <li key={index}>{file.path}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex flex-col space-y-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the website you want to build..."
            className="resize-none min-h-[100px]"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !prompt.trim()}
            className="self-end"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> 
                Send
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
