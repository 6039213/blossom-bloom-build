
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainNavbar from "./layout/MainNavbar";
import Footer from "./layout/Footer";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import LoadingScreen from "./LoadingScreen";
import { Menu, ChevronLeft, Home, Settings, Users, HelpCircle, LayoutDashboard, Code } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-background/95">
        <LoadingScreen isLoading={isLoading} />
        <AnimatePresence>
          {!isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col min-h-screen w-full"
            >
              <MainNavbar />
              <div className="flex flex-1">
                <AppSidebar />
                <SidebarInset className="flex-1 transition-all duration-300">
                  <div className="flex items-center p-4 border-b">
                    <SidebarTrigger>
                      <motion.div 
                        whileHover={{ rotate: 20, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="p-2 rounded-md hover:bg-muted cursor-pointer"
                      >
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    </SidebarTrigger>
                    <motion.h1 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="ml-4 text-xl font-semibold"
                    >
                      Dashboard
                    </motion.h1>
                  </div>
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
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SidebarProvider>
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
            className="h-full"
          >
            <div className="flex justify-end p-2">
              <motion.button
                onClick={toggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 rounded-md hover:bg-muted"
              >
                <ChevronLeft size={18} />
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
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => handleNavigation(link.path)}
                  >
                    <link.icon className={`h-5 w-5 ${isActivePath(link.path) ? "text-primary" : ""}`} />
                    <span>{link.name}</span>
                  </motion.div>
                ))}
              </nav>
            </SidebarContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
}
