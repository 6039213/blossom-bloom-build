
import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AIPromptInput from '@/components/dashboard/AIPromptInput';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GEMINI_API_KEY } from '@/lib/constants';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Download,
  Copy,
  Code,
  Eye,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function AIBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  
  const handlePromptSubmit = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // Check if we have a valid API key - fixed the comparison
      if (!GEMINI_API_KEY) {
        toast.error("Gemini API key is not configured correctly");
        return;
      }
      
      // Call the Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Generate a complete HTML website based on this description: "${prompt}". 
                  Include all HTML, CSS, and JS in a single file. Make it visually appealing with a modern design.
                  Make sure the code is fully functional and the website is responsive.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Error generating website');
      }
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }
      
      // Extract HTML code from the response
      const text = data.candidates[0].content.parts[0].text;
      let htmlCode = text;
      
      // Try to extract code from markdown code blocks if present
      const codeBlockMatch = text.match(/```html\n([\s\S]*?)\n```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        htmlCode = codeBlockMatch[1];
      } else {
        // Look for just HTML opening tag
        const htmlMatch = text.match(/<html[\s\S]*<\/html>/i);
        if (htmlMatch) {
          htmlCode = htmlMatch[0];
        }
      }
      
      // Set the generated code and preview HTML
      setGeneratedCode(htmlCode);
      setPreviewHtml(htmlCode);
      
      // Show success toast
      toast.success("Website generated successfully!");
      
      // Switch to preview tab
      setActiveTab('preview');
      
    } catch (error) {
      console.error("Error generating website:", error);
      toast.error("Failed to generate website: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard");
  };
  
  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded successfully");
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AI Website Builder</h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden grid grid-rows-[auto_1fr]">
          <div className="p-6 bg-white dark:bg-gray-900 border-b border-border">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blossom-500" />
                Tell us about your website
              </h2>
              <AIPromptInput 
                onSubmit={handlePromptSubmit} 
                isProcessing={isGenerating}
              />
            </div>
          </div>
          
          <div className="overflow-hidden p-6">
            {!generatedCode ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-8 w-8 text-blossom-500" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Let's Create Something Amazing</h3>
                  <p className="text-muted-foreground mb-6">
                    Type a description of the website you want to build and our AI will generate it for you.
                  </p>
                  <ul className="text-left space-y-2 bg-muted p-4 rounded-lg text-sm">
                    <li className="flex items-start">
                      <span className="bg-blossom-100 dark:bg-blossom-900/30 p-1 rounded text-blossom-700 dark:text-blossom-300 mr-2">Tip</span>
                      <span>Be specific about your website's purpose, style, and content.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blossom-100 dark:bg-blossom-900/30 p-1 rounded text-blossom-700 dark:text-blossom-300 mr-2">Tip</span>
                      <span>Mention color schemes or specific design elements you'd like to include.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blossom-100 dark:bg-blossom-900/30 p-1 rounded text-blossom-700 dark:text-blossom-300 mr-2">Tip</span>
                      <span>You can always regenerate if you're not satisfied with the results.</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="max-w-full mx-auto h-full flex flex-col">
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full h-full flex flex-col"
                >
                  <div className="flex items-center justify-between w-full mb-4">
                    <TabsList>
                      <TabsTrigger value="preview" className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="code" className="flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Code
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCopyCode}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDownloadCode}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setGeneratedCode('')}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden border border-border rounded-lg">
                    <TabsContent value="preview" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                      <div className="h-full w-full overflow-auto">
                        <iframe 
                          srcDoc={previewHtml}
                          title="Website Preview"
                          className="w-full h-full border-0"
                          style={{ minHeight: "800px" }}
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="code" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden">
                      <pre className="h-full w-full p-4 text-sm bg-gray-50 dark:bg-gray-950 overflow-auto">
                        <code>{generatedCode}</code>
                      </pre>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
