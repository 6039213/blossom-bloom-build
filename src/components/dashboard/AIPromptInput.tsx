
import { useState, KeyboardEvent, FormEvent } from "react";

interface Props { 
  onSend?: (p: string) => void;
  onSubmit?: (p: string) => void;
  disabled?: boolean;
  showSaveButton?: boolean;
  onSaveCode?: () => void;
  onReportError?: (error: Error) => void;
  isProcessing?: boolean;
}

export default function AIPromptInput({ 
  onSend, 
  onSubmit, 
  disabled, 
  showSaveButton, 
  onSaveCode, 
  onReportError,
  isProcessing 
}: Props) {
  const [prompt, setPrompt] = useState("");
  
  const send = (e?: FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;
    
    // Call either onSend or onSubmit (for backwards compatibility)
    if (onSend) onSend(prompt);
    if (onSubmit) onSubmit(prompt);
    
    setPrompt("");
  };
  
  const key = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); 
      send(); 
    }
  };
  
  return (
    <form onSubmit={send} className="flex gap-2">
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        onKeyDown={key}
        disabled={disabled || isProcessing}
        className="flex-1 resize-none rounded-md border p-3 focus:ring-blossom-500 min-h-[80px]"
        placeholder="Describe the website you want to build…"
      />
      <div className="flex flex-col gap-2">
        <button 
          disabled={disabled || isProcessing || !prompt.trim()}
          className="rounded-md bg-blossom-500 px-4 py-2 text-white hover:bg-blossom-600"
        >
          Generate
        </button>
        
        {showSaveButton && onSaveCode && (
          <button
            type="button"
            onClick={onSaveCode}
            className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Save Project
          </button>
        )}
        
        {onReportError && (
          <button
            type="button"
            onClick={() => onReportError(new Error("User reported issue"))}
            className="rounded-md border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Report Issue
          </button>
        )}
      </div>
    </form>
  );
}
