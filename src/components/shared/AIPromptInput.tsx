
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AIPromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing?: boolean;
}

export default function AIPromptInput({
  onSubmit,
  isProcessing = false
}: AIPromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [charCount, setCharCount] = useState(0);
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    try {
      await onSubmit(prompt);
      setPrompt('');
      setCharCount(0);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error("Error processing prompt:", error);
      toast.error("Failed to process your request. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
      <Textarea
        ref={textareaRef}
        placeholder="Describe the website you want to build... (e.g., 'Create a modern landing page for a coffee shop with a gold and brown color scheme')"
        value={prompt}
        onChange={handlePromptChange}
        disabled={isProcessing}
        className="min-h-32 resize-none"
      />
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {charCount} characters
        </div>
        
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isProcessing || !prompt.trim()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Generate Website
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
