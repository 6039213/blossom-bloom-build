
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features'; 
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import APISettings from './pages/APISettings';
import AIBuilder from './pages/AIBuilder';
import Projects from './pages/Projects';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/dashboard/ai-builder',
    element: <AIBuilder />,
  },
  {
    path: '/dashboard/projects',
    element: <Projects />,
  },
  {
    path: '/dashboard/help',
    element: <Help />,
  },
  {
    path: '/features',
    element: <Features />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/team',
    element: <Team />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/settings/api',
    element: <APISettings />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
