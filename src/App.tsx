
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import TestimonialSection from './components/TestimonialSection';
import CTASection from './components/CTASection';
import Footer from './components/layout/Footer';
import MainNavbar from './components/layout/MainNavbar';
import PricingPage from './components/pricing/PricingPage';
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
          <Route path="/pricing" element={<PricingPage />} />
          
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
          
          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
