
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import UnifiedAIBuilder from '@/components/ai-builder/UnifiedAIBuilder';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function AIBuilder() {
  // Check if API key is configured
  const apiKeyConfigured = Boolean(import.meta.env.VITE_CLAUDE_API_KEY);

  return (
    <Layout>
      <motion.div 
        className="flex-1 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-full">
          {!apiKeyConfigured ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Alert variant="destructive" className="max-w-xl">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>⚠️ Claude API Key Not Configured</AlertTitle>
                <AlertDescription>
                  To use the AI Web Builder, please set your Claude API key in the VITE_CLAUDE_API_KEY environment variable.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <UnifiedAIBuilder />
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
