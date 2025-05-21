import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Terminal, Bot } from "lucide-react";
import { toast } from 'sonner';
import { callClaude } from "@/api/claude";

const ClaudeTest: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setResponse('');
    
    try {
      const response = await callClaude({
        prompt: prompt,
        system: "You are Claude 3.7 Sonnet, an advanced AI assistant that helps with coding and web development questions.",
        model: process.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229",
        max_tokens: 4000,
        temperature: 0.7,
        stream: false
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setResponse(response.content || '');
    } catch (error) {
      console.error('Error calling Claude:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setResponse(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const testClaudeAPI = async () => {
    try {
      const response = await callClaude({
        prompt: "Hello, Claude!",
        system: "You are a helpful AI assistant.",
        model: import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: 100,
        temperature: 0.7,
        stream: false
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setTestResult(response.content || '');
    } catch (error) {
      console.error('Error testing Claude API:', error);
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          Claude API Test
        </CardTitle>
        <CardDescription>
          Test the Claude API integration with a simple prompt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Enter your prompt:
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Claude something..."
              className="min-h-[100px]"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Terminal className="mr-2 h-4 w-4" />
                Send to Claude
              </>
            )}
          </Button>
        </form>
        
        {response && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium">Response:</h3>
            <div className="rounded-md bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm">{response}</pre>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Using Claude 3.7 Sonnet API through our proxy endpoint
      </CardFooter>
    </Card>
  );
};

export default ClaudeTest;
