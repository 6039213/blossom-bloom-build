
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  errorMessage: string;
  onDismiss: () => void;
}

export default function ErrorMessage({ errorMessage, onDismiss }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="mt-2">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="text-xs">
        {errorMessage}
      </AlertDescription>
      <Button 
        variant="destructive" 
        size="sm" 
        className="mt-1"
        onClick={onDismiss}
      >
        Dismiss
      </Button>
    </Alert>
  );
}
