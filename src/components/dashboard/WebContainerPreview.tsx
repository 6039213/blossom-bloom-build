
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface WebContainerPreviewProps {
  files: Record<string, { code: string }>;
  dependencies: Record<string, string>;
  viewportSize: string;
}

export default function WebContainerPreview({ 
  files, 
  dependencies,
  viewportSize
}: WebContainerPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // This would be where you initialize the WebContainer
    // For now, we'll just simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getViewportClasses = () => {
    switch(viewportSize) {
      case 'mobile':
        return 'w-full max-w-[320px] mx-auto border border-border rounded-lg shadow-lg';
      case 'tablet':
        return 'w-full max-w-[768px] mx-auto border border-border rounded-lg shadow-lg';
      case 'desktop':
      default:
        return 'w-full';
    }
  };
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Alert className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Skeleton className="h-[200px] w-full max-w-2xl mb-4 rounded-lg" />
        <Skeleton className="h-[20px] w-[180px] rounded" />
      </div>
    );
  }
  
  return (
    <div className={`h-full flex-1 overflow-hidden ${getViewportClasses()}`}>
      <iframe 
        ref={iframeRef}
        className="w-full h-full"
        title="preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
