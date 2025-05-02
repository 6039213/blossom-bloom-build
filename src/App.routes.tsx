
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import FeaturesPage from './pages/FeaturesPage';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import Team from './pages/TeamPage';
import Settings from './pages/Settings';
import Help from './pages/HelpPage';
import NotFound from './pages/NotFound';
import AIBuilder from './pages/AIBuilder';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';

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
    path: '/features',
    element: <FeaturesPage />
  },
  {
    path: '/pricing',
    element: <Pricing />
  },
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/team',
    element: <Team />
  },
  {
    path: '/settings',
    element: <Settings />
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
