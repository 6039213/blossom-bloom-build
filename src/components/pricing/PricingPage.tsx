
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';
import PricingSection from '@/components/PricingSection';
import { APP_NAME } from '@/lib/constants';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavbar />
      
      <main className="flex-1">
        <div className="py-12 md:py-20 bg-gradient-to-b from-background to-blossom-50/50 dark:from-background dark:to-blossom-950/10">
          <div className="container max-w-screen-xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include our core features and friendly support.
            </p>
          </div>
        </div>
        
        <PricingSection />
        
        <div className="py-16 md:py-24 container max-w-screen-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Can I change plans later?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Is there a free trial?</h3>
                  <p className="text-muted-foreground">
                    Yes! All paid plans come with a 14-day free trial. No credit card required to start.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">What payment methods do you accept?</h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, including Visa, Mastercard, American Express, and Discover.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Can I cancel my subscription?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time from your account dashboard. You'll continue to have access until the end of your current billing period.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-blossom-200 dark:border-blossom-800/30 shadow-blossom">
              <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
              <p className="mb-6 text-muted-foreground">
                If you have specific requirements or need a tailored solution for your enterprise, we're here to help.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blossom-100 dark:bg-blossom-900/30 rounded-full flex items-center justify-center shrink-0 text-blossom-600 dark:text-blossom-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Dedicated Support</h4>
                    <p className="text-sm text-muted-foreground">Get priority access to our customer support team.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blossom-100 dark:bg-blossom-900/30 rounded-full flex items-center justify-center shrink-0 text-blossom-600 dark:text-blossom-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Custom Features</h4>
                    <p className="text-sm text-muted-foreground">Request specific features for your organization's needs.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blossom-100 dark:bg-blossom-900/30 rounded-full flex items-center justify-center shrink-0 text-blossom-600 dark:text-blossom-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Team Training</h4>
                    <p className="text-sm text-muted-foreground">Get your team up to speed with personalized training sessions.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <a 
                  href="/contact" 
                  className="inline-flex items-center text-blossom-600 dark:text-blossom-400 font-medium hover:underline"
                >
                  Contact our sales team
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
