import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Settings, Key } from 'lucide-react';
import { toast } from 'sonner';
import { callClaude } from "@/api/claude";

export default function ClaudeSettings() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('claude-3-7-sonnet-20240229');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  // Load settings from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('CLAUDE_API_KEY');
    if (savedKey) setApiKey(savedKey);
    
    const savedModel = localStorage.getItem('CLAUDE_MODEL');
    if (savedModel) setModel(savedModel);
    
    const savedTemperature = localStorage.getItem('CLAUDE_TEMPERATURE');
    if (savedTemperature) setTemperature(parseFloat(savedTemperature));
    
    const savedMaxTokens = localStorage.getItem('CLAUDE_MAX_TOKENS');
    if (savedMaxTokens) setMaxTokens(parseInt(savedMaxTokens));
    
    const savedStreaming = localStorage.getItem('CLAUDE_STREAMING');
    if (savedStreaming !== null) setStreamingEnabled(savedStreaming === 'true');
  }, []);
  
  const handleSaveSettings = () => {
    if (!apiKey.trim()) {
      toast.error('API Key is required');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save all settings to localStorage
      localStorage.setItem('CLAUDE_API_KEY', apiKey.trim());
      localStorage.setItem('CLAUDE_MODEL', model);
      localStorage.setItem('CLAUDE_TEMPERATURE', temperature.toString());
      localStorage.setItem('CLAUDE_MAX_TOKENS', maxTokens.toString());
      localStorage.setItem('CLAUDE_STREAMING', streamingEnabled.toString());
      
      toast.success('Claude settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  const testAPIKey = async (key: string) => {
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

      return true;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  };
  
  return (
    <Layout>
      <div className="container py-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <Sparkles className="h-8 w-8 text-blue-500 mr-2" />
                Claude Settings
              </h1>
              <p className="text-muted-foreground">
                Configure your Anthropic Claude API settings
              </p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2 text-blue-500" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Set your API key and model preferences for Claude
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    className="ml-2"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="claude-model">Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="claude-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-3-7-sonnet-20240229">Claude 3.7 Sonnet</SelectItem>
                    <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-500" />
                Generation Settings
              </CardTitle>
              <CardDescription>
                Configure how Claude generates responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature: {temperature}</Label>
                  <span className="text-xs text-muted-foreground">
                    (0 = Deterministic, 1 = Creative)
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[temperature]}
                  onValueChange={(values) => setTemperature(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
                </div>
                <Slider
                  id="max-tokens"
                  min={1000}
                  max={10000}
                  step={100}
                  value={[maxTokens]}
                  onValueChange={(values) => setMaxTokens(values[0])}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2 pt-2">
                <Label htmlFor="streaming" className="cursor-pointer">Enable Streaming</Label>
                <Switch
                  id="streaming"
                  checked={streamingEnabled}
                  onCheckedChange={setStreamingEnabled}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                onClick={testAPIKey}
                variant="outline"
                disabled={isSaving || !apiKey.trim()}
              >
                Test Connection
              </Button>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving || !apiKey.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-sm text-muted-foreground">
            <p>
              Get your API key from the{" "}
              <a 
                href="https://console.anthropic.com/settings/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Anthropic Console
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
