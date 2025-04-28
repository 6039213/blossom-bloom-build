
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface OnboardingContextType {
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  hasSeenOnboarding: boolean;
  markOnboardingAsSeen: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'blossom_has_seen_onboarding';

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(false);

  // Check if user has seen the onboarding flow
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
    setHasSeenOnboarding(hasSeenOnboarding);
    
    // Show onboarding if user hasn't seen it
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const markOnboardingAsSeen = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setHasSeenOnboarding(true);
    setShowOnboarding(false);
  };

  const value = {
    showOnboarding,
    setShowOnboarding,
    hasSeenOnboarding,
    markOnboardingAsSeen
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
