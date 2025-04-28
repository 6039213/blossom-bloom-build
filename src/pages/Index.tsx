
import { useState, useEffect } from 'react';
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorks from '@/components/HowItWorks';
import TestimonialSection from '@/components/TestimonialSection';
import CTASection from '@/components/CTASection';
import OnboardingFlow from '@/components/OnboardingFlow';
import { getSupabaseClient } from '@/lib/supabase-client';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);

        // Check if the user has seen the onboarding flow
        if (data.session && !localStorage.getItem('has_seen_onboarding')) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };
    
    checkAuth();
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('has_seen_onboarding', 'true');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavbar />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <TestimonialSection />
        <CTASection />
      </main>
      
      <Footer />
      
      {/* Onboarding flow for new authenticated users */}
      {isAuthenticated && showOnboarding && (
        <OnboardingFlow 
          isOpen={showOnboarding} 
          onClose={handleCloseOnboarding}
        />
      )}
    </div>
  );
};

export default Index;
