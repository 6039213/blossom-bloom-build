
import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AIWebBuilder from '@/components/dashboard/AIWebBuilder';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function AIBuilder() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Page title effect and model initialization
  useEffect(() => {
    document.title = "Blossom AI Builder";
    
    const initAI = async () => {
      setIsLoading(true);
      try {
        toast.success("Blossom AI initialized");
      } catch (error) {
        console.error('Error initializing AI:', error);
        setError('Failed to initialize AI. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initAI();
  }, []);

  // Wait for models to load before rendering the full UI
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Blossom is initializing...</p>
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
        </header>
        
        <main className="flex-1 overflow-hidden">
          {error ? (
            <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-md m-4">
              <p>{error}</p>
              <p className="mt-2">Please try again or contact support if the issue persists.</p>
            </div>
          ) : null}
          <AIWebBuilder />
        </main>
      </div>
    </div>
  );
}
