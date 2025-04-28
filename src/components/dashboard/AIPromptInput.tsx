
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send, RefreshCw, Sparkles, Save, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { GEMINI_API_KEY, MODEL_LIST, DEFAULT_MODEL } from '@/lib/constants';
import AIModelSelector from './AIModelSelector';

interface AIPromptInputProps {
  onSubmit: (prompt: string, model?: string) => void;
  onSaveCode?: () => void;
  isProcessing?: boolean;
  showSaveButton?: boolean;
  onReportError?: (error: Error) => void;
}

export default function AIPromptInput({
  onSubmit,
  onSaveCode,
  isProcessing = false,
  showSaveButton = false,
  onReportError
}: AIPromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    setCharCount(value.length);
    
    // Auto-resize the textarea based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    if (!GEMINI_API_KEY) {
      toast.error("Gemini API key is not configured");
      return;
    }
    
    setIsLoading(true);
    try {
      // Call the onSubmit function with the prompt and selected model
      await onSubmit(prompt, selectedModel);
      
      // Don't clear the prompt input after successful submission
      // to maintain context for the user
    } catch (error) {
      console.error("Error processing prompt:", error);
      toast.error("Failed to process your request. Please try again.");
      
      // If error reporting is enabled, send the error
      if (onReportError && error instanceof Error) {
        onReportError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClear = () => {
    setPrompt('');
    setCharCount(0);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  // Character count color based on length
  const getCharCountColor = () => {
    if (charCount > 500) return "text-amber-500";
    if (charCount > 1000) return "text-red-500";
    return "text-muted-foreground";
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">What would you like to build?</h3>
        <AIModelSelector selectedModel={selectedModel} onSelectModel={handleModelChange} />
      </div>
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Describe the website you want to build... (e.g., 'Create a modern landing page for a coffee shop with a gold and brown color scheme')"
          value={prompt}
          onChange={handlePromptChange}
          disabled={isLoading || isProcessing}
          className="min-h-32 pr-12 resize-none border-blossom-200 focus:border-blossom-500 transition-all duration-200"
        />
        <Sparkles className="absolute right-3 top-3 h-5 w-5 text-blossom-400" />
        
        {/* Character count with dynamic color */}
        <div className={`absolute bottom-2 right-3 text-xs ${getCharCountColor()}`}>
          {charCount} characters
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          className="bg-blossom-500 hover:bg-blossom-600 text-white flex-grow md:flex-grow-0 md:min-w-[200px]"
          disabled={isLoading || isProcessing || !prompt.trim()}
        >
          {isLoading || isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isLoading ? 'Submitting...' : 'Processing...'}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Generate Website
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={isLoading || isProcessing || !prompt.trim()}
          className="flex-grow-0"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Clear
        </Button>
        
        {showSaveButton && onSaveCode && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveCode}
            disabled={isLoading || isProcessing}
            className="flex-grow md:flex-grow-0 md:ml-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Project
          </Button>
        )}
      </div>
    </form>
  );
}
