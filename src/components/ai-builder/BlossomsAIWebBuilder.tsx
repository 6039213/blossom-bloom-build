
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Sparkles, Code, Play, FileCode, Settings, Loader2 } from 'lucide-react';
import MonacoEditor from './MonacoEditor';
import { getFileLanguage } from './MonacoEditor';
import { extractCodeBlocks } from '@/utils/codeGeneration';
import ClaudeTest from './ClaudeTest';

export default function BlossomsAIWebBuilder() {
  const [activeTab, setActiveTab] = useState('editor');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('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');

  useEffect(() => {
    // Always use the provided API key
    setApiKey('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');
  }, []);

  // Generate code based on prompt
  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setGeneratedFiles({});
    setSelectedFile(null);

    try {
      // Prepare system message
      const systemMessage = `You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS.
      Generate a complete, functional website based on the user's prompt.
      Respond with clear, properly formatted code blocks for each file using the format:
      \`\`\`jsx src/components/ComponentName.jsx
      // Code here
      \`\`\`
      Create clean, well-structured components with proper imports and exports.`;

      // Call the Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-7-sonnet-20240229',
          max_tokens: 4000,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: `Create a beautiful, responsive website with React and Tailwind CSS for: ${prompt}. Include all necessary components and styling.` }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const responseText = data.content[0].text;

      // Extract code blocks from the response
      const files = extractCodeBlocks(responseText);
      
      if (Object.keys(files).length === 0) {
        toast.error('No code files were generated. Please try again with a more specific prompt.');
        return;
      }

      setGeneratedFiles(files);
      setSelectedFile(Object.keys(files)[0]);
      
      // Generate preview HTML
      generatePreviewHtml(files);
      
      toast.success(`Generated ${Object.keys(files).length} files successfully!`);
      setActiveTab('editor');
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error(`Failed to generate code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate HTML for preview
  const generatePreviewHtml = (files: Record<string, string>) => {
    // Find index.html or App.jsx/tsx
    let mainContent = '';
    let appCode = '';
    
    if (files['src/App.jsx'] || files['src/App.tsx']) {
      appCode = files['src/App.jsx'] || files['src/App.tsx'];
    }
    
    // Create a basic HTML template with Tailwind included
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Generated Website</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: system-ui, sans-serif; }
        </style>
      </head>
      <body>
        <div id="root">
          <!-- This would be where React renders the app -->
          <div class="p-8">
            <h1 class="text-2xl font-bold mb-4">Preview (Static Render)</h1>
            <p class="mb-4">This is a static preview of your generated React application.</p>
            <div class="p-4 border rounded bg-gray-50">
              <pre class="text-xs overflow-auto max-h-[200px]">${appCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    setPreviewHtml(html);
  };

  // Handle file content changes
  const handleFileChange = (content: string) => {
    if (selectedFile) {
      setGeneratedFiles({
        ...generatedFiles,
        [selectedFile]: content
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Blossom AI Web Builder</CardTitle>
              <CardDescription>Create websites with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Describe your website</Label>
                  <Textarea
                    id="prompt"
                    placeholder="E.g., Create a modern landing page for a coffee shop with online ordering"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <Button
                  onClick={handleGenerateCode}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Website
                    </>
                  )}
                </Button>
                
                {Object.keys(generatedFiles).length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Generated Files</h3>
                    <div className="space-y-1 max-h-[300px] overflow-y-auto">
                      {Object.keys(generatedFiles).map((filename) => (
                        <Button
                          key={filename}
                          variant={selectedFile === filename ? "default" : "ghost"}
                          className="w-full justify-start text-sm h-auto py-1 px-2"
                          onClick={() => setSelectedFile(filename)}
                        >
                          <FileCode className="h-3.5 w-3.5 mr-2" />
                          <span className="truncate">{filename}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Add Claude Test Component */}
          <ClaudeTest />
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-9">
          <Card className="h-[calc(100vh-2rem)]">
            <CardHeader className="border-b p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="editor" className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Code Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              <Tabs value={activeTab} className="h-full">
                <TabsContent value="editor" className="m-0 h-full">
                  {selectedFile ? (
                    <MonacoEditor
                      value={generatedFiles[selectedFile]}
                      language={getFileLanguage(selectedFile)}
                      onChange={handleFileChange}
                      height="100%"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8">
                        <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">AI Web Builder</h3>
                        <p className="text-muted-foreground max-w-md">
                          Enter a description of the website you want to create, and our AI will generate the code for you.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="preview" className="m-0 h-full">
                  {previewHtml ? (
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full h-full border-0"
                      title="Preview"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8">
                        <Play className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Website Preview</h3>
                        <p className="text-muted-foreground max-w-md">
                          Generate a website first to see a preview here.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
