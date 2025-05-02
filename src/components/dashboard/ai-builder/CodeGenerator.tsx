
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getSelectedModel } from '@/lib/llm/modelSelection';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Sparkles, Send } from 'lucide-react';

// Helper function to clean code blocks from AI responses
const extractCodeBlocks = (response: string) => {
  const codeBlocks: Record<string, string> = {};
  
  // Extract code blocks with file names
  const fileRegex = /```(?:typescript|jsx|tsx|js|html|css)(?: ([^\n]+))?\n([\s\S]*?)```/g;
  let match;
  while ((match = fileRegex.exec(response)) !== null) {
    const fileName = match[1]?.trim() || `file-${Object.keys(codeBlocks).length + 1}.tsx`;
    const codeContent = match[2];
    codeBlocks[fileName] = codeContent;
  }
  
  // If no files were found, also check for FILE: format
  if (Object.keys(codeBlocks).length === 0) {
    const fileBlockRegex = /\/\/\s*FILE:\s*([^\n]+)\n([\s\S]*?)(?=\/\/\s*FILE:|$)/g;
    while ((match = fileBlockRegex.exec(response)) !== null) {
      const fileName = match[1]?.trim();
      const codeContent = match[2]?.trim();
      
      if (fileName && codeContent) {
        codeBlocks[fileName] = codeContent;
      }
    }
  }
  
  return codeBlocks;
};

interface CodeGeneratorProps {
  onCodeGenerated: (files: Record<string, string>) => void;
  initialPrompt?: string;
}

interface StreamResponse {
  diff?: string;
  filesChanged: string[];
  done?: boolean;
  error?: boolean;
}

export const CodeGenerator = ({ onCodeGenerated, initialPrompt = '' }: CodeGeneratorProps) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  
  const enhancePrompt = (userPrompt: string) => {
    return `
Create a complete, working React application (using TypeScript and Tailwind CSS) based on this description:

"${userPrompt}"

Follow these rules:
1. Generate all necessary files with TypeScript (.tsx) for components
2. Use modern React patterns and hooks
3. Use Tailwind CSS for all styling
4. Create reusable components
5. Add comments to explain complex logic
6. Ensure the application is responsive
7. Include realistic placeholder content/data

Format each file like:
\`\`\`tsx src/components/ComponentName.tsx
// Component code here
\`\`\`

or alternatively:

// FILE: src/components/ComponentName.tsx
// Component code here

Make sure the application is complete and works without additional modification.
    `;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsGenerating(true);
    setStreamingResponse('');
    
    try {
      // Get the Claude 3.7 Sonnet model
      const model = getSelectedModel();
      
      // Stream response from AI model
      let fullResponse = '';
      
      const addToken = (token: string) => {
        fullResponse += token;
        setStreamingResponse(fullResponse);
      };
      
      toast.info("Generating your complete web application with Claude 3.7 Sonnet...");
      
      // Call the API to generate code with enhanced prompt
      await model.generateStream(
        enhancePrompt(prompt), 
        addToken, 
        {
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      );
      
      // Extract code blocks from response
      const codeBlocks = extractCodeBlocks(fullResponse);
      
      // If no code blocks were found, show an error
      if (Object.keys(codeBlocks).length === 0) {
        toast.error('No code blocks found in the AI response. Please try again with a more specific prompt.');
      } else {
        // Pass the extracted code blocks to the parent component
        onCodeGenerated(codeBlocks);
        toast.success(`Generated ${Object.keys(codeBlocks).length} files for your application`);
      }
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error(`Failed to generate code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
          Generate Full Web Application
        </h2>
        <div className="text-sm text-muted-foreground">
          <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded text-xs font-medium">
            Claude 3.7 Sonnet
          </span>
        </div>
      </div>
      
      <Card className="p-4 bg-white dark:bg-gray-900">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the website or application you want to create in detail..."
          className="min-h-[120px] mb-4 resize-none"
          disabled={isGenerating}
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
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
                <Send className="h-4 w-4" />
                Generate Web App
              </>
            )}
          </Button>
        </div>
      </Card>
      
      {streamingResponse && (
        <Card className="p-4 bg-gray-50 dark:bg-gray-800 overflow-auto max-h-[300px]">
          <h3 className="font-medium mb-2">AI Generating Your Application:</h3>
          <div className="whitespace-pre-wrap text-sm">
            <span className="text-blue-600">Claude 3.7 Sonnet is creating files for your application...</span>
            <div className="mt-2 pl-2 border-l-2 border-blue-300">
              {streamingResponse.length > 500 ? 
                streamingResponse.substring(0, 200) + "... " + 
                streamingResponse.substring(streamingResponse.length - 300) : 
                streamingResponse}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CodeGenerator;
