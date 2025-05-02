
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Key, CheckCircle, XCircle } from 'lucide-react';

interface APIKeyInputProps {
  apiKeyName: string;
  serviceName: string;
  defaultKey?: string;
  onSave: (key: string) => void;
  onTest?: (key: string) => Promise<boolean>;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({
  apiKeyName,
  serviceName,
  defaultKey = "",
  onSave,
  onTest
}) => {
  const [apiKey, setApiKey] = useState(defaultKey);
  const [saved, setSaved] = useState(!!defaultKey);
  const [obscured, setObscured] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  
  // Check if key exists in localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem(apiKeyName);
    if (savedKey) {
      setApiKey(savedKey);
      setSaved(true);
    }
  }, [apiKeyName]);
  
  const handleSave = () => {
    if (apiKey) {
      localStorage.setItem(apiKeyName, apiKey);
      onSave(apiKey);
      setSaved(true);
      toast.success(`${serviceName} API key saved successfully`);
    }
  };
  
  const handleTest = async () => {
    if (!onTest || !apiKey) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await onTest(apiKey);
      setTestResult(result);
      toast(result ? 
        { title: "API key is valid", description: `Successfully connected to ${serviceName} API` } : 
        { title: "API key is invalid", description: `Failed to connect to ${serviceName} API` }
      );
    } catch (error) {
      setTestResult(false);
      toast.error(`Error testing ${serviceName} API connection`);
    } finally {
      setIsTesting(false);
    }
  };
  
  const toggleVisibility = () => {
    setObscured(!obscured);
  };
  
  // Format key for display
  const formatKey = (key: string) => {
    if (obscured && key.length > 8) {
      return `${key.slice(0, 4)}...${key.slice(-4)}`;
    }
    return key;
  };

  return (
    <Card className="p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-4">
        <Key className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">{serviceName} API Key</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${apiKeyName}-input`}>Enter your {serviceName} API Key</Label>
          <div className="flex items-center gap-2">
            <Input
              id={`${apiKeyName}-input`}
              value={saved ? formatKey(apiKey) : apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setSaved(false);
                setTestResult(null);
              }}
              type={obscured ? "password" : "text"}
              placeholder={`sk-ant-...`}
              className="font-mono"
            />
            <Button
              type="button"
              variant="outline"
              onClick={toggleVisibility}
              className="whitespace-nowrap"
              size="sm"
            >
              {obscured ? "Show" : "Hide"}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSave}
            disabled={!apiKey || (saved && testResult !== false)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saved ? "Update Key" : "Save Key"}
          </Button>
          
          {onTest && (
            <Button
              onClick={handleTest}
              disabled={!apiKey || isTesting}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-primary mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Testing
                </>
              ) : (
                "Test Connection"
              )}
            </Button>
          )}
        </div>
        
        {testResult !== null && (
          <div className={`flex items-center gap-2 p-2 rounded-md ${testResult ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {testResult ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">
              {testResult ? "API key is valid" : "API key is invalid"}
            </span>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          <p>Your API key will be stored securely in browser local storage and used for Blossom AI requests.</p>
          <p className="mt-1">
            Don't have an API key?{" "}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get one from Anthropic Console
            </a>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default APIKeyInput;
