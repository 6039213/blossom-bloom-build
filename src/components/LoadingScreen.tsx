
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { 
      opacity: 0,
      transition: { duration: 0.8, delay: 0.2, ease: "easeInOut" } 
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [1, 0.85, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  };

  const progressVariants = {
    hidden: { width: "0%" },
    visible: (custom: number) => ({
      width: `${custom}%`,
      transition: { 
        type: "spring", 
        stiffness: 50,
        damping: 10
      }
    })
  };

  return (
    <AnimatePresence mode="wait">
      {(isLoading || progress < 100) && (
        <motion.div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background to-background/90 backdrop-blur-sm"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="relative w-28 h-28 mb-10"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            whileInView={pulseAnimation}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-20 blur-xl animate-spin-slow"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-r from-primary to-blue-500 p-1.5 shadow-xl shadow-primary/20">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 rounded-full bg-primary shadow-lg shadow-primary/30"></div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-64 h-1.5 bg-muted rounded-full overflow-hidden mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-blue-500"
              variants={progressVariants}
              initial="hidden"
              animate="visible"
              custom={progress}
            />
          </motion.div>
          
          <motion.p 
            className="text-muted-foreground font-medium text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {Math.round(progress)}% - Loading your experience...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
