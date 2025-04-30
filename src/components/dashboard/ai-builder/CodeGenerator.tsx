
import React, { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/dashboard/AIResponseDisplay';
import { ProjectStatus } from '@/stores/projectStore';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  createDefaultFilesForTemplate, 
  detectProjectType, 
  getTemplatePrompt, 
  projectTemplates 
} from '@/utils/projectTemplates';
import { processToken } from '@/utils/fileHelpers';
import { 
  GeminiResponse,
  ProjectFiles, 
  ProjectTemplate,
  RuntimeError
} from './types';
import { 
  ensureRequiredFilesExist, 
  extractProjectName, 
  findMainFile, 
  fixScssImports, 
  verifyTemplateFilesExist 
} from './utils';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

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
  runtimeError: RuntimeError | null;
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
  selectedTemplate,
  runtimeError
}: CodeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to generate code from a prompt using Gemini
  const generateCodeWithGemini = async (prompt: string): Promise<GeminiResponse> => {
    try {
      // Add template instructions if needed
      let enhancedPrompt = prompt;
      const projectType = detectProjectType(prompt);
      
      if (selectedTemplate) {
        enhancedPrompt = `${prompt}\n\nUse the ${selectedTemplate.displayName} template.`;
      }
      
      // Add instructions for code generation in a specific format
      enhancedPrompt += `\n\nPlease respond with code files in the following format:
      
// FILE: src/App.tsx
import React from 'react';
// Code content here...

// FILE: src/components/Example.tsx
import React from 'react';
// Code content here...

Provide a message explaining what you've done. If new npm packages are needed, mention them as "npmChanges".`;

      // If fixing a runtime error, modify the prompt
      if (runtimeError) {
        enhancedPrompt = `Fix this error in ${runtimeError.file || 'the code'}: "${runtimeError.message}"\n\nPlease provide only the fixed file(s).`;
      }

      // Create model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview" });
      
      // Generate content
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      });
      
      const response = result.response;
      const text = response.text();
      
      // Parse response to extract files and message
      const files: Record<string, string> = {};
      const filePattern = /\/\/ FILE: ([^\n]+)\n([\s\S]*?)(?=\/\/ FILE:|$)/g;
      
      let match;
      while ((match = filePattern.exec(text)) !== null) {
        const [, filePath, fileContent] = match;
        files[filePath.trim()] = fileContent.trim();
      }
      
      // Extract message and npm changes
      let message = "Generated code successfully";
      if (text.includes("✅")) {
        const messageParts = text.split("✅");
        if (messageParts.length > 1) {
          message = "✅" + messageParts[1].split("\n")[0].trim();
        }
      }
      
      // Look for npm install instructions
      const npmChanges: string[] = [];
      const npmPattern = /npm install ([a-zA-Z0-9-@\/]+)/g;
      let npmMatch;
      
      while ((npmMatch = npmPattern.exec(text)) !== null) {
        npmChanges.push(npmMatch[1]);
      }
      
      return {
        files,
        message,
        npmChanges: npmChanges.length > 0 ? npmChanges : undefined
      };
    } catch (error) {
      console.error("Error generating code with Gemini:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to generate code");
    }
  };

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
      // Extract project name from prompt
      const extractedName = extractProjectName(prompt);
      setProjectName(extractedName);
      
      // Detect project type
      const type = detectProjectType(prompt);
      setDetectedType(type);
      
      // Initial files for template
      let initialFiles: ProjectFiles = {};
      if (selectedTemplate) {
        initialFiles = createDefaultFilesForTemplate(selectedTemplate.type);
      }
      
      // Generate code using Gemini
      const geminiResponse = await generateCodeWithGemini(prompt);
      
      // Process response
      const generatedFiles: ProjectFiles = {};
      Object.entries(geminiResponse.files).forEach(([path, content]) => {
        generatedFiles[path] = { code: content };
      });
      
      // Merge with initial files if using a template
      let parsedFiles = { ...initialFiles, ...generatedFiles };
      
      // Ensure required files exist for the template
      if (type && projectTemplates[type]) {
        const template = projectTemplates[type];
        parsedFiles = ensureRequiredFilesExist(parsedFiles, template);
      }
      
      // Fix SCSS imports if any
      const fixedFiles = fixScssImports(parsedFiles);
      
      setProjectFiles(fixedFiles);
      setGeneratedCode(JSON.stringify(fixedFiles, null, 2));
      
      // Find the main file to show first
      let mainFile = findMainFile(fixedFiles, type);
      setActiveFile(mainFile);
      
      // Add AI response to chat
      const responseContent = geminiResponse.message;
      const updatedAIMessage = {
        id: aiMessageId,
        role: 'assistant' as const,
        content: responseContent,
        isStreaming: false,
        createdAt: new Date(),
        codeFiles: Object.keys(parsedFiles).map(path => ({
          path,
          content: parsedFiles[path].code.substring(0, 40) + '...'
        })),
        npmChanges: geminiResponse.npmChanges
      };
      
      setChatMessages(prev => 
        prev.map(msg => msg.id === aiMessageId ? updatedAIMessage : msg)
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

  // Handle fixing a runtime error
  const handleFixError = async () => {
    if (!runtimeError) return;
    
    // Create a prompt to fix the error
    const fixPrompt = `Fix deze fout in ${runtimeError.file || 'de code'}: ${runtimeError.message}. Alleen deze file aanpassen, geen andere bestanden wijzigen.`;
    
    // Submit the prompt to be processed
    await handlePromptSubmit(fixPrompt);
  };

  return {
    handlePromptSubmit,
    handleFixError,
    isGenerating
  };
}
