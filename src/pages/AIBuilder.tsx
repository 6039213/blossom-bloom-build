
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import BlossomsAIWebBuilder from '@/components/ai-builder/BlossomsAIWebBuilder';

export default function AIBuilder() {
  return (
    <Layout>
      <motion.div 
        className="flex-1 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-full">
          <BlossomsAIWebBuilder />
        </div>
      </motion.div>
    </Layout>
  );
}
