
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Sparkles, Loader2 } from 'lucide-react';
import { streamWithClaude } from '@/lib/anthropic/claude-client';

export default function ClaudeTest() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsLoading(true);
    setResponse('');
    
    try {
      // Add token updater to stream response
      const tokenCallback = (token: string) => {
        setResponse(prev => prev + token);
      };
      
      await streamWithClaude(prompt, tokenCallback, {
        system: "You are a helpful AI assistant. Respond in a clear and concise manner.",
        temperature: 0.7,
        maxTokens: 500
      });
      
      toast.success('Response generated successfully');
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
          Claude Test
        </CardTitle>
        <CardDescription>
          Test your Claude API integration with a simple prompt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !prompt.trim()} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Response
              </>
            )}
          </Button>
        </form>
        
        {response && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Response:</h3>
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-900 overflow-y-auto max-h-[300px]">
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
