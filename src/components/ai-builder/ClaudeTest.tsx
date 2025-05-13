
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Terminal, Bot } from "lucide-react";
import { toast } from 'sonner';
import { callClaude } from '@/lib/providers/anthropic';

const ClaudeTest: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setResponse('');
    
    try {
      const result = await callClaude(prompt, "You are Claude 3.7 Sonnet, an advanced AI assistant that helps with coding and web development questions.");
      if (result.content && result.content[0] && result.content[0].text) {
        setResponse(result.content[0].text);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error calling Claude:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setResponse(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={18} /> Claude 3.7 Sonnet
        </CardTitle>
        <CardDescription>
          Ask coding questions or get help with development tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How do I create a modal component with React?"
            className="min-h-[120px] mb-4"
          />
          <Button 
            type="submit" 
            disabled={loading || !prompt.trim()} 
            className="w-full"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Ask Claude 3.7
              </>
            )}
          </Button>
        </form>
        
        {response && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Terminal className="mr-2 h-4 w-4" /> Claude 3.7 Response:
            </h4>
            <div className="text-sm whitespace-pre-wrap">{response}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaudeTest;
