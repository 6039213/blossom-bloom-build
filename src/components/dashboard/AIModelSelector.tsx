
import React from 'react';
import { MODEL_LIST, DEFAULT_MODEL } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles } from 'lucide-react';

interface AIModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export default function AIModelSelector({ selectedModel, onSelectModel }: AIModelSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Sparkles className="h-4 w-4 text-blossom-500" />
        <span className="text-sm font-medium">AI Model:</span>
      </div>
      <Select value={selectedModel} onValueChange={onSelectModel}>
        <SelectTrigger className="w-[180px] h-8 text-xs">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {MODEL_LIST.map((model) => (
            <SelectItem key={model.name} value={model.name}>
              {model.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
