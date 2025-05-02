
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface AIModelSelectorProps {
  className?: string;
}

export default function AIModelSelector({ 
  className 
}: AIModelSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Button
        variant="outline"
        className="flex justify-between items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
      >
        <Sparkles className="h-3.5 w-3.5 text-blue-500" />
        <span>Blossom AI</span>
      </Button>
    </div>
  );
}
