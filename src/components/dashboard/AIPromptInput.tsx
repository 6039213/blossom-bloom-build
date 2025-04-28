
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send, RefreshCw, Sparkles, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { GEMINI_API_KEY } from '@/lib/constants';

interface AIPromptInputProps {
  onSubmit: (prompt: string) => void;
  onSaveCode?: () => void;
  isProcessing?: boolean;
  showSaveButton?: boolean;
}

export default function AIPromptInput({
  onSubmit,
  onSaveCode,
  isProcessing = false,
  showSaveButton = false
}: AIPromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
      // Call the onSubmit function with the prompt
      await onSubmit(prompt);
      
      // Clear the prompt input after successful submission
      setPrompt('');
    } catch (error) {
      console.error("Error processing prompt:", error);
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Describe the website you want to build... (e.g., 'Create a modern landing page for a coffee shop with a gold and brown color scheme')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading || isProcessing}
          className="min-h-32 pr-12 resize-none border-blossom-200 focus:border-blossom-500"
        />
        <Sparkles className="absolute right-3 top-3 h-5 w-5 text-blossom-400" />
        
        {/* Character count */}
        <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
          {prompt.length} characters
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button
          type="submit"
          className="bg-blossom-500 hover:bg-blossom-600 text-white flex-1"
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
          onClick={() => setPrompt('')}
          disabled={isLoading || isProcessing || !prompt.trim()}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </Button>
        
        {showSaveButton && onSaveCode && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveCode}
            disabled={isLoading || isProcessing}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Project
          </Button>
        )}
      </div>
    </form>
  );
}
