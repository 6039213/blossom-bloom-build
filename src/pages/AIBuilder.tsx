
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
