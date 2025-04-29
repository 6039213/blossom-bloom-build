
import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background">
      <div className="h-full">
        <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="grid h-screen"
             style={{gridTemplateColumns: sidebarOpen ? '256px 1fr' : '64px 1fr',
                     transition:'grid-template-columns .2s'}}>
          {children}
        </div>
      </div>
    </div>
  );
}
