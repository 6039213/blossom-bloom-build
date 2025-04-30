
import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Sparkles, User, FileCode, Package } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface FileEdit {
  file: string;
  action: 'replace' | 'create' | 'delete';
  content: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  edits?: FileEdit[];
  npmChanges?: string[];
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex flex-col space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <div className="bg-blossom-100 rounded-full p-3 mb-4">
            <Sparkles className="h-6 w-6 text-blossom-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Welcome to Blossom AI</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Describe what you want to build, and I'll generate a website for you.
          </p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[90%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-blossom-500 text-white rounded-br-none'
                  : 'bg-muted rounded-bl-none'
              }`}
            >
              <div className="flex items-start">
                {message.role === 'assistant' && (
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <Avatar>
                      <div className="bg-blossom-100 h-full w-full rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-blossom-500" />
                      </div>
                    </Avatar>
                  </div>
                )}
                <div>
                  <div className="whitespace-pre-wrap mb-2">{message.content}</div>
                  
                  {message.edits && message.edits.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Modified Files:
                      </h4>
                      {message.edits.map((edit, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-background/80 rounded p-2 text-xs">
                          <FileCode className="h-3.5 w-3.5 text-blossom-500" />
                          <span className="flex-1 font-mono">{edit.file}</span>
                          <Badge 
                            variant={
                              edit.action === 'create' ? 'default' : 
                              edit.action === 'replace' ? 'outline' : 
                              'destructive'
                            }
                            className="text-[10px] px-1.5 py-0"
                          >
                            {edit.action}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {message.npmChanges && message.npmChanges.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Package Changes:
                      </h4>
                      {message.npmChanges.map((npmChange, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-background/80 rounded p-2 text-xs">
                          <Package className="h-3.5 w-3.5 text-amber-500" />
                          <code className="flex-1 font-mono">{npmChange}</code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="ml-3 mt-1 flex-shrink-0">
                    <Avatar>
                      <div className="bg-gray-100 h-full w-full rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-gray-500" />
                      </div>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-2xl rounded-bl-none p-4 max-w-[80%]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blossom-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blossom-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-blossom-300 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
