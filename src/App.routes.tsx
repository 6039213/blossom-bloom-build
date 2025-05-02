
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard'; 
import AIBuilder from './pages/AIBuilder';
import NotFound from './pages/NotFound';
import APISettings from './pages/APISettings';

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
