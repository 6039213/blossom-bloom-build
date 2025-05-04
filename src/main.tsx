
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import LoadingScreen from '@/components/LoadingScreen';
import '@/index.css';

// Use lazy loading for the routes
const AppRoutes = lazy(() => import('./App.routes'));

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Add smooth page transitions
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <div className="page-transition">
    {children}
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <Suspense fallback={<LoadingScreen isLoading={true} />}>
          <PageTransition>
            <AppRoutes />
          </PageTransition>
        </Suspense>
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
