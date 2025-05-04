
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

  return (
    <AnimatePresence>
      {(isLoading || progress < 100) && (
        <motion.div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }}
        >
          <motion.div
            className="w-24 h-24 mb-8"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 2, ease: "linear", repeat: Infinity },
              scale: { duration: 1.5, repeat: Infinity }
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-primary to-blossom-500 blossom-glow-lg p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <div className="w-2/3 h-2/3 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 rounded-full bg-primary blossom-glow" />
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-64 h-2 bg-muted rounded-full overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </motion.div>
          
          <motion.p 
            className="mt-4 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Loading your beautiful experience...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
