
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X, User } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { APP_NAME } from "@/lib/constants";

export default function MainNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const supabase = getSupabaseClient();
  
  // Check auth status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Error checking authentication status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center">
        <div className="flex items-center gap-2 mr-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png" 
              alt="Blossom Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-xl bg-gradient-to-r from-blossom-700 to-blossom-500 inline-block text-transparent bg-clip-text">
              {APP_NAME}
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/features" className="transition-colors hover:text-foreground/80">
            Features
          </Link>
          <Link to="/pricing" className="transition-colors hover:text-foreground/80">
            Pricing
          </Link>
          <Link to="/templates" className="transition-colors hover:text-foreground/80">
            Templates
          </Link>
          <Link to="/about" className="transition-colors hover:text-foreground/80">
            About
          </Link>
        </nav>
        
        <div className="flex-1" />
        
        {/* Authentication/Dashboard buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoading && (
            isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-blossom-500 hover:bg-blossom-600 text-white"
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Login
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => navigate('/auth')}
                  className="bg-blossom-500 hover:bg-blossom-600 text-white"
                >
                  Get Started
                </Button>
              </>
            )
          )}
        </div>
        
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader className="mb-4">
              <SheetTitle>
                <Link to="/" className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png" 
                    alt="Blossom Logo" 
                    className="w-8 h-8 object-contain" 
                  />
                  <span className="font-bold text-xl bg-gradient-to-r from-blossom-700 to-blossom-500 inline-block text-transparent bg-clip-text">
                    {APP_NAME}
                  </span>
                </Link>
              </SheetTitle>
              <SheetDescription>
                Create beautiful websites with AI
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4">
              <Link 
                to="/features" 
                className="text-foreground hover:text-blossom-600 py-2 transition-colors"
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className="text-foreground hover:text-blossom-600 py-2 transition-colors"
              >
                Pricing
              </Link>
              <Link 
                to="/templates" 
                className="text-foreground hover:text-blossom-600 py-2 transition-colors"
              >
                Templates
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-blossom-600 py-2 transition-colors"
              >
                About
              </Link>
              
              <div className="h-px bg-border my-2" />
              
              {!isLoading && (
                isAuthenticated ? (
                  <>
                    <Button 
                      variant="default" 
                      onClick={() => navigate('/dashboard')}
                      className="bg-blossom-500 hover:bg-blossom-600 text-white w-full"
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      className="w-full"
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="default" 
                      onClick={() => navigate('/auth')}
                      className="bg-blossom-500 hover:bg-blossom-600 text-white w-full"
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/auth')}
                      className="w-full"
                    >
                      Login
                    </Button>
                  </>
                )
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
