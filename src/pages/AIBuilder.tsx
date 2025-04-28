
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
  Save,
} from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AIBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [projectName, setProjectName] = useState('');
  const { createProject } = useProjectStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handlePromptSubmit = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // Check if we have a valid API key
      if (!GEMINI_API_KEY) {
        toast.error("Gemini API key is not configured correctly");
        return;
      }
      
      // Extract a project name from the prompt
      setProjectName(extractProjectName(prompt));
      
      // Call the Gemini API with improved instructions for React/TypeScript/SCSS
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
                  text: `Generate a complete React website based on this description: "${prompt}". 

This MUST be a modern React 18+ application with TypeScript (.tsx files) and SCSS modules for styling.
Include the following file structure:

/src
  /components (with reusable UI components)
  /pages (with page components)
  /hooks (custom React hooks if needed)
  /contexts (React context providers if needed)
  /utils (utility functions)
  /styles (SCSS module files)
  App.tsx
  index.tsx
/public
  index.html
package.json
vite.config.ts

Important requirements:
1. Use functional components with TypeScript (React.FC<Props>)
2. Use SCSS modules for styling (.module.scss files)
3. Proper imports and exports between files
4. Use react-router-dom for navigation if needed
5. All TypeScript types must be properly defined
6. Make it visually appealing with a modern design
7. Make sure the code is fully functional and the website is responsive

Return the complete multi-file project as a single response with clear file path indicators like:
// FILE: src/App.tsx
// code here...

// FILE: src/components/Header.tsx
// code here...

Do not include any explanations, just the code files.`
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
      
      // Extract project files from the response
      const text = data.candidates[0].content.parts[0].text;
      const projectFiles = parseProjectFiles(text);
      
      // For now, we'll still use the HTML preview method
      // In a full implementation, we would set up Sandpack with the parsed files
      const htmlPreview = generateHtmlPreview(projectFiles);
      
      // Set the generated code and preview HTML
      setGeneratedCode(JSON.stringify(projectFiles, null, 2));
      setPreviewHtml(htmlPreview);
      
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
  
  // Parse the text response into a structured project files object
  const parseProjectFiles = (text: string) => {
    const fileRegex = /\/\/ FILE: (.*?)\n([\s\S]*?)(?=\/\/ FILE:|$)/g;
    const files: Record<string, string> = {};
    let match;
    
    while ((match = fileRegex.exec(text)) !== null) {
      const filePath = match[1].trim();
      const fileContent = match[2].trim();
      files[filePath] = fileContent;
    }
    
    return files;
  };
  
  // Generate a simple HTML preview from the project files
  const generateHtmlPreview = (files: Record<string, string>) => {
    // For now, create a basic HTML preview that loads the React app
    // In a full implementation, this would be replaced by Sandpack
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React App Preview</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .preview-note { background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; }
        </style>
      </head>
      <body>
        <div id="root">
          <div class="preview-note">
            <h2>React TypeScript Project Generated</h2>
            <p>This is a placeholder preview. In the full implementation, this would be replaced by a Sandpack preview that loads all generated files.</p>
            <p>The project contains ${Object.keys(files).length} files including:</p>
            <ul style="text-align: left; max-width: 500px; margin: 0 auto;">
              ${Object.keys(files).map(file => `<li>${file}</li>`).join('')}
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  // Extract a reasonable project name from the prompt
  const extractProjectName = (prompt: string) => {
    // Get the first sentence or up to 50 characters
    let name = prompt.split('.')[0].split('!')[0].trim();
    if (name.length > 50) {
      name = name.substring(0, 47) + '...';
    }
    return name || 'New Project';
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard");
  };
  
  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded successfully");
  };

  const handleSaveProject = async () => {
    if (!user) {
      toast.error("You must be logged in to save a project");
      navigate('/auth');
      return;
    }

    if (!generatedCode) {
      toast.error("No project to save");
      return;
    }

    try {
      const projectData = {
        title: projectName,
        description: "Generated with AI Builder",
        code: generatedCode,
        status: 'draft'
      };

      // Save project to database
      const newProject = await createProject(projectData);
      
      toast.success("Project saved successfully");
      navigate(`/dashboard/projects/${newProject.id}`);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
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
                onSaveCode={handleSaveProject}
                showSaveButton={!!generatedCode}
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
                      <Button 
                        variant="default"
                        size="sm"
                        onClick={handleSaveProject}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Project
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
