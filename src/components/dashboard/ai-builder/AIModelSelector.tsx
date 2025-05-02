
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getAvailableModels, setSelectedModel } from '@/lib/llm/modelSelection';

interface AIModelSelectorProps {
  className?: string;
  selectedModel: string;
  onModelChange?: (modelId: string) => void;
}

export default function AIModelSelector({ className, selectedModel, onModelChange }: AIModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const models = getAvailableModels();
  
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId as 'claude' | 'gemini');
    setOpen(false);
    
    if (onModelChange) {
      onModelChange(modelId);
    }
  };

  // Find the current model display name
  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("flex justify-between w-[220px] text-sm", className)}
        >
          {currentModel?.name || "Select model"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandEmpty>No AI models found.</CommandEmpty>
          <CommandGroup>
            {models.map((model) => (
              <CommandItem
                key={model.id}
                value={model.id}
                onSelect={() => handleModelChange(model.id)}
                disabled={!model.available}
                className={!model.available ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedModel === model.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{model.name}</span>
                  <span className="text-xs text-muted-foreground">{model.provider}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
