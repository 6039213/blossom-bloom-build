
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainNavbar from "./layout/MainNavbar";
import Footer from "./layout/Footer";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import LoadingScreen from "./LoadingScreen";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { state } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <AnimatePresence>
        {!isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-screen"
          >
            <MainNavbar />
            <div className="flex flex-1">
              <SidebarInset className="flex-1 transition-all duration-200">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-full"
                >
                  {children}
                </motion.div>
              </SidebarInset>
            </div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
