
import React, { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/dashboard/AIResponseDisplay';
import { geminiProvider } from '@/lib/providers/gemini';
import { ProjectStatus } from '@/stores/projectStore';
import { 
  createDefaultFilesForTemplate, 
  detectProjectType, 
  getTemplatePrompt, 
  projectTemplates 
} from '@/utils/projectTemplates';
import { processToken } from '@/utils/fileHelpers';
import { 
  ProjectFiles, 
  ProjectTemplate 
} from './types';
import { 
  ensureRequiredFilesExist, 
  extractProjectName, 
  findMainFile, 
  fixScssImports, 
  parseProjectFiles, 
  verifyTemplateFilesExist 
} from './utils';

interface CodeGeneratorProps {
  setProjectFiles: (files: ProjectFiles) => void;
  setGeneratedCode: (code: string) => void;
  setActiveFile: (file: string) => void;
  setProjectName: (name: string) => void;
  setDetectedType: (type: string | null) => void;
  setActiveTab: (tab: string) => void;
  setShowTemplateSelector: (show: boolean) => void;
  setErrorMessage: (error: string | null) => void;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setStreamingMessage: React.Dispatch<React.SetStateAction<string>>;
  setCurrentMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTemplate: ProjectTemplate | null;
}

export default function CodeGenerator({
  setProjectFiles,
  setGeneratedCode,
  setActiveFile,
  setProjectName,
  setDetectedType,
  setActiveTab,
  setShowTemplateSelector,
  setErrorMessage,
  setChatMessages,
  setStreamingMessage,
  setCurrentMessageId,
  selectedTemplate
}: CodeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePromptSubmit = async (prompt: string) => {
    setIsGenerating(true);
    setErrorMessage(null);
    
    const userMessageId = uuidv4();
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: prompt,
      createdAt: new Date(),
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    
    const aiMessageId = uuidv4();
    setCurrentMessageId(aiMessageId);
    setStreamingMessage('');
    
    setChatMessages(prev => [
      ...prev,
      {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        isStreaming: true
      }
    ]);
    
    try {
      const extractedName = extractProjectName(prompt);
      setProjectName(extractedName);
      
      const type = detectProjectType(prompt);
      setDetectedType(type);
      
      const templateInstructions = getTemplatePrompt(type);
      
      let initialFiles: ProjectFiles = {};
      if (selectedTemplate) {
        initialFiles = createDefaultFilesForTemplate(selectedTemplate.type);
      }
      
      let streamedText = '';
      let codeBuffer = '';
      let inCodeBlock = false;
      
      await geminiProvider.stream({
        messages: [
          {
            role: 'user',
            content: `Generate a complete React website based on this description: "${prompt}". 

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

${templateInstructions}

Important requirements:
1. Use functional components with TypeScript (React.FC<Props>)
2. Use SCSS modules for styling (.module.scss files)
3. Proper imports and exports between files
4. Use react-router-dom for navigation if needed
5. All TypeScript types must be properly defined
6. Make it visually appealing with a modern design
7. Make sure the code is fully functional and the website is responsive
8. IMPORTANT: Define all SCSS variables! Create a variables.scss file with at least these variables:
   $primary-color: #f59e0b;
   $secondary-color: #3b82f6;
   $text-color: #374151;
   $background-color: #ffffff;
   And import it into all other SCSS files using the CORRECT RELATIVE PATH!
9. CRITICAL: All imports from the src directory MUST use the @/ prefix.
   For example: import Component from '@/components/Component';
10. Make sure App.tsx properly imports ALL page components and sets up routes to them!

Return the complete multi-file project as a single response with clear file path indicators like:
// FILE: src/App.tsx
// code here...

// FILE: src/components/Header.tsx
// code here...

Do not include any explanations, just the code files. Make sure to implement all necessary features for a production-ready application.`
          }
        ],
        model: "gemini-2.5-flash-preview",
        onToken: (token) => {
          const processedToken = processToken(token);
          streamedText += processedToken;
          
          setStreamingMessage(streamedText);
          
          setChatMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: streamedText, isStreaming: true } 
                : msg
            )
          );
          
          if (processedToken.includes("// FILE:")) {
            inCodeBlock = true;
          }
          
          if (inCodeBlock) {
            codeBuffer += processedToken;
          }
        }
      });
      
      // Use the existing parseProjectFiles function to extract files from the AI response
      let parsedFiles = parseProjectFiles(codeBuffer || streamedText);
      
      if (Object.keys(initialFiles).length > 0) {
        parsedFiles = { ...initialFiles, ...parsedFiles };
      }
      
      if (type && projectTemplates[type]) {
        const template = projectTemplates[type];
        parsedFiles = ensureRequiredFilesExist(parsedFiles, template);
      }
      
      const fixedFiles = fixScssImports(parsedFiles);
      
      setProjectFiles(fixedFiles);
      setGeneratedCode(JSON.stringify(fixedFiles, null, 2));
      
      let mainFile = findMainFile(fixedFiles, type);
      setActiveFile(mainFile);
      
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { 
                ...msg, 
                content: streamedText, 
                isStreaming: false,
                codeFiles: Object.keys(parsedFiles).map(path => ({
                  path,
                  content: parsedFiles[path].code.substring(0, 40) + '...'
                }))
              } 
            : msg
        )
      );
      
      setStreamingMessage('');
      setCurrentMessageId(null);
      
      if (selectedTemplate && !verifyTemplateFilesExist(fixedFiles, selectedTemplate)) {
        toast.warning("Some template files may be missing. Please check your generated code.");
      } else {
        toast.success("Website generated successfully!");
      }
      
      setActiveTab('preview');
      setShowTemplateSelector(false);
    } catch (error) {
      console.error("Error generating website:", error);
      toast.error("Failed to generate website: " + (error instanceof Error ? error.message : "Unknown error"));
      setErrorMessage(error instanceof Error ? error.message : "Unknown error generating website");
      
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { 
                ...msg, 
                content: `Error generating website: ${error instanceof Error ? error.message : "Unknown error"}`,
                isStreaming: false 
              } 
            : msg
        )
      );
      
      setStreamingMessage('');
      setCurrentMessageId(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handlePromptSubmit,
    isGenerating
  };
}
