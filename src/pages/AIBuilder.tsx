
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import WebsiteBuilder from '@/components/ai-builder/WebsiteBuilder';

export default function AIBuilder() {
  return (
    <Layout>
      <motion.div 
        className="flex-1 h-full p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-full">
          <WebsiteBuilder />
        </div>
      </motion.div>
    </Layout>
  );
}
