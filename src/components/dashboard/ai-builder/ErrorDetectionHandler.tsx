
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, X } from 'lucide-react';

interface ErrorDetectionHandlerProps {
  error: { message: string; file?: string } | null;
  onFixError: () => void;
  onIgnoreError: () => void;
}

export default function ErrorDetectionHandler({
  error,
  onFixError,
  onIgnoreError
}: ErrorDetectionHandlerProps) {
  if (!error) return null;
  
  // Simplify the error message for display
  const simplifyErrorMessage = (message: string): string => {
    // Handle common React errors
    if (message.includes('React.createElement')) {
      return 'JSX syntax error or missing component';
    }
    
    // Handle undefined or null errors
    if (message.includes('undefined is not') || message.includes('null is not')) {
      return 'Trying to access a property of undefined or null';
    }
    
    // Handle hook related errors
    if (message.includes('React Hook')) {
      return 'React Hook usage error - check component structure';
    }
    
    // Handle import errors
    if (message.includes('Cannot find module') || message.includes('not found')) {
      return 'Missing import or module not found';
    }
    
    // Default - truncate long messages
    return message.length > 100 ? message.substring(0, 100) + '...' : message;
  };

  const displayMessage = simplifyErrorMessage(error.message);
  const displayFile = error.file || 'Unknown file';

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1">
          <div className="font-medium text-red-800">Runtime Error Detected</div>
          
          <div className="mt-1 text-sm text-red-700">
            <div className="font-mono bg-red-100 p-2 rounded mb-2 overflow-x-auto">
              {displayMessage}
              {error.file && (
                <div className="mt-1 text-xs text-red-600">
                  in <span className="font-bold">{displayFile}</span>
                </div>
              )}
            </div>
            
            <p className="mb-3">
              An error was detected while previewing your app. Would you like AI to fix it?
            </p>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={onFixError}
                className="flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Fix Error
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onIgnoreError}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Ignore
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
