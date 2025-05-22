
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { FileContent } from '@/lib/services/claudeService';

interface ChatInterfaceProps {
  onSendPrompt: (prompt: string, existingFiles?: FileContent[]) => Promise<void>;
  isLoading: boolean;
  messages?: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    files?: Array<{path: string, content: string}>;
  }>;
  onSendMessage?: (content: string) => Promise<void>;
  onSendFiles?: (files: File[]) => Promise<void>;
  isProcessing?: boolean;
  onApplyChanges?: (messageId: string) => Promise<void>;
}

export default function ChatInterface({ 
  onSendPrompt,
  isLoading,
  messages = [],
  onSendMessage,
  onSendFiles,
  isProcessing,
  onApplyChanges
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() && uploadedFiles.length === 0) {
      toast.error("Please enter a message or upload files");
      return;
    }
    
    try {
      // If there's a message, send it using the provided function
      if (input.trim()) {
        if (onSendPrompt) {
          await onSendPrompt(input);
        } else if (onSendMessage) {
          await onSendMessage(input);
        }
        setInput('');
      }
      
      // If there are files and a handler is provided, send them
      if (uploadedFiles.length > 0 && onSendFiles) {
        await onSendFiles(uploadedFiles);
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Welcome to Blossom AI Builder</h2>
            <p className="text-muted-foreground mb-6">
              Describe what you want to build, and I'll generate code for you.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-lg p-4 ${
                  message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
                }`}
              >
                {message.content}
                
                {/* Display file attachments if any */}
                {message.files && message.files.length > 0 && (
                  <div className="mt-3 border-t pt-2">
                    <p className="text-xs font-medium mb-2">Files:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.files.map((file, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs bg-background p-1 px-2 rounded">
                          <span>{file.path.split('/').pop()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {(isLoading || isProcessing) && (
          <div className="flex justify-start mb-4">
            <div className="bg-muted rounded-lg p-4 max-w-[85%]">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        {/* Input Field */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to build something..."
            className="pr-20 resize-none min-h-[80px] max-h-[300px]"
            disabled={isLoading || isProcessing}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading || isProcessing}
            >
              {isLoading || isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          <p>
            Press Enter to send. Shift+Enter for new line.
          </p>
        </div>
      </form>
    </div>
  );
}
