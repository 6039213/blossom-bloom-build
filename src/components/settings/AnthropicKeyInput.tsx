
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Key, Eye, EyeOff } from 'lucide-react';

export default function AnthropicKeyInput() {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  // Load existing API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('CLAUDE_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    setIsSaving(true);
    
    try {
      localStorage.setItem('CLAUDE_API_KEY', apiKey.trim());
      toast.success("Anthropic API key saved successfully");
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
    } finally {
      setIsSaving(false);
    }
  };
  
  const toggleShowKey = () => {
    setShowKey(!showKey);
  };
  
  const maskKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '••••••••';
    return `${key.substring(0, 4)}••••••${key.substring(key.length - 4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="h-5 w-5 text-blue-500 mr-2" />
          Anthropic API Key
        </CardTitle>
        <CardDescription>
          Configure your Claude API key to use Anthropic's AI models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="claude-api-key">Claude API Key</Label>
          <div className="flex">
            <Input
              id="claude-api-key"
              type={showKey ? "text" : "password"}
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={toggleShowKey}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-3">
          <p>Get your API key from the <a href="https://console.anthropic.com/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Anthropic console</a>.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveKey} 
          disabled={isSaving || !apiKey.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSaving ? "Saving..." : "Save API Key"}
        </Button>
      </CardFooter>
    </Card>
  );
}
