
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { RuntimeError } from './types';

interface ErrorDetectionHandlerProps {
  error: RuntimeError | null;
  onFixError: () => void;
  onIgnoreError: () => void;
}

export default function ErrorDetectionHandler({ 
  error, 
  onFixError, 
  onIgnoreError 
}: ErrorDetectionHandlerProps) {
  if (!error) return null;
  
  const errorFile = error.file || 'unknown file';
  const errorMessage = error.message || 'Unknown error';
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="flex items-center">
        <span>🚨 Error in {errorFile}: </span>
      </AlertTitle>
      <AlertDescription className="space-y-2">
        <div className="text-sm font-mono break-words">{errorMessage}</div>
        <div className="flex space-x-2 mt-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onFixError}
          >
            Fix
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onIgnoreError}
          >
            Ignore
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
