
import { useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AIWebBuilder from '@/components/dashboard/AIWebBuilder';

export default function AIBuilder() {
  // Page title effect
  useEffect(() => {
    document.title = "Blossom AI Builder";
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4">
          <h1 className="text-2xl font-bold">AI Website Builder</h1>
        </header>
        
        <main className="flex-1 overflow-hidden">
          <AIWebBuilder />
        </main>
      </div>
    </div>
  );
}
