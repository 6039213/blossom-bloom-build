
import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Sparkles, User } from 'lucide-react';

interface ChatMessagesProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
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
              className={`flex max-w-[80%] rounded-2xl p-4 ${
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
                <div className="whitespace-pre-wrap">{message.content}</div>
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
