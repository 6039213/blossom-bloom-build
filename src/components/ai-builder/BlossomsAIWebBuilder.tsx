
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileCode, MonitorSmartphone, MonitorTablet, Code, Send, Loader2, Download, Sparkles } from 'lucide-react';
import WebsitePreview from './WebsitePreview';
import { generateWebsite } from '@/utils/codeGeneration';

type PromptStatus = 'idle' | 'loading' | 'success' | 'error';
type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export default function BlossomsAIWebBuilder() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<PromptStatus>('idle');
  const [files, setFiles] = useState<Array<{path: string; content: string; type: string}>>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const handleGenerateWebsite = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate a website.');
      return;
    }

    try {
      setStatus('loading');
      setError(null);
      
      // Call the code generation utility
      const generatedFiles = await generateWebsite(prompt);
      
      setFiles(generatedFiles);
      setStatus('success');
    } catch (err) {
      console.error('Error generating website:', err);
      setError('Failed to generate website. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-amber-200 dark:border-amber-700">
        <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-300 mb-4">AI Website Builder</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Textarea
              placeholder="Describe the website you want to build, e.g. 'Create a landing page for a coffee shop with a hero section, about us, menu, and contact form.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px] bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700 focus:border-amber-400 dark:focus:border-amber-500"
            />
            <div className="absolute bottom-2 right-2">
              <Sparkles className="h-5 w-5 text-amber-500 dark:text-amber-400 opacity-50" />
            </div>
          </div>
          <Button
            onClick={handleGenerateWebsite}
            disabled={status === 'loading' || !prompt.trim()}
            className={`md:w-40 flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white ${status === 'loading' ? 'opacity-80' : ''}`}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
        
        {error && (
          <div className="mt-2 text-red-500 text-sm">{error}</div>
        )}
      </div>
      
      <div className="flex items-center border-b border-amber-200 dark:border-amber-700 p-2">
        <Tabs 
          defaultValue="preview" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'preview' | 'code')} 
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList className="bg-amber-100/50 dark:bg-amber-900/20">
              <TabsTrigger 
                value="preview"
                className={`${activeTab === 'preview' ? 'bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-300' : 'text-amber-700 dark:text-amber-400'}`}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="code"
                className={`${activeTab === 'code' ? 'bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-300' : 'text-amber-700 dark:text-amber-400'}`}
              >
                <Code className="h-4 w-4 mr-2" />
                Code
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'preview' && (
              <div className="flex bg-amber-100/50 dark:bg-amber-900/20 p-1 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${viewportSize === 'desktop' ? 'bg-white dark:bg-gray-800' : ''} rounded-md`}
                  onClick={() => setViewportSize('desktop')}
                >
                  <FileCode className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${viewportSize === 'tablet' ? 'bg-white dark:bg-gray-800' : ''} rounded-md`}
                  onClick={() => setViewportSize('tablet')}
                >
                  <MonitorTablet className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${viewportSize === 'mobile' ? 'bg-white dark:bg-gray-800' : ''} rounded-md`}
                  onClick={() => setViewportSize('mobile')}
                >
                  <MonitorSmartphone className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                </Button>
              </div>
            )}
            
            {files.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
          
          <div className="mt-4 h-[calc(100vh-280px)]">
            <TabsContent value="preview" className="h-full m-0 outline-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <WebsitePreview files={files} viewportSize={viewportSize} />
              </motion.div>
            </TabsContent>
            <TabsContent value="code" className="h-full m-0 outline-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto"
              >
                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Code className="h-12 w-12 mb-4 text-amber-700 dark:text-amber-400 opacity-50" />
                    <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-300">No Code Generated Yet</h3>
                    <p className="text-amber-700 dark:text-amber-400 max-w-md mt-2">
                      Enter a prompt and click "Generate" to create your website code.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {files.map((file, i) => (
                      <div key={i} className="border border-amber-200 dark:border-amber-700 rounded-md overflow-hidden">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 font-mono font-medium text-sm text-amber-900 dark:text-amber-300">
                          {file.path}
                        </div>
                        <pre className="p-4 overflow-x-auto bg-white dark:bg-gray-800 text-sm">
                          <code className="text-amber-800 dark:text-amber-200">{file.content}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
