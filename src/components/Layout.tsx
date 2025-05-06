
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import LoadingScreen from "./LoadingScreen";
import { Menu, ChevronLeft, Home, Settings, Users, HelpCircle, LayoutDashboard, Code } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingScreen isLoading={isLoading} />
        <AnimatePresence>
          {!isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col min-h-screen w-full"
            >
              <div className="flex flex-1">
                <AppSidebar />
                <SidebarInset className="flex-1 transition-all duration-300">
                  <div className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 border-b border-amber-200 dark:border-amber-700">
                    <SidebarTrigger>
                      <motion.div 
                        whileHover={{ rotate: 20, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="p-2 rounded-md hover:bg-amber-200/50 dark:hover:bg-amber-900/30 cursor-pointer"
                      >
                        <Menu className="h-5 w-5 text-amber-800 dark:text-amber-300" />
                      </motion.div>
                    </SidebarTrigger>
                    <motion.h1 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="ml-4 text-xl font-semibold text-amber-900 dark:text-amber-300"
                    >
                      Dashboard
                    </motion.h1>
                    
                    {/* Mobile Menu Trigger */}
                    <div className="ml-auto block md:hidden">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-300 bg-amber-100/50 hover:bg-amber-200/50 dark:border-amber-700 dark:bg-amber-900/20 dark:hover:bg-amber-800/30"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      >
                        <Menu className="h-4 w-4 text-amber-800 dark:text-amber-300" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Mobile Navigation Menu */}
                  <AnimatePresence>
                    {isMobileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-amber-50 dark:bg-gray-800 border-b border-amber-200 dark:border-amber-700 overflow-hidden"
                      >
                        <MobileNavigation setIsOpen={setIsMobileMenuOpen} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 h-[calc(100%-65px)] overflow-auto"
                  >
                    {children}
                  </motion.div>
                </SidebarInset>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SidebarProvider>
  );
}

function MobileNavigation({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const sidebarLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Builder', path: '/dashboard/ai-builder', icon: Code },
    { name: 'Projects', path: '/dashboard/projects', icon: Home },
    { name: 'Team', path: '/dashboard/team', icon: Users },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    { name: 'Help', path: '/dashboard/help', icon: HelpCircle },
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };
  
  return (
    <div className="p-3 space-y-1">
      {sidebarLinks.map((link) => (
        <Button
          key={link.path}
          variant="ghost"
          className={`w-full justify-start ${
            isActivePath(link.path)
              ? 'bg-amber-200/50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300'
              : 'hover:bg-amber-100/50 dark:hover:bg-amber-900/20 text-amber-800 dark:text-amber-400'
          }`}
          onClick={() => handleNavigation(link.path)}
        >
          <link.icon className="mr-2 h-4 w-4" />
          {link.name}
        </Button>
      ))}
    </div>
  );
}

// Enhanced sidebar with beautiful animations
function AppSidebar() {
  const { state, open, setOpen } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const toggle = () => {
    if (state === "expanded") {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const sidebarLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Builder', path: '/dashboard/ai-builder', icon: Code },
    { name: 'Projects', path: '/dashboard/projects', icon: Home },
    { name: 'Team', path: '/dashboard/team', icon: Users },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    { name: 'Help', path: '/dashboard/help', icon: HelpCircle },
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <Sidebar>
      <AnimatePresence mode="wait">
        {state === "expanded" && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800"
          >
            <div className="flex justify-between p-4">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png" 
                  alt="Blossom Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-300 inline-block text-transparent bg-clip-text ml-2">
                  Blossom
                </span>
              </div>
              <motion.button
                onClick={toggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 rounded-md hover:bg-amber-200/50 dark:hover:bg-amber-900/30"
              >
                <ChevronLeft size={18} className="text-amber-800 dark:text-amber-300" />
              </motion.button>
            </div>

            <SidebarContent className="p-2">
              <nav>
                {sidebarLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors mb-1 cursor-pointer ${
                      isActivePath(link.path) 
                        ? "bg-amber-300/40 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200" 
                        : "hover:bg-amber-200/30 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200"
                    }`}
                    onClick={() => handleNavigation(link.path)}
                  >
                    <link.icon className={`h-5 w-5 ${isActivePath(link.path) ? "text-amber-700 dark:text-amber-300" : "text-amber-600 dark:text-amber-500"}`} />
                    <span>{link.name}</span>
                  </motion.div>
                ))}
              </nav>
            </SidebarContent>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="p-3 bg-gradient-to-r from-amber-200/50 to-amber-300/50 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">Blossom AI</p>
                <p className="text-xs text-amber-700/70 dark:text-amber-400/70">Build beautiful websites with AI</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
