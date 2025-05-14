
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import UnifiedAIBuilder from '@/components/ai-builder/UnifiedAIBuilder';

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
              <div className="bg-amber-100 text-amber-800 p-4 rounded-lg max-w-xl">
                <h3 className="text-lg font-bold mb-2">⚠️ Claude API Key Not Configured</h3>
                <p className="mb-4">
                  To use the AI Web Builder, please set your Claude API key in the VITE_CLAUDE_API_KEY environment variable.
                </p>
              </div>
            </div>
          ) : (
            <UnifiedAIBuilder />
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
