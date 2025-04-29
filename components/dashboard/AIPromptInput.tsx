
import React from 'react';

interface AIPromptInputProps {
  handleSubmit: () => void;
  prompt: string;
  setPrompt: (value: string) => void;
}

export const AIPromptInput: React.FC<AIPromptInputProps> = ({ handleSubmit, prompt, setPrompt }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <input
      type="text"
      placeholder="Enter your prompt"
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      onKeyDown={handleKeyDown}
      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blossom-500"
    />
  );
};
