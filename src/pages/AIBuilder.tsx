
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import EnhancedAIWebBuilder from '@/components/dashboard/EnhancedAIWebBuilder';

export default function AIBuilder() {
  return (
    <Layout>
      <motion.div 
        className="flex-1 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <EnhancedAIWebBuilder />
      </motion.div>
    </Layout>
  );
}
