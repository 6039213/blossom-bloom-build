
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase-client';

export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const supabase = getSupabaseClient();

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is logged in, navigate to dashboard
        navigate('/dashboard');
      } else {
        // User is not logged in, navigate to auth page
        navigate('/auth');
      }
    } catch (error) {
      console.error("Error checking session:", error);
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background with radial gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-blossom-100/70 to-transparent dark:from-blossom-900/20" />
      
      <div className="container max-w-screen-xl relative z-10 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="space-y-6 lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Create Beautiful Websites with{' '}
              <span className="bg-gradient-to-r from-blossom-700 to-blossom-500 inline-block text-transparent bg-clip-text">
                AI-Powered Magic
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Blossom helps you build stunning websites in minutes using the power of AI. 
              Just describe what you want, and watch your vision come to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={handleGetStarted}
                disabled={isLoading}
                className="text-white bg-blossom-gradient hover:opacity-90 shadow-blossom text-base py-6 px-8"
                size="lg"
              >
                {isLoading ? "Loading..." : "Get Started — It's Free"}
              </Button>
              <Button 
                onClick={() => navigate('/templates')}
                className="bg-background text-foreground border border-blossom-300 hover:bg-blossom-50 dark:hover:bg-blossom-950/50 text-base py-6 px-8"
                size="lg"
                variant="outline"
              >
                Explore Templates
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required. Start building for free.
            </p>
          </div>
          
          {/* Hero Image */}
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-2 rounded-full bg-blossom-200/50 dark:bg-blossom-900/20 blur-3xl animate-pulse" />
            <div className="relative rounded-xl overflow-hidden shadow-blossom-lg border border-blossom-200/80 dark:border-blossom-800/30">
              <div className="bg-gradient-to-b from-background to-blossom-50 dark:from-background dark:to-blossom-950/20 py-3 px-4 border-b border-blossom-200/80 dark:border-blossom-800/30 flex items-center gap-2 backdrop-blur-sm">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="bg-white/90 dark:bg-black/30 rounded-md flex-1 flex items-center justify-center h-6 text-xs text-muted-foreground px-2">
                  blossom.io/mysite
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="/placeholder.svg"
                  alt="Blossom Website Builder Interface"
                  className="w-full aspect-video object-cover opacity-70 dark:opacity-90"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <img 
                      src="/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png" 
                      alt="Blossom Logo" 
                      className="w-16 h-16 object-contain mx-auto blossom-glow-lg animate-glow"
                    />
                    <div className="bg-background/80 dark:bg-background/60 backdrop-blur-sm rounded-md p-3 max-w-xs mx-auto">
                      <div className="text-xs text-muted-foreground mb-2">Generating website...</div>
                      <div className="w-full bg-blossom-100 dark:bg-blossom-900/50 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-blossom-500 animate-shimmer rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-blossom-200 dark:border-blossom-800/30">
            <div className="text-3xl md:text-4xl font-bold text-blossom-700 dark:text-blossom-400">10k+</div>
            <div className="text-sm text-muted-foreground mt-1">Websites Created</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-blossom-200 dark:border-blossom-800/30">
            <div className="text-3xl md:text-4xl font-bold text-blossom-700 dark:text-blossom-400">500+</div>
            <div className="text-sm text-muted-foreground mt-1">Templates</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-blossom-200 dark:border-blossom-800/30">
            <div className="text-3xl md:text-4xl font-bold text-blossom-700 dark:text-blossom-400">98%</div>
            <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-blossom-200 dark:border-blossom-800/30">
            <div className="text-3xl md:text-4xl font-bold text-blossom-700 dark:text-blossom-400">24/7</div>
            <div className="text-sm text-muted-foreground mt-1">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
