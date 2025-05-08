
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import TestimonialSection from './components/TestimonialSection';
import CTASection from './components/CTASection';
import Footer from './components/layout/Footer';
import MainNavbar from './components/layout/MainNavbar';
import BlossomsAIWebBuilder from './components/ai-builder/BlossomsAIWebBuilder';
import { AuthProvider } from './contexts/AuthContext';

// Import the page components
import Index from './pages/Index';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import TemplatesPage from './pages/TemplatesPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamPage from './pages/TeamPage';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import AIBuilder from './pages/AIBuilder';
import AuthPage from './pages/AuthPage';
import ProjectDetail from './pages/ProjectDetail';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

// Import API handlers - ensuring the routes are correctly set up
import * as claudeAPI from './api/claude.js';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          
          {/* Auth routes */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/projects" element={<ProjectsPage />} />
          <Route path="/dashboard/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/dashboard/ai-builder" element={<AIBuilder />} />
          <Route path="/dashboard/team" element={<TeamPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/help" element={<HelpPage />} />
          
          {/* API routes */}
          <Route path="/api/claude" element={<APIHandler handler={claudeAPI} />} />
          
          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// API Handler component to process API requests
function APIHandler({ handler }: { handler: any }) {
  React.useEffect(() => {
    const handleRequest = async () => {
      try {
        // Extract query parameters and request body
        const url = new URL(window.location.href);
        const method = window.location.pathname.endsWith('OPTIONS') ? 'OPTIONS' : 'POST';
        
        // Create the request object correctly (fixing the variable declaration order)
        const incomingRequest = new Request(window.location.href);
        const requestBody = method === 'POST' ? await incomingRequest.text() : null;
        
        // Create a Request object with proper body
        const request = new Request(url, {
          method,
          headers: Object.fromEntries([...new Headers()]),
          body: requestBody
        });
        
        // Call the appropriate handler
        const response = await (method === 'POST' ? handler.POST(request) : handler.OPTIONS());
        
        // Set response headers and status
        if (response.headers) {
          for (const [key, value] of Object.entries(response.headers)) {
            document.querySelector('#api-response-headers')?.setAttribute(key, value.toString());
          }
        }
        
        // Set response body - ensure we have string data
        const responseBody = await response.text();
        const statusElement = document.querySelector('#api-response-status');
        const bodyElement = document.querySelector('#api-response-body');
        
        if (statusElement) {
          statusElement.textContent = response.status.toString();
        }
        
        if (bodyElement) {
          bodyElement.textContent = responseBody;
        }
      } catch (error) {
        console.error('API handler error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        const statusElement = document.querySelector('#api-response-status');
        const bodyElement = document.querySelector('#api-response-body');
        
        if (statusElement) {
          statusElement.textContent = '500';
        }
        
        if (bodyElement) {
          bodyElement.textContent = JSON.stringify({ error: errorMessage });
        }
      }
    };
    
    if (window.location.pathname.startsWith('/api/')) {
      handleRequest();
    }
  }, [handler]);
  
  return (
    <div style={{ display: 'none' }}>
      <div id="api-response-headers" />
      <div id="api-response-status" />
      <div id="api-response-body" />
    </div>
  );
}
