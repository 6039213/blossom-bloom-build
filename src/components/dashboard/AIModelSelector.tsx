
import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export default function AIModelSelector({ selectedModel, onSelectModel }: AIModelSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Sparkles className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">AI Model:</span>
      </div>
      <div className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm">
        Claude 3.7 Sonnet
      </div>
    </div>
  );
}
