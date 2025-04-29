
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send, XCircle, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { GEMINI_API_KEY } from '@/lib/constants';

interface AIPromptInputProps {
  onSubmit: (prompt: string) => void;
  onSaveCode?: () => void;
  isProcessing?: boolean;
  showSaveButton?: boolean;
  onReportError?: (error: Error) => void;
  onFileUpload?: (file: File) => Promise<string>;
}

export default function AIPromptInput({
  onSubmit,
  onSaveCode,
  isProcessing = false,
  showSaveButton = false,
  onReportError,
  onFileUpload
}: AIPromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    
    if (!GEMINI_API_KEY) {
      toast.error("Gemini API key is not configured");
      return;
    }
    
    setIsLoading(true);
    try {
      // Add uploaded file references to the prompt
      let fullPrompt = prompt;
      if (uploadedFiles.length > 0) {
        fullPrompt += "\n\nIncorporate these uploaded files: " + uploadedFiles.join(", ");
      }
      
      // Call the onSubmit function with the enhanced prompt
      await onSubmit(fullPrompt);
      
      // Clear uploaded files after submission
      setUploadedFiles([]);
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

  // Handle Ctrl+Enter to submit form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (formRef.current) {
          e.preventDefault();
          formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const handleClear = () => {
    setPrompt('');
    setCharCount(0);
    setUploadedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileUpload = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileUpload) {
      try {
        const promises = Array.from(files).map(async (file) => {
          const fileUrl = await onFileUpload(file);
          return fileUrl;
        });
        
        const results = await Promise.all(promises);
        setUploadedFiles(prev => [...prev, ...results]);
        
        // Insert file info at cursor position or append to the end
        const filesList = results.map(url => `[File: ${url}]`).join(", ");
        if (textareaRef.current) {
          const cursorPos = textareaRef.current.selectionStart;
          const textBefore = prompt.substring(0, cursorPos);
          const textAfter = prompt.substring(cursorPos);
          const newText = `${textBefore}${filesList}${textAfter}`;
          setPrompt(newText);
          setCharCount(newText.length);
        }
        
        toast.success(`${files.length} file(s) uploaded successfully!`);
      } catch (error) {
        toast.error("Failed to upload file");
        console.error(error);
      }
    }
  };
  
  // Character count color based on length
  const getCharCountColor = () => {
    if (charCount > 500) return "text-amber-500";
    if (charCount > 1000) return "text-red-500";
    return "text-muted-foreground";
  };
  
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">What would you like to build?</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-blossom-600">Using Gemini 2.5 Flash</span>
        </div>
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
        
        {/* Character count with dynamic color */}
        <div className={`absolute bottom-2 right-3 text-xs ${getCharCountColor()}`}>
          {charCount} characters
        </div>
        
        {/* Display uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-2 text-xs flex flex-wrap gap-1">
            {uploadedFiles.map((file, index) => (
              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full bg-blossom-100 text-blossom-800">
                {file}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          className="bg-blossom-500 hover:bg-blossom-600 text-white flex-grow md:flex-grow-0 md:min-w-[180px]"
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
          disabled={isLoading || isProcessing || (!prompt.trim() && uploadedFiles.length === 0)}
          className="flex-grow-0"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Clear
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleFileUpload}
          disabled={isLoading || isProcessing || !onFileUpload}
          className="flex-grow-0"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple
            onChange={handleFileChange}
          />
        </Button>
      </div>
    </form>
  );
}
