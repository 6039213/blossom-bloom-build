
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import FileExplorer from './FileExplorer';
import CodePane from './CodePane';
import { generateCode, extractFilesFromResponse } from '@/lib/services/claudeService';
import { getFileType } from '@/utils/codeGeneration';

const BlossomsAIWebBuilder = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState<Array<{ path: string; content: string; type: string }>>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>('');

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate code");
      return;
    }
    
    setIsGenerating(true);
    setResponseText('');
    
    try {
      // Generate code using Claude API
      const response = await generateCode(
        prompt,
        files.map(file => ({ path: file.path, content: file.content })),
        (streamedText) => {
          setResponseText(streamedText);
        },
        {
          system: "You are an expert web developer who creates React and Tailwind CSS applications. Generate clean, well-structured code based on the user's prompt.",
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      );
      
      // Extract files from Claude's response
      const extractedFiles = extractFilesFromResponse(response);
      
      if (extractedFiles.length === 0) {
        toast.warning("No code files were generated. Try a more specific prompt.");
      } else {
        // Convert the extracted files to our file format
        const newFiles = extractedFiles.map(file => ({
          path: file.path,
          content: file.content,
          type: getFileType(file.path)
        }));
        
        // Update the files state
        setFiles(prevFiles => {
          // Create a map of existing files to check for duplicates
          const existingFilesMap = new Map(prevFiles.map(file => [file.path, file]));
          
          // Add or update files
          newFiles.forEach(newFile => {
            existingFilesMap.set(newFile.path, newFile);
          });
          
          // Convert map back to array
          const updatedFiles = Array.from(existingFilesMap.values());
          
          // Set the active file to the first file if no active file
          if (!activeFile && updatedFiles.length > 0) {
            setActiveFile(updatedFiles[0].path);
          }
          
          return updatedFiles;
        });
        
        toast.success(`Generated ${newFiles.length} files successfully!`);
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Failed to generate code"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h1 className="text-xl font-bold">Blossom AI Web Builder</h1>
        <p className="text-muted-foreground text-sm">Powered by Claude 3.7 Sonnet</p>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side: Prompt and File Explorer */}
        <div className="w-full md:w-1/3 border-r border-border flex flex-col">
          {/* Prompt input area */}
          <div className="p-4 border-b border-border">
            <form onSubmit={handleGenerateCode} className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website or component you want to generate..."
                className="min-h-[120px] resize-none"
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Code
                  </>
                )}
              </Button>
            </form>
          </div>
          
          {/* File explorer */}
          <div className="flex-1 overflow-auto p-2">
            <FileExplorer
              files={files}
              activeFile={activeFile}
              onFileSelect={(filePath) => setActiveFile(filePath)}
            />
          </div>
          
          {/* Response display (collapsible) */}
          {responseText && (
            <div className="border-t border-border p-2">
              <details className="text-xs">
                <summary className="cursor-pointer font-medium pb-2">Claude Response</summary>
                <div className="max-h-[200px] overflow-auto bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                  <pre className="whitespace-pre-wrap">{responseText}</pre>
                </div>
              </details>
            </div>
          )}
        </div>
        
        {/* Right side: Code Pane */}
        <div className="flex-1">
          <CodePane
            files={files}
            activeFile={activeFile}
          />
        </div>
      </div>
    </div>
  );
};

export default BlossomsAIWebBuilder;
