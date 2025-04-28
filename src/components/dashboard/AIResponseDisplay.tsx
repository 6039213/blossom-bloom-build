
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Sparkles, User, Code, FileCode } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  isStreaming?: boolean;
  codeFiles?: {
    path: string;
    content: string;
  }[];
}

interface AIResponseDisplayProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export default function AIResponseDisplay({ messages, isLoading }: AIResponseDisplayProps) {
  return (
    <div className="flex flex-col space-y-4 overflow-y-auto p-4">
      {messages.map((message) => (
        <Card 
          key={message.id} 
          className={`p-4 ${
            message.role === 'user' 
              ? 'bg-muted/50 border border-muted' 
              : 'bg-background border border-blossom-200'
          }`}
        >
          <div className="flex items-start">
            <div className="mr-4">
              {message.role === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-blossom-100 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-blossom-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">
                {message.role === 'user' ? 'You' : 'Blossom AI'}
                <span className="text-xs text-muted-foreground ml-2">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
              
              <div className={`prose prose-sm max-w-none ${message.isStreaming ? 'animate-pulse' : ''}`}>
                {message.content.split('```').map((part, i) => {
                  if (i % 2 === 0) {
                    return <p key={i} className="whitespace-pre-wrap">{part}</p>;
                  } else {
                    const codeType = part.split('\n')[0];
                    const code = part.substring(codeType.length + 1);
                    return (
                      <pre key={i} className="bg-muted p-2 rounded overflow-x-auto">
                        <div className="flex items-center text-xs text-muted-foreground mb-1">
                          <Code className="h-3 w-3 mr-1" />
                          <span>{codeType || 'code'}</span>
                        </div>
                        <code>{code}</code>
                      </pre>
                    );
                  }
                })}
              </div>
              
              {message.codeFiles && message.codeFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium">Modified Files:</div>
                  {message.codeFiles.map((file) => (
                    <div key={file.path} className="text-xs bg-muted p-2 rounded flex items-center">
                      <FileCode className="h-3 w-3 mr-2" />
                      <span>{file.path}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
      
      {isLoading && (
        <Card className="p-4 border border-blossom-200">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="w-8 h-8 rounded-full bg-blossom-100 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-blossom-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">
                Blossom AI
              </div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </Card>
      )}
      
      {messages.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-blossom-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-5 w-5 text-blossom-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Welcome to Blossom AI Builder</h3>
          <p className="text-muted-foreground text-sm">
            Enter a prompt to generate a website with AI assistance.
          </p>
        </div>
      )}
    </div>
  );
}
