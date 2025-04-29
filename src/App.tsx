
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import AboutPage from "@/pages/AboutPage";
import FeaturesPage from "@/pages/FeaturesPage";
import PricingPage from "@/components/pricing/PricingPage";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import ProjectsPage from "@/pages/ProjectsPage";
import SettingsPage from "@/pages/SettingsPage";
import AIBuilder from "@/pages/AIBuilder";
import ProjectDetail from "@/pages/ProjectDetail";
import NotFound from "@/pages/NotFound";
import TeamPage from "@/pages/TeamPage";
import TemplatesPage from "@/pages/TemplatesPage";
import HelpPage from "@/pages/HelpPage";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OnboardingProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/projects" element={<ProjectsPage />} />
              <Route path="/dashboard/projects/:id" element={<ProjectDetail />} />
              <Route path="/dashboard/ai-builder" element={<AIBuilder />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Layout>
          <Toaster />
          <SonnerToaster position="top-right" closeButton />
        </OnboardingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
