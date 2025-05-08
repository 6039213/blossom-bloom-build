
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AnthropicKeyInput from '@/components/settings/AnthropicKeyInput';

export default function Settings() {
  return (
    <Layout>
      <div className="container py-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your application settings and configurations.
            </p>
          </div>
          
          <Tabs defaultValue="api-keys" className="space-y-6">
            <TabsList>
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="api-keys" className="space-y-6">
              <AnthropicKeyInput />
              {/* Add other API key components here in the future */}
            </TabsContent>
            
            <TabsContent value="preferences">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium">User Preferences</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure your application preferences.
                </p>
                <p className="text-muted-foreground">Preferences settings coming soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium">Appearance Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize how your application looks.
                </p>
                <p className="text-muted-foreground">Appearance settings coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
