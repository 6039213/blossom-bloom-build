
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface AIPromptInputProps {
  handleSubmit: () => void;
  prompt: string;
  setPrompt: (value: string) => void;
  isDisabled?: boolean;
}

export const AIPromptInput: React.FC<AIPromptInputProps> = ({ 
  handleSubmit, 
  prompt, 
  setPrompt,
  isDisabled = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col w-full space-y-2">
      <textarea
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        className="flex-1 min-h-[100px] rounded-md border border-blossom-200 p-3 focus:outline-none focus:ring-2 focus:ring-blossom-500 resize-none w-full"
      />
      <Button 
        onClick={handleSubmit}
        disabled={isDisabled || !prompt.trim()}
        className="bg-blossom-500 hover:bg-blossom-600 text-white self-end"
      >
        <Send className="mr-2 h-4 w-4" />
        Generate
      </Button>
    </div>
  );
};
