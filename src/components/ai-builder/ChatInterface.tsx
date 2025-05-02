
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X, Upload, Loader2, ImagePlus, FileText, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import { ChatMessage } from '@/types/project';
import { uploadFile, getUploadedFile, formatCodeForDisplay, getLanguageFromFilePath, extractCodeFilesFromResponse } from '@/utils/fileUtils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => Promise<void>;
  onSendFiles: (files: File[]) => Promise<void>;
  isProcessing: boolean;
  onApplyChanges?: (messageId: string) => Promise<void>;
}

export default function ChatInterface({ 
  messages, 
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
      // If there are files, send them first
      if (uploadedFiles.length > 0) {
        await onSendFiles(uploadedFiles);
        setUploadedFiles([]);
      }
      
      // If there's a message, send it
      if (input.trim()) {
        await onSendMessage(input);
        setInput('');
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
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary-foreground text-primary text-xs">AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="flex-1">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {/* Handle message content with code blocks */}
                      {message.content.split(/```([\s\S]*?)```/).map((part, i) => {
                        if (i % 2 === 0) {
                          return <p key={i} className="whitespace-pre-wrap">{part}</p>;
                        } else {
                          // Extract language if specified in the code block
                          const firstLine = part.split('\n')[0];
                          const language = firstLine.trim();
                          const code = language ? part.substring(language.length + 1) : part;
                          
                          return (
                            <div key={i} className="bg-background rounded-md p-3 my-2">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>{language || 'code'}</span>
                              </div>
                              <pre className="p-0 overflow-x-auto text-xs">
                                <code>{code}</code>
                              </pre>
                            </div>
                          );
                        }
                      })}
                      
                      {/* Display file attachments if any */}
                      {message.files && message.files.length > 0 && (
                        <div className="mt-3 border-t pt-2">
                          <p className="text-xs font-medium mb-2">Files:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.files.map((file, index) => {
                              const isImage = file.path.match(/\.(jpeg|jpg|gif|png|svg)$/i);
                              const icon = isImage ? <ImagePlus size={16} /> : <FileCode size={16} />;
                              
                              return (
                                <div key={index} className="flex items-center gap-1 text-xs bg-background p-1 px-2 rounded">
                                  {icon}
                                  <span>{file.path.split('/').pop()}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* For assistant messages with code files, show apply changes button */}
                      {message.role === 'assistant' && message.files && message.files.length > 0 && onApplyChanges && (
                        <div className="mt-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onApplyChanges(message.id)}
                            className="w-full text-xs"
                          >
                            Apply Changes ({message.files.length} files)
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary-foreground text-primary text-xs">You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isProcessing && (
          <div className="flex justify-start mb-4">
            <div className="bg-muted rounded-lg p-4 max-w-[85%]">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary-foreground text-primary text-xs">AI</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {uploadedFiles.map((file, index) => (
              <div 
                key={index} 
                className="bg-muted text-sm rounded px-2 py-1 flex items-center gap-1"
              >
                {file.type.startsWith('image/') ? (
                  <ImagePlus size={14} className="text-primary" />
                ) : (
                  <FileText size={14} className="text-primary" />
                )}
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveFile(index)}
                  className="ml-1 text-muted-foreground hover:text-primary"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Input Field */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to build something..."
            className="pr-20 resize-none min-h-[80px] max-h-[300px]"
            disabled={isProcessing}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleFileUpload}
              disabled={isProcessing}
            >
              <Upload size={18} />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={(!input.trim() && uploadedFiles.length === 0) || isProcessing}
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        
        <div className="text-xs text-muted-foreground mt-2">
          <p>
            Press Enter to send. Shift+Enter for new line. You can upload files to include in your message.
          </p>
        </div>
      </form>
    </div>
  );
}
