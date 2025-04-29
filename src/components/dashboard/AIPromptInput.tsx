
import { useState, KeyboardEvent, FormEvent } from "react";

interface Props { 
  onSend: (p: string) => void; 
  disabled?: boolean 
}

export default function AIPromptInput({ onSend, disabled }: Props) {
  const [prompt, setPrompt] = useState("");
  
  const send = (e?: FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;
    onSend(prompt);
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
        disabled={disabled}
        className="flex-1 resize-none rounded-md border p-3 focus:ring-blossom-500 min-h-[80px]"
        placeholder="Describe the website you want to build…"
      />
      <button 
        disabled={disabled || !prompt.trim()}
        className="rounded-md bg-blossom-500 px-4 py-2 text-white hover:bg-blossom-600"
      >
        Generate
      </button>
    </form>
  );
}
