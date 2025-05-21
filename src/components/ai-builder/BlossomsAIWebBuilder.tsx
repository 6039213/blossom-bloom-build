import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Sparkles, Code, Play, FileCode, Settings, Loader2, PanelLeft, PanelRight, Sliders, Smartphone, Tablet, Monitor } from 'lucide-react';
import MonacoEditor from './MonacoEditor';
import { getFileLanguage } from './MonacoEditor';
import { extractCodeBlocks } from '@/utils/codeGeneration';
import ClaudeTest from './ClaudeTest';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BlossomsAIWebBuilder() {
  const [activeTab, setActiveTab] = useState('editor');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  // Use API key from environment variable only
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  
  // Premium features
  const [temperature, setTemperature] = useState<number>(0.7);
  const [thinkingBudget, setThinkingBudget] = useState<number>(1000);
  const [useAdvancedMode, setUseAdvancedMode] = useState<boolean>(false);
  const [framework, setFramework] = useState<string>('react-tailwind');
  const [viewportSize, setViewportSize] = useState('desktop');
  const [isAiAssistEnabled, setIsAiAssistEnabled] = useState<boolean>(true);

  useEffect(() => {
    // Always use the provided API key
    // setApiKey('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');
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
      const systemMessage = `You are an expert web developer that creates beautiful, modern websites using ${
        framework === 'react-tailwind' ? 'React and Tailwind CSS' : 
        framework === 'next-tailwind' ? 'Next.js and Tailwind CSS' : 
        'standard HTML, CSS and JavaScript'
      }.
      Generate a complete, functional website based on the user's prompt.
      Respond with clear, properly formatted code blocks for each file using the format:
      \`\`\`jsx src/components/ComponentName.jsx
      // Code here
      \`\`\`
      Create clean, well-structured components with proper imports and exports.
      ${useAdvancedMode ? 'Include advanced animations, responsive designs, and optimized performance.' : ''}`;

      // Call the Claude API through our proxy
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          system: systemMessage,
          model: 'claude-3-7-sonnet-20240229',
          max_tokens: 4000,
          temperature: temperature
        })
      });

      const text = await response.text();
      const data = response.headers.get('content-type')?.includes('json')
        ? JSON.parse(text)
        : { error: text };

      if (data.error) {
        toast.error(data.error);
        throw new Error(data.error);
      }

      const responseText = data.content || '';

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
  
  // Handle viewport size change
  const handleViewportChange = (size: string) => {
    setViewportSize(size);
  };
  
  // Get viewport style based on selected size
  const getViewportStyle = () => {
    switch (viewportSize) {
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto', height: '90%', maxHeight: '600px' };
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto', height: '90%', maxHeight: '800px' };
      case 'desktop':
      default:
        return { width: '90%', height: '90%', margin: 'auto', maxHeight: '800px' };
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                Blossom AI Web Builder
              </CardTitle>
              <CardDescription>
                Powered by Claude 3.7 Sonnet
              </CardDescription>
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
                
                {/* Premium features panel */}
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="framework">Framework</Label>
                      <Select value={framework} onValueChange={setFramework}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="react-tailwind">React + Tailwind</SelectItem>
                          <SelectItem value="next-tailwind">Next.js + Tailwind</SelectItem>
                          <SelectItem value="html-css">HTML/CSS/JS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="temperature">Temperature: {temperature}</Label>
                      </div>
                      <Slider 
                        id="temperature" 
                        min={0} 
                        max={1} 
                        step={0.1} 
                        value={[temperature]} 
                        onValueChange={(value) => setTemperature(value[0])} 
                      />
                      <span className="text-xs text-muted-foreground">
                        Lower = more focused, Higher = more creative
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="thinking">Thinking Budget: {thinkingBudget}</Label>
                      </div>
                      <Slider 
                        id="thinking" 
                        min={0} 
                        max={5000} 
                        step={100} 
                        value={[thinkingBudget]} 
                        onValueChange={(value) => setThinkingBudget(value[0])} 
                      />
                      <span className="text-xs text-muted-foreground">
                        Higher values let Claude think more deeply (Claude 3.7 feature)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch 
                        id="advanced-mode" 
                        checked={useAdvancedMode} 
                        onCheckedChange={setUseAdvancedMode} 
                      />
                      <Label htmlFor="advanced-mode">
                        Advanced Mode
                        <p className="text-xs text-muted-foreground">
                          Generates more sophisticated code with animations
                        </p>
                      </Label>
                    </div>
                  </TabsContent>
                </Tabs>
                
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
                <div className="flex items-center justify-between">
                  <TabsList className="grid grid-cols-2 w-[200px]">
                    <TabsTrigger value="editor" className="flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Editor
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Viewport controls (only in preview mode) */}
                  {activeTab === 'preview' && (
                    <div className="flex space-x-1">
                      <Button
                        variant={viewportSize === 'desktop' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handleViewportChange('desktop')}
                        className="h-8 w-8"
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewportSize === 'tablet' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handleViewportChange('tablet')}
                        className="h-8 w-8"
                      >
                        <Tablet className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewportSize === 'mobile' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handleViewportChange('mobile')}
                        className="h-8 w-8"
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
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
                        <h3 className="text-xl font-bold mb-2">Claude 3.7 Sonnet Web Builder</h3>
                        <p className="text-muted-foreground max-w-md">
                          Enter a description of the website you want to create, and Claude 3.7 will generate the code for you.
                          The new version offers improved code quality, faster responses, and more intelligent website generation.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="preview" className="m-0 h-full">
                  <div className="h-full" style={getViewportStyle()}>
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
                            Claude 3.7 Sonnet generates highly responsive and visually appealing websites.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
