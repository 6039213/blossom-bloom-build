
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import AIWebBuilder from '@/components/dashboard/AIWebBuilder';

export default function AIBuilder() {
  return (
    <Layout>
      <motion.div 
        className="flex-1 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AIWebBuilder />
      </motion.div>
    </Layout>
  );
}
