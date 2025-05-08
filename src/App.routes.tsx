
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import AIBuilder from './pages/AIBuilder';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';

// Update favicon
document.querySelector('link[rel="icon"]')?.setAttribute('href', '/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png');

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/dashboard/ai-builder',
    element: <AIBuilder />
  },
  {
    path: '/dashboard/projects',
    element: <ProjectsPage />
  },
  {
    path: '/dashboard/projects/:id',
    element: <ProjectDetail />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default function AppRoutes() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
