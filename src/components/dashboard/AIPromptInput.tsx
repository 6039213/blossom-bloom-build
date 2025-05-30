
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Send, XCircle, Upload, ImagePlus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
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
    
    if (!prompt.trim() && uploadedFiles.length === 0) {
      toast.error("Please enter a prompt");
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
      
      // Only clear prompt after successful submission
      setPrompt('');
      setCharCount(0);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
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
        setUploadProgress(0);
        
        const promises = Array.from(files).map(async (file, index) => {
          // Update progress as each file is processed
          const fileProgress = await simulateProgress(index, files.length);
          setUploadProgress(fileProgress);
          
          const fileUrl = await onFileUpload(file);
          return { name: file.name, url: fileUrl };
        });
        
        const results = await Promise.all(promises);
        setUploadProgress(null);
        
        // Add file references to uploaded files
        setUploadedFiles(prev => [
          ...prev, 
          ...results.map(r => `${r.name} (${r.url})`)
        ]);
        
        // Clear the file input to allow selecting the same files again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        toast.success(`${files.length} file(s) uploaded successfully!`);
      } catch (error) {
        setUploadProgress(null);
        toast.error("Failed to upload file");
        console.error(error);
      }
    }
  };
  
  // Helper function to simulate upload progress
  const simulateProgress = (index: number, total: number): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Calculate progress percentage (0-100)
        const progress = Math.round(((index + 1) / total) * 100);
        resolve(progress);
      }, 300); // Simulate network delay
    });
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
          <span className="text-xs font-medium text-blossom-600">Using Claude 3.7 Sonnet</span>
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
          <div className="mt-2 flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center px-2 py-1 rounded-full bg-blossom-100 text-blossom-800 text-xs">
                <ImagePlus className="h-3 w-3 mr-1" />
                <span className="truncate max-w-[150px]">{file}</span>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="ml-1 text-blossom-500 hover:text-blossom-700"
                >
                  <XCircle className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Upload progress */}
        {uploadProgress !== null && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blossom-500 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          className="bg-blossom-500 hover:bg-blossom-600 text-white flex-grow md:flex-grow-0 md:min-w-[180px]"
          disabled={isLoading || isProcessing || (!prompt.trim() && uploadedFiles.length === 0)}
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
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.md"
            onChange={handleFileChange}
          />
        </Button>
        
        {showSaveButton && onSaveCode && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveCode}
            className="ml-auto"
          >
            Save Project
          </Button>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">
        Tip: Use Ctrl+Enter to submit. Upload images and documents to include them in your prompt.
      </div>
    </form>
  );
}
