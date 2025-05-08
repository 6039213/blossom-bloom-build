
import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import EnhancedAIWebBuilder from './components/ai-builder/EnhancedAIWebBuilder';

// Lazily load components as needed
const Index = lazy(() => import('./pages/Index'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const PricingPage = lazy(() => import('./pages/Pricing')); // Fixed import path
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EnhancedAIWebBuilder />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Export the AppRoutes component correctly
export default AppRoutes;
