import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

// Import pages - keep using lazy loading for better performance
const Index = lazy(() => import('./pages/Index'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Templates = lazy(() => import('./pages/Templates'));
const About = lazy(() => import('./pages/About'));
const Auth = lazy(() => import('./pages/Auth'));
const Team = lazy(() => import('./pages/TeamPage'));
const Settings = lazy(() => import('./pages/Settings'));
const ClaudeSettings = lazy(() => import('./pages/ClaudeSettings'));
const Help = lazy(() => import('./pages/HelpPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AIBuilder = lazy(() => import('./pages/AIBuilder'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

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
    path: '/dashboard/claude-settings',
    element: <ClaudeSettings />
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
      <Suspense fallback={<LoadingScreen isLoading={true} />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  );
}
