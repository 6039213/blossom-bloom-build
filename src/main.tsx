
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import '@/index.css';
import AppRoutes from './App.routes';

// Create a client for React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <AppRoutes />
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
