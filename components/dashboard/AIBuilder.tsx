
import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useChatStore } from '@/stores/chat';
import { useProjectStore } from '@/stores/project';
import { useUserStore } from '@/stores/user';
import { useToast } from '@/components/ui/use-toast';
import { WebContainerPreview } from '@/components/dashboard/WebContainerPreview';
import { FileTree } from '@/components/dashboard/FileTree';
import { CodeEditor } from '@/components/dashboard/CodeEditor';
import { AIPromptInput } from '@/components/dashboard/AIPromptInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export function AIBuilder() {
  const { toast } = useToast();
  const { addMessage, messages, setMessages } = useChatStore();
  const { setPreviewHtml, previewHtml } = useProjectStore();
  const { user } = useUserStore();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [generatedFiles, setGeneratedFiles] = useState<{[key: string]: {code: string, displayed: string}}>({}); 
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(10); // characters per tick

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const simulateFileGeneration = async (htmlContent: string) => {
    // Parse the HTML to extract potential component structure
    const componentName = prompt.includes('component') 
      ? prompt.split(' ').find(word => word.match(/[A-Z][a-z]+/)) || 'Component' 
      : 'Page';
    
    // Create a simple component structure
    const files: {[key: string]: {code: string, displayed: string}} = {
      [`${componentName}.tsx`]: {
        code: `import React from 'react';\nimport styles from './${componentName}.module.css';\n\nexport const ${componentName} = () => {\n  return (\n    <div className={styles.container}>\n      ${htmlContent}\n    </div>\n  );\n};\n\nexport default ${componentName};`,
        displayed: ''
      },
      [`${componentName}.module.css`]: {
        code: `.container {\n  display: flex;\n  flex-direction: column;\n  padding: 1rem;\n  border-radius: 0.5rem;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n`,
        displayed: ''
      }
    };

    // Set the generated files
    setGeneratedFiles(files);
    setActiveFile(`${componentName}.tsx`);

    // Simulate typing effect for the active file
    await simulateTypingEffect(`${componentName}.tsx`, files[`${componentName}.tsx`].code);
    
    // After typing effect, set the preview HTML
    const combinedHTML = `
      <style>${files[`${componentName}.module.css`].code}</style>
      <div class="container">${htmlContent}</div>
    `;
    setPreviewHtml(combinedHTML);
  };

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
      await new Promise(resolve => setTimeout(resolve, 10));
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

  const handlePromptSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !file) return;

    addMessage({ role: 'user', content: prompt });
    setPrompt('');
    setIsGenerating(true);
    setActiveTab('code');

    try {
      const r = await fetch("/api/generate", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ prompt }) 
      });
      
      if (!r.ok) {
        throw new Error(`HTTP error! Status: ${r.status}`);
      }
      
      const j = await r.json();
      const html = j?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!html) {
        throw new Error("No content generated");
      }
      
      // Simulate file generation and typing effect
      await simulateFileGeneration(html);
      
      addMessage({ 
        role: 'assistant', 
        content: `I've created the ${activeFile} based on your prompt. You can view the code and preview.`
      });
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

  const handleFileClick = (fileName: string) => {
    setActiveFile(fileName);
    if (generatedFiles[fileName]) {
      simulateTypingEffect(fileName, generatedFiles[fileName].code);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`p-2 rounded-md ${message.role === 'user' ? 'bg-blossom-100 ml-auto' : 'bg-gray-100 mr-auto'}`}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-1 space-x-4 overflow-hidden">
        {/* File tree panel */}
        <div className="w-64 border-r border-gray-200 overflow-y-auto">
          <FileTree 
            files={Object.keys(generatedFiles)} 
            activeFile={activeFile}
            onFileClick={handleFileClick}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList>
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

      <form onSubmit={handlePromptSubmit} className="flex items-center space-x-2">
        <AIPromptInput 
          handleSubmit={handlePromptSubmit}
          prompt={prompt}
          setPrompt={setPrompt}
        />
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary"
        >
          Upload File
        </button>
        <button type="submit" className="btn-primary" disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </form>
    </div>
  );
}
