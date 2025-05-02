
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
        // We have a hardcoded Anthropic key, so we can always use Claude
        const initialModel = 'claude';
        setSelectedModelState(initialModel);
        setSelectedModel('claude');
        
        // Get available models
        const models = getAvailableModels();
        if (models && models.length > 0) {
          setAvailableModels(models);
        }
        
        toast.success("Using Claude 3.7 Sonnet for AI generation");
      } catch (error) {
        console.error('Error initializing models:', error);
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
