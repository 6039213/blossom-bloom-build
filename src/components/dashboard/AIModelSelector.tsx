
import React, { useState, useEffect } from 'react';
import { Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export default function AIModelSelector({ selectedModel, onSelectModel }: AIModelSelectorProps) {
  const modelName = import.meta.env.VITE_CLAUDE_MODEL || 'Claude 3.7 Sonnet';
  const [apiKeySet, setApiKeySet] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if API key is set in localStorage or env
    const apiKey = localStorage.getItem('VITE_CLAUDE_API_KEY') || import.meta.env.VITE_CLAUDE_API_KEY;
    setApiKeySet(!!apiKey);
  }, []);
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Sparkles className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">AI Model:</span>
      </div>
      <div className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm flex items-center gap-1">
        {modelName}
        {apiKeySet ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" />
        ) : (
          <Link to="/settings/api" className="ml-1 text-amber-500 hover:text-amber-600">
            <Lock className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
