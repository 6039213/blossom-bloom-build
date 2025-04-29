
import React from 'react';

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
    <textarea
      placeholder="Enter your prompt here..."
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      className="flex-1 min-h-[100px] rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blossom-500 resize-none"
    />
  );
};
