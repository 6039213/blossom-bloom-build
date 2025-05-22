
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { setupApiKey } from '@/lib/setupApi';

// Use EnhancedAIWebBuilder as the actual component
import EnhancedAIWebBuilder from '@/components/dashboard/EnhancedAIWebBuilder';

export default function UnifiedAIBuilder() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    try {
      // Set up the API
      const config = setupApiKey();
      setIsConfigured(config.isConfigured);

      if (config.isConfigured) {
        toast.success('AI builder initialized successfully');
      } else {
        toast.error('Claude API key not configured');
      }
    } catch (error) {
      console.error('Error setting up API:', error);
      toast.error('Failed to initialize AI builder');
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="mt-2">Loading AI Builder...</p>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="max-w-xl p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">API Key Not Configured</h2>
          <p className="text-red-700 dark:text-red-400">
            Please make sure the Claude API key is set in your environment variables.
          </p>
        </div>
      </div>
    );
  }

  return <EnhancedAIWebBuilder />;
}
