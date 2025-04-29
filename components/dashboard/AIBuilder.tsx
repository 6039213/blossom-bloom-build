
import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useChatStore } from '@/stores/chat';
import { useProjectStore } from '@/stores/project';
import { useUserStore } from '@/stores/user';
import { useToast } from '@/components/ui/use-toast';
import { WebContainerPreview } from '@/components/dashboard/WebContainerPreview';

export function AIBuilder() {
  const { toast } = useToast();
  const { addMessage, messages, setMessages } = useChatStore();
  const { setPreviewHtml } = useProjectStore();
  const { user } = useUserStore();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handlePromptSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !file) return;

    addMessage({ role: 'user', content: prompt });
    setPrompt('');
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch(
        `/api/models/gemini-2.5-flash-preview:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        setPreviewHtml(data.candidates[0].content.parts[0].text);
      } else {
        toast({
          title: "Error",
          description: "No content generated.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`p-2 rounded-md ${message.role === 'user' ? 'bg-blossom-100 ml-auto' : 'bg-gray-100 mr-auto'}`}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <WebContainerPreview />

      <form onSubmit={handlePromptSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blossom-500"
        />
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary"
        >
          Upload File
        </button>
        <button type="submit" className="btn-primary" disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </form>
    </div>
  );
}
