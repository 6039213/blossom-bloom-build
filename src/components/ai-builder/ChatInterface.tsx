
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { FileContent } from '@/lib/services/anthropicService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  files?: Array<{path: string, content: string}>;
}

interface ChatInterfaceProps {
  onSendPrompt: (prompt: string, existingFiles?: FileContent[]) => Promise<void>;
  isLoading: boolean;
  messages: Message[];
}

export default function ChatInterface({ onSendPrompt, isLoading, messages }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const prompt = input.trim();
    setInput('');
    
    await onSendPrompt(prompt);
  };

  const samplePrompts = [
    "Create a modern landing page for a coffee shop",
    "Build a portfolio website with dark theme",
    "Design a dashboard with charts and analytics",
    "Create a blog with featured posts section"
  ];

  return (
    <div className="h-full flex flex-col bg-white border rounded-lg">
      <div className="p-4 border-b">
        <h2 className="font-semibold">AI Assistant</h2>
        <p className="text-sm text-gray-600">Describe what you want to build</p>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center space-y-4">
            <div className="text-gray-500 mb-4">
              <Bot className="h-12 w-12 mx-auto mb-2 text-blue-500" />
              <p>Hello! I'm your AI assistant.</p>
              <p className="text-sm">Try one of these prompts to get started:</p>
            </div>
            
            <div className="space-y-2">
              {samplePrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left h-auto p-3 text-sm"
                  onClick={() => setInput(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <User className="h-6 w-6 text-blue-600" />
                  ) : (
                    <Bot className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <Card className="flex-1">
                  <CardContent className="p-3">
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    {message.files && message.files.length > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-1">
                          Generated {message.files.length} files:
                        </p>
                        <div className="space-y-1">
                          {message.files.map((file, index) => (
                            <div key={index} className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                              {file.path}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <Bot className="h-6 w-6 text-green-600 flex-shrink-0" />
                <Card className="flex-1">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-500">Generating your website...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 min-h-[60px] max-h-[120px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
