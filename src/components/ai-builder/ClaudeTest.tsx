import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Terminal, Bot } from "lucide-react";
import { toast } from 'sonner';

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
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: process.env.VITE_CLAUDE_MODEL || "claude-3-7-sonnet-20240229",
          messages: [
            { 
              role: 'system', 
              content: "You are Claude 3.7 Sonnet, an advanced AI assistant that helps with coding and web development questions."
            },
            { 
              role: 'user', 
              content: prompt 
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        })
      });

      // Get the response text first
      const text = await response.text();
      
      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status} ${text}`);
      }
      
      // Safely parse the JSON response
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON:", text.substring(0, 200));
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
      }
      
      if (data.content && data.content[0] && data.content[0].text) {
        setResponse(data.content[0].text);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Unexpected response format from Claude API");
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
