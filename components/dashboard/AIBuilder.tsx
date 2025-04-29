
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { WebContainerPreview } from '@/components/dashboard/WebContainerPreview';
import { FileTree } from '@/components/dashboard/FileTree';
import { CodeEditor } from '@/components/dashboard/CodeEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useProjectStore } from '@/stores/project';

export function AIBuilder() {
  const { toast } = useToast();
  const { setPreviewHtml } = useProjectStore();
  
  // State management
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [generatedFiles, setGeneratedFiles] = useState<{[key: string]: {code: string, displayed: string}}>({}); 
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(15); // characters per tick

  // Generation logic
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setActiveTab('code');

    try {
      // Call the API to generate content based on the prompt
      const response = await fetch("/api/generate", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ prompt }) 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!generatedContent) {
        throw new Error("No content generated");
      }

      // Extract component name from prompt or use default
      const componentName = extractComponentName(prompt);
      
      // Simulate file generation
      await simulateFileGeneration(componentName, generatedContent);

    } catch (error: any) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Extract a component name from the prompt
  const extractComponentName = (prompt: string): string => {
    // Look for patterns like "create X component" or similar
    const matches = prompt.match(/create\s+(?:a|an)?\s+([a-zA-Z0-9]+)\s+(?:component|page|element|card|button)/i);
    if (matches && matches[1]) {
      // Capitalize the first letter
      return matches[1].charAt(0).toUpperCase() + matches[1].slice(1);
    }
    return "Component";
  };

  // Simulate file generation with typing effect
  const simulateFileGeneration = async (componentName: string, content: string) => {
    // Parse the content to extract potential code blocks
    const cssContent = extractCssFromContent(content);
    const jsxContent = extractJsxFromContent(content);
    
    // Create files
    const files: {[key: string]: {code: string, displayed: string}} = {
      [`${componentName}.tsx`]: {
        code: jsxContent || `import React from 'react';\nimport './${componentName}.css';\n\nexport const ${componentName} = () => {\n  return (\n    <div className="${componentName.toLowerCase()}-container">\n      <h2>${componentName}</h2>\n      <p>This is a ${componentName.toLowerCase()} component</p>\n    </div>\n  );\n};\n\nexport default ${componentName};`,
        displayed: ''
      },
      [`${componentName}.css`]: {
        code: cssContent || `.${componentName.toLowerCase()}-container {\n  display: flex;\n  flex-direction: column;\n  padding: 1rem;\n  border-radius: 0.5rem;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n`,
        displayed: ''
      }
    };

    // Set the generated files and active file
    setGeneratedFiles(files);
    setActiveFile(`${componentName}.tsx`);

    // Simulate typing effect for the first file
    await simulateTypingEffect(`${componentName}.tsx`, files[`${componentName}.tsx`].code);
    
    // Generate preview HTML
    const previewHTML = `
      <style>${files[`${componentName}.css`].code}</style>
      <div id="root"></div>
      <script>
        // Simple React-like rendering for preview
        const container = document.getElementById('root');
        container.innerHTML = \`<div class="${componentName.toLowerCase()}-container">
          <h2>${componentName}</h2>
          <p>This is a ${componentName.toLowerCase()} component</p>
        </div>\`;
      </script>
    `;
    
    setPreviewHtml(previewHTML);
    
    // Show preview tab after typing effect is complete
    setActiveTab('preview');
  };

  // Extract CSS content from generated text
  const extractCssFromContent = (content: string): string => {
    const cssRegex = /```css\n([\s\S]*?)```/;
    const match = content.match(cssRegex);
    return match ? match[1] : '';
  };

  // Extract JSX/TSX content from generated text
  const extractJsxFromContent = (content: string): string => {
    const jsxRegex = /```(?:jsx|tsx)\n([\s\S]*?)```/;
    const match = content.match(jsxRegex);
    return match ? match[1] : '';
  };

  // Simulate typing effect for code
  const simulateTypingEffect = async (fileName: string, code: string) => {
    setIsTypingEffect(true);
    let displayedCode = '';
    
    // Reset the displayed code
    setGeneratedFiles(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        displayed: ''
      }
    }));

    // Type out the code character by character
    for (let i = 0; i < code.length; i += typingSpeed) {
      if (!isTypingEffect) break; // Allow for cancellation
      
      const nextChunk = code.substring(i, i + typingSpeed);
      displayedCode += nextChunk;
      
      setGeneratedFiles(prev => ({
        ...prev,
        [fileName]: {
          ...prev[fileName],
          displayed: displayedCode
        }
      }));
      
      // Wait a small amount of time before typing the next chunk
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    // Make sure we display the complete code at the end
    setGeneratedFiles(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        displayed: code
      }
    }));
    
    setIsTypingEffect(false);
  };

  // Handle file selection from the file tree
  const handleFileClick = (fileName: string) => {
    setActiveFile(fileName);
    if (generatedFiles[fileName]) {
      simulateTypingEffect(fileName, generatedFiles[fileName].code);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Prompt input area */}
      <div className="p-4 border border-blossom-200 rounded-lg bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-blossom-800">What would you like to build?</h2>
        <div className="flex items-start space-x-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the component you want to create... (e.g., 'Create a responsive card component with an image, title, and button')"
            className="flex-1 min-h-[80px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blossom-500"
            disabled={isGenerating}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-4 py-2 bg-blossom-500 text-white rounded-md hover:bg-blossom-600 focus:outline-none focus:ring-2 focus:ring-blossom-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 space-x-4 overflow-hidden">
        {/* File tree panel */}
        <div className="w-64 border-r border-gray-200 overflow-y-auto">
          <FileTree 
            files={Object.keys(generatedFiles)} 
            activeFile={activeFile}
            onFileClick={handleFileClick}
          />
        </div>

        {/* Code editor and preview area */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mb-2">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="code" className="flex-1 p-2 overflow-hidden">
              {activeFile && generatedFiles[activeFile] && (
                <CodeEditor 
                  fileName={activeFile}
                  code={generatedFiles[activeFile].displayed}
                  isTyping={isTypingEffect}
                />
              )}
              {isTypingEffect && (
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center space-x-2 bg-blossom-100 p-2 rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin text-blossom-500" />
                    <span className="text-sm text-blossom-700">Generating code...</span>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 overflow-hidden">
              <WebContainerPreview />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
