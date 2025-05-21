
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getSelectedModel } from '@/lib/llm/modelSelection';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Sparkles, Send } from 'lucide-react';

// Enhanced helper function to clean code blocks from AI responses
const extractCodeBlocks = (response: string) => {
  const codeBlocks: Record<string, string> = {};
  
  // Extract code blocks with file names (multiple formats)
  const formats = [
    // Format: ```tsx src/components/Button.tsx
    {
      regex: /```(?:typescript|tsx|jsx|ts|js|html|css)(?: ([^\n]+))?\n([\s\S]*?)```/g,
      fileNameIndex: 1,
      codeIndex: 2
    },
    // Format: // FILE: src/components/Button.tsx
    {
      regex: /\/\/\s*FILE:\s*([^\n]+)\n([\s\S]*?)(?=\/\/\s*FILE:|$)/g,
      fileNameIndex: 1,
      codeIndex: 2
    },
    // Format: /* FILE: src/components/Button.tsx */
    {
      regex: /\/\*\s*FILE:\s*([^\n]+)\s*\*\/\n([\s\S]*?)(?=\/\*\s*FILE:|$)/g,
      fileNameIndex: 1,
      codeIndex: 2
    }
  ];
  
  // Try each format
  for (const format of formats) {
    let match;
    while ((match = format.regex.exec(response)) !== null) {
      const fileName = match[format.fileNameIndex]?.trim();
      const codeContent = match[format.codeIndex]?.trim();
      
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

export const CodeGenerator = ({ onCodeGenerated, initialPrompt = '' }: CodeGeneratorProps) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  
  const enhancePrompt = (userPrompt: string) => {
    return `
I need you to create a professional, complete, and fully-functional React application using TypeScript and Tailwind CSS based on this description:

"${userPrompt}"

Guidelines:
1. Generate ALL necessary files to make the application fully functional
2. Use TypeScript (.tsx) for all React components
3. Use modern React patterns (hooks, functional components)
4. Implement proper TypeScript types and interfaces
5. Use Tailwind CSS for all styling with responsive design
6. Create reusable, well-structured components
7. Add detailed comments explaining complex logic
8. Include realistic placeholder content/data
9. Ensure all code is production-ready and follows best practices
10. Create a clean, professional UI based on modern design principles

Format each file with clear headers:

\`\`\`tsx src/components/ComponentName.tsx
// Component code here with imports, types, and full implementation
\`\`\`

Make sure to create:
- All necessary component files (.tsx)
- Any required utility/helper files (.ts)
- CSS files if needed (though prefer Tailwind inline)
- Type definition files
- Main App.tsx and other core files

The application should be complete, functional, and ready to run without any additional modifications.
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
      // Get the AI model
      const model = getSelectedModel();
      
      // Stream response from AI model
      let fullResponse = '';
      
      const addToken = (token: string) => {
        fullResponse += token;
        setStreamingResponse(fullResponse);
      };
      
      toast.info("Blossom AI is building your web application...");
      
      console.log("Creating your application with Blossom AI...");
      
      // Call the API to generate code with enhanced prompt
      const result = await model.generateStream(
        enhancePrompt(prompt), 
        addToken, 
        {
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      );
      
      // Only proceed with parsing if we have a successful response
      if (result.complete && fullResponse) {
        // Extract code blocks from response
        const codeBlocks = extractCodeBlocks(fullResponse);
        
        // If no code blocks were found, show an error
        if (Object.keys(codeBlocks).length === 0) {
          console.error("No code blocks found in response:", fullResponse.substring(0, 500) + "...");
          toast.error('Please try again with a more specific prompt.');
        } else {
          console.log(`Generated ${Object.keys(codeBlocks).length} files:`, Object.keys(codeBlocks));
          
          // Pass the extracted code blocks to the parent component
          onCodeGenerated(codeBlocks);
          toast.success(`Generated ${Object.keys(codeBlocks).length} files for your application`);
        }
      } else {
        toast.error('Failed to generate a complete response. Please try again.');
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
      </div>
      
      <Card className="p-4 bg-white dark:bg-gray-900">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the website or application you want to create in detail... (e.g., 'Create a modern e-commerce site for selling handmade jewelry with product listings, shopping cart, and checkout flow')"
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
                Building...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Web App
              </>
            )}
          </Button>
        </div>
      </Card>
      
      {streamingResponse && (
        <Card className="p-4 bg-gray-50 dark:bg-gray-800 overflow-auto max-h-[300px]">
          <h3 className="font-medium mb-2">Blossom AI is building your application:</h3>
          <div className="whitespace-pre-wrap text-sm">
            <span className="text-blue-600">Creating files for your application...</span>
            <div className="mt-2 pl-2 border-l-2 border-blue-300">
              {streamingResponse.length > 800 ? 
                streamingResponse.substring(0, 250) + "... " + 
                streamingResponse.substring(streamingResponse.length - 550) : 
                streamingResponse}
              {isGenerating && (
                <span className="animate-pulse">▌</span>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CodeGenerator;
