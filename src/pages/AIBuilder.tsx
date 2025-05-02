
import { useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AIWebBuilder from '@/components/dashboard/AIWebBuilder';
import { toast } from 'sonner';

export default function AIBuilder() {
  // Page title effect
  useEffect(() => {
    document.title = "Blossom AI Builder";
    
    // Check for API keys
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!anthropicKey && !geminiKey) {
      toast.warning("No AI API keys configured. Please add VITE_ANTHROPIC_API_KEY to use the AI builder.");
    } else if (anthropicKey) {
      toast.success("Using Claude 3.7 Sonnet for AI generation");
    } else if (geminiKey) {
      toast.info("Using Gemini 2.5 Flash for AI generation (Claude is recommended)");
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Website Builder</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Powered by Claude 3.7 Sonnet</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden">
          <AIWebBuilder />
        </main>
      </div>
    </div>
  );
}
