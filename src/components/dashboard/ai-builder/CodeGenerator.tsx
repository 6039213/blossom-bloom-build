
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
import { geminiStream } from '@/lib/llm/gemini';
import { applyDiff, installAndRestartIfNeeded } from '@/lib/builder/webcontainer';

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
      
      // Use the gemini stream
      const addToken = (token: string) => {
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
      };
      
      // Process the gemini stream with WebContainer integration
      try {
        for await (const chunk of geminiStream(prompt, addToken)) {
          if (chunk.diff) {
            try {
              await applyDiff(chunk.diff);
            } catch (error) {
              console.error("Error applying diff:", error);
            }
          }
          
          if (chunk.done && chunk.filesChanged && chunk.filesChanged.length > 0) {
            try {
              await installAndRestartIfNeeded(chunk.filesChanged);
            } catch (error) {
              console.error("Error installing dependencies:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error processing gemini stream:", error);
        throw error;
      }
      
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
