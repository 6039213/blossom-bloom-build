
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PLANS } from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase-client';
import { toast } from 'sonner';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const supabase = getSupabaseClient();
  
  // Calculate discounted annual price (20% off)
  const calculatePrice = (monthlyPrice: number) => {
    return isAnnual ? Math.floor(monthlyPrice * 12 * 0.8) : monthlyPrice;
  };
  
  const handleSubscription = async (planName: string) => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        // User is not logged in, redirect to auth page
        toast.info('Please log in to subscribe');
        navigate('/auth', { 
          state: { returnTo: '/pricing', selectedPlan: planName } 
        });
        return;
      }
      
      // User is logged in, navigate to checkout
      navigate('/checkout', { state: { plan: planName, billing: isAnnual ? 'annual' : 'monthly' } });
      
    } catch (error) {
      console.error('Error checking authentication:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-screen-xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose the Perfect Plan for Your Needs
          </h2>
          <p className="text-muted-foreground text-lg">
            From freelancers to large enterprises, we have a plan that's right for you
          </p>
          
          <div className="mt-8 inline-flex items-center p-1 bg-blossom-100 dark:bg-blossom-900/30 rounded-full">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isAnnual 
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blossom-700 dark:text-blossom-400' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual (20% off)
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual 
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-blossom-700 dark:text-blossom-400' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-blossom-200 dark:border-blossom-800/30 shadow-sm transition-all hover:shadow-blossom">
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-bold">{PLANS.FREE.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">Free</span>
                <span className="text-muted-foreground ml-2">forever</span>
              </div>
              <p className="text-muted-foreground mb-6">Perfect for beginners and small projects</p>
              <Button 
                onClick={() => handleSubscription('FREE')}
                disabled={isLoading}
                className="w-full" 
                variant="outline"
              >
                Get Started
              </Button>
            </div>
            <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 border-t border-blossom-100 dark:border-blossom-800/30">
              <ul className="space-y-3">
                {PLANS.FREE.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-blossom-500 mr-3 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Standard Plan */}
          <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border-2 border-blossom-500 shadow-blossom transition-all hover:shadow-blossom-lg relative">
            <div className="absolute top-0 right-0 bg-blossom-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
              Most Popular
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-bold">{PLANS.STANDARD.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">${calculatePrice(PLANS.STANDARD.price)}</span>
                <span className="text-muted-foreground ml-2">/{isAnnual ? 'year' : 'month'}</span>
              </div>
              <p className="text-muted-foreground mb-6">For professionals and growing businesses</p>
              <Button 
                onClick={() => handleSubscription('STANDARD')}
                disabled={isLoading}
                className="w-full bg-blossom-500 hover:bg-blossom-600 text-white"
              >
                Choose Standard
              </Button>
            </div>
            <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 border-t border-blossom-100 dark:border-blossom-800/30">
              <ul className="space-y-3">
                {PLANS.STANDARD.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-blossom-500 mr-3 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-blossom-200 dark:border-blossom-800/30 shadow-sm transition-all hover:shadow-blossom">
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-bold">{PLANS.PREMIUM.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">${calculatePrice(PLANS.PREMIUM.price)}</span>
                <span className="text-muted-foreground ml-2">/{isAnnual ? 'year' : 'month'}</span>
              </div>
              <p className="text-muted-foreground mb-6">For teams and enterprise organizations</p>
              <Button 
                onClick={() => handleSubscription('PREMIUM')}
                disabled={isLoading}
                className="w-full" 
                variant="outline"
              >
                Choose Premium
              </Button>
            </div>
            <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 border-t border-blossom-100 dark:border-blossom-800/30">
              <ul className="space-y-3">
                {PLANS.PREMIUM.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-blossom-500 mr-3 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-muted-foreground text-sm">
          Need a custom plan for your enterprise? <a href="/contact" className="text-blossom-600 dark:text-blossom-400 underline underline-offset-2">Contact us</a>
        </div>
      </div>
    </section>
  );
}
