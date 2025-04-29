
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  errorMessage: string;
  onDismiss: () => void;
}

export default function ErrorMessage({ errorMessage, onDismiss }: ErrorMessageProps) {
  return (
    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p className="text-xs text-red-700 dark:text-red-300">
        <strong>Error:</strong> {errorMessage}
      </p>
      <Button 
        variant="destructive" 
        size="sm" 
        className="mt-1"
        onClick={onDismiss}
      >
        Dismiss
      </Button>
    </div>
  );
}
