
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { getSupabaseClient } from '@/lib/supabase-client';
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';

export default function AuthPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const supabase = getSupabaseClient();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
        
        if (data.session) {
          // User is already logged in, redirect to dashboard or previous intended location
          const returnTo = location.state?.returnTo || '/dashboard';
          navigate(returnTo);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [navigate, location.state]);
  
  // Don't render anything while checking auth status
  if (isAuthenticated === null) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavbar />
      
      <main className="flex-1 py-12 md:py-24">
        <div className="container max-w-screen-xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                Welcome to {APP_NAME}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Build beautiful websites in minutes with the power of AI.
                Just sign in to get started.
              </p>
              
              <div className="hidden lg:block bg-gradient-to-br from-blossom-100 to-blossom-200/50 dark:from-blossom-900/50 dark:to-blossom-950/30 p-6 rounded-xl">
                <h3 className="font-medium text-lg mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  Why choose {APP_NAME}?
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blossom-600 dark:text-blossom-400 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Create stunning websites with simple text prompts</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blossom-600 dark:text-blossom-400 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>No coding or design skills required</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blossom-600 dark:text-blossom-400 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Publish and share your website in minutes</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blossom-600 dark:text-blossom-400 mt-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Professional designs with version control</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full max-w-md">
              <AuthForm />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
