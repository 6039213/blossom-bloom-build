
import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  className,
  size = 'md',
  ...props 
}) => {
  const sizeClass = 
    size === 'sm' ? 'h-4 w-4 border-2' : 
    size === 'lg' ? 'h-10 w-10 border-[3px]' : 
    'h-6 w-6 border-2';
  
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-t-transparent",
        sizeClass,
        "border-primary",
        className
      )}
      {...props}
    />
  );
};
