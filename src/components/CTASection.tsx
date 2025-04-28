
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blossom-100 to-blossom-200/50 dark:from-blossom-900/50 dark:to-blossom-950/30">
      <div className="container max-w-screen-xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 md:p-12 shadow-blossom border border-blossom-200 dark:border-blossom-800/30 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Building Your Dream Website Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of creators using Blossom to build beautiful websites in minutes
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-blossom-gradient hover:opacity-90 text-white shadow-blossom text-base py-6 px-8"
                size="lg"
              >
                Get Started — It's Free
              </Button>
              <Button 
                onClick={() => navigate('/pricing')}
                className="bg-background text-foreground border border-blossom-300 hover:bg-blossom-50 dark:hover:bg-blossom-950/50 text-base py-6 px-8"
                size="lg"
                variant="outline"
              >
                View Pricing
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <div className="flex items-center">
                <div className="p-1 bg-blossom-100 dark:bg-blossom-900/50 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blossom-600 dark:text-blossom-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <span className="text-sm text-muted-foreground ml-2">No credit card required</span>
              </div>
              <div className="flex items-center">
                <div className="p-1 bg-blossom-100 dark:bg-blossom-900/50 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blossom-600 dark:text-blossom-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <span className="text-sm text-muted-foreground ml-2">14-day free trial on all plans</span>
              </div>
              <div className="flex items-center">
                <div className="p-1 bg-blossom-100 dark:bg-blossom-900/50 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blossom-600 dark:text-blossom-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <span className="text-sm text-muted-foreground ml-2">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
