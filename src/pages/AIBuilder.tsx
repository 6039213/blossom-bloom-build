
import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AIWebBuilder from '@/components/dashboard/AIWebBuilder';
import { toast } from 'sonner';
import { getAvailableModels, setSelectedModel } from '@/lib/llm/modelSelection';

export default function AIBuilder() {
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModelState] = useState<string>('claude');
  const [error, setError] = useState<string | null>(null);
  
  // Page title effect and model initialization
  useEffect(() => {
    document.title = "Blossom AI Builder";
    
    const initModels = async () => {
      setIsLoading(true);
      try {
        // Check for API keys
        const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
        
        let initialModel = 'claude';
        
        if (!anthropicKey && !geminiKey) {
          toast.warning("No AI API keys configured. Please add VITE_ANTHROPIC_API_KEY to use the AI builder.");
          setError("No API keys configured");
        } else if (anthropicKey) {
          initialModel = 'claude';
          setSelectedModel('claude');
          toast.success("Using Claude 3.7 Sonnet for AI generation");
        } else if (geminiKey) {
          initialModel = 'gemini';
          setSelectedModel('gemini');
          toast.info("Using Gemini 2.5 Flash for AI generation (Claude is recommended)");
        }
        
        setSelectedModelState(initialModel);
        
        // Get available models
        const models = getAvailableModels();
        if (models && models.length > 0) {
          setAvailableModels(models);
        } else {
          // Fallback to default models
          const fallbackModels = [{
            id: initialModel,
            name: initialModel === 'claude' ? 'Claude 3.7 Sonnet' : 'Gemini 2.5 Flash',
            provider: initialModel === 'claude' ? 'Anthropic' : 'Google',
            available: !!((initialModel === 'claude' && anthropicKey) || (initialModel === 'gemini' && geminiKey))
          }];
          setAvailableModels(fallbackModels);
        }
      } catch (error) {
        console.error('Error initializing models:', error);
        setError("Failed to initialize AI models");
        // Fallback to default models
        setAvailableModels([{
          id: 'claude',
          name: 'Claude 3.7 Sonnet',
          provider: 'Anthropic',
          available: false
        }]);
      } finally {
        setIsModelsLoaded(true);
        setIsLoading(false);
      }
    };
    
    initModels();
  }, []);

  // Wait for models to load before rendering the full UI
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center p-6 max-w-md">
          <div className="bg-red-500 text-white p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">AI Configuration Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm">To fix this issue, please check your .env file and add the required API keys.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Website Builder</h1>
          <div className="flex items-center gap-2">
            {isModelsLoaded && availableModels && availableModels.length > 0 && (
              <span className="text-sm text-muted-foreground">
                Powered by {availableModels[0]?.name || "AI"}
              </span>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden">
          <AIWebBuilder selectedModel={selectedModel} />
        </main>
      </div>
    </div>
  );
}
