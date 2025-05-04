
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoltAIWebBuilder from '@/components/ai-builder/BoltAIWebBuilder';

export default function AIBuilder() {
  return (
    <Layout>
      <motion.div 
        className="flex-1 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs defaultValue="builder" className="h-full flex flex-col">
          <div className="border-b mb-4 pb-2">
            <TabsList>
              <TabsTrigger value="builder">AI Website Builder</TabsTrigger>
              <TabsTrigger value="saved">Saved Projects</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="builder" className="flex-1 m-0 p-0">
            <BoltAIWebBuilder />
          </TabsContent>
          
          <TabsContent value="saved" className="flex-1 m-0 p-0">
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h3 className="text-xl font-semibold mb-2">Your saved projects</h3>
                <p className="text-muted-foreground">
                  Projects you generate will appear here for easy access. Generate your first website to get started!
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
}
