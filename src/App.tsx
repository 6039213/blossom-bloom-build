
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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
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
          </div>
        } />
        <Route path="/pricing" element={<PricingPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}
