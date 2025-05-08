
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Templates from './pages/Templates';
import About from './pages/About';
import Auth from './pages/Auth';
import Team from './pages/TeamPage';
import Settings from './pages/Settings';
import Help from './pages/HelpPage';
import NotFound from './pages/NotFound';
import AIBuilder from './pages/AIBuilder';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';

// Update favicon in index.html
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
    path: '/dashboard/help',
    element: <Help />
  },
  {
    path: '/dashboard/team',
    element: <Team />
  },
  {
    path: '/dashboard/settings',
    element: <Settings />
  },
  {
    path: '/features',
    element: <Features />
  },
  {
    path: '/pricing',
    element: <Pricing />
  },
  {
    path: '/templates',
    element: <Templates />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/auth',
    element: <Auth />
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
