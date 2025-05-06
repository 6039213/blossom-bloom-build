
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Menu, X, User } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase-client';
import { APP_NAME } from '@/lib/constants';

const MainNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const supabase = getSupabaseClient();
  
  // Set scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Templates", path: "/templates" },
    { name: "About", path: "/about" }
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <motion.img 
                src="/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png"
                alt={`${APP_NAME} Logo`}
                className="h-8 w-8 object-contain"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.div 
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" 
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-300 inline-block text-transparent bg-clip-text">
              {APP_NAME}
            </span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative group ${
                  isActive(link.path) 
                    ? 'text-amber-900 dark:text-amber-200' 
                    : 'text-gray-700 hover:text-amber-800 dark:text-gray-300 dark:hover:text-amber-300'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-300" 
                    layoutId="navbar-indicator"
                  />
                )}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ease-out duration-300" />
              </Link>
            ))}
          </nav>
          
          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-md hover:shadow-lg transition-all">
                <Link to="/dashboard">
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20">
                  <Link to="/auth">
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-md hover:shadow-lg transition-all">
                  <Link to="/auth?tab=signup">
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-amber-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="container max-w-screen-xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link, index) => (
                <motion.div 
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(link.path) 
                        ? 'text-amber-900 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-900/30' 
                        : 'text-gray-700 hover:text-amber-800 dark:text-gray-300 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
                {isAuthenticated ? (
                  <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white">
                    <Link to="/dashboard">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline" className="w-full border-amber-500 text-amber-700 dark:border-amber-700 dark:text-amber-400">
                      <Link to="/auth">
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white">
                      <Link to="/auth?tab=signup">
                        Get Started
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MainNavbar;
