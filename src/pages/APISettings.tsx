
import React, { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import APIKeyInput from '@/components/settings/APIKeyInput';
import { toast } from 'sonner';
import { callClaude } from '@/lib/providers/anthropic';

export default function APISettings() {
  // Test function to verify API key works with Claude
  const testClaudeAPIKey = async (key: string): Promise<boolean> => {
    try {
      // Simple prompt to test API connectivity
      const response = await fetch("https://claude-proxy.lovable-worker.workers.dev/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-3-7-sonnet-20250219",
          messages: [{ role: "user", content: "Say hello" }],
          max_tokens: 10
        })
      });
      
      const data = await response.json();
      
      // Check if response contains expected fields
      return response.ok && data.content && !data.error;
    } catch (error) {
      console.error("Error testing Claude API key:", error);
      return false;
    }
  };

  const handleSaveClaudeKey = (key: string) => {
    // We'll update in localStorage and also update the .env at runtime
    localStorage.setItem('VITE_CLAUDE_API_KEY', key);
    
    // For immediate use in the current session
    (window as any).CLAUDE_API_KEY = key;
    
    // Refresh the page to ensure the key is picked up
    toast.success("API key saved. It will be used for future Blossom AI requests.");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4">
          <h1 className="text-2xl font-bold">API Settings</h1>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="prose dark:prose-invert max-w-none mb-6">
              <h2>API Keys</h2>
              <p>
                Configure your API keys for AI services. These keys will be stored in your browser's local storage
                and used for generating AI content within Blossom.
              </p>
            </div>
            
            <APIKeyInput 
              apiKeyName="VITE_CLAUDE_API_KEY"
              serviceName="Anthropic Claude"
              onSave={handleSaveClaudeKey}
              onTest={testClaudeAPIKey}
              defaultKey={localStorage.getItem('VITE_CLAUDE_API_KEY') || ''}
            />
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 rounded mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    <strong>Important:</strong> Your API key will be stored in your browser's local storage. This means your key is only stored on your device.
                    When generating content, your API key will be used to authenticate with Anthropic's API via our secure proxy.
                  </p>
                  <p className="text-sm mt-2">
                    You can get an Anthropic API key from the{" "}
                    <a 
                      href="https://console.anthropic.com/settings/keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Anthropic Console
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
