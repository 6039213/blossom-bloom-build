
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getSelectedModel } from '@/lib/llm/modelSelection';
import { Card } from '@/components/ui/card';
import AIModelSelector from '@/components/dashboard/AIModelSelector';
import { toast } from 'sonner';

// Helper function to clean code blocks from AI responses
const extractCodeBlocks = (response: string) => {
  const codeBlocks: Record<string, string> = {};
  const fileRegex = /```(?:typescript|jsx|tsx|js|html|css)(?: ([^\n]+))?\n([\s\S]*?)```/g;
  
  let match;
  while ((match = fileRegex.exec(response)) !== null) {
    const fileName = match[1]?.trim() || `file-${Object.keys(codeBlocks).length + 1}.tsx`;
    const codeContent = match[2];
    codeBlocks[fileName] = codeContent;
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
  const [selectedModel, setSelectedModel] = useState('claude');

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    toast.success(`Now using ${model === 'claude' ? 'Claude 3.7 Sonnet' : 'Gemini 2.5 Flash'}`);
  };
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsGenerating(true);
    setStreamingResponse('');
    
    try {
      // Get the selected AI model
      const model = getSelectedModel();
      
      // Stream response from AI model
      let fullResponse = '';
      
      const addToken = (token: string) => {
        fullResponse += token;
        setStreamingResponse(fullResponse);
      };
      
      // Call the API to generate code
      const streamHandler = await model.generateStream(
        prompt, 
        addToken, 
        {
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      );
      
      // Process the stream
      for await (const chunk of streamHandler) {
        // Processing is handled by addToken callback
        console.log("Stream chunk received", chunk.length);
      }
      
      // Extract code blocks from response
      const codeBlocks = extractCodeBlocks(fullResponse);
      
      // If no code blocks were found, show an error
      if (Object.keys(codeBlocks).length === 0) {
        toast.error('No code blocks found in response');
      } else {
        // Pass the extracted code blocks to the parent component
        onCodeGenerated(codeBlocks);
        toast.success(`Generated ${Object.keys(codeBlocks).length} files`);
      }
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error(`Failed to generate code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStream = async (response: StreamResponse) => {
    // SafeGuard for error response type
    if (response.error) {
      toast.error('Error in code generation');
      return;
    }
    
    // Only process responses with diff content
    if (response.diff !== undefined) {
      setStreamingResponse(prev => prev + response.diff);
    }
    
    // If the stream is done, notify the user
    if (response.done) {
      toast.success(`Code generation complete. Files changed: ${response.filesChanged.join(', ')}`);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Generate Code</h2>
        <AIModelSelector 
          selectedModel={selectedModel} 
          onSelectModel={handleModelChange} 
        />
      </div>
      
      <Card className="p-4 bg-white dark:bg-gray-900">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the website or component you want to create..."
          className="min-h-[100px] mb-4"
          disabled={isGenerating}
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGenerating ? 'Generating...' : 'Generate Code'}
          </Button>
        </div>
      </Card>
      
      {streamingResponse && (
        <Card className="p-4 bg-gray-50 dark:bg-gray-800 overflow-auto max-h-[300px]">
          <h3 className="font-medium mb-2">AI Response:</h3>
          <pre className="whitespace-pre-wrap text-sm">
            {streamingResponse}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default CodeGenerator;
