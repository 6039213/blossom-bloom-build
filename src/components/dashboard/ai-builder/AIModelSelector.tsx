
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
  const [models, setModels] = React.useState<Array<{
    id: string;
    name: string;
    provider: string;
    available: boolean;
  }>>([]);
  
  // Load models on component mount
  React.useEffect(() => {
    try {
      const availableModels = getAvailableModels();
      // Make sure we have at least one model
      setModels(availableModels.length > 0 ? availableModels : [{
        id: 'claude',
        name: 'Claude 3.7 Sonnet',
        provider: 'Anthropic',
        available: false
      }]);
    } catch (error) {
      console.error('Error loading models:', error);
      // Fallback to a default model
      setModels([{
        id: 'claude',
        name: 'Claude 3.7 Sonnet',
        provider: 'Anthropic',
        available: false
      }]);
    }
  }, []);
  
  const handleModelChange = (modelId: string) => {
    try {
      setSelectedModel(modelId as 'claude' | 'gemini');
      setOpen(false);
      
      if (onModelChange) {
        onModelChange(modelId);
      }
    } catch (error) {
      console.error('Error changing model:', error);
    }
  };

  // Find the current model display name
  const currentModel = React.useMemo(() => {
    return models.find(m => m.id === selectedModel) || { 
      name: selectedModel === 'claude' ? 'Claude 3.7 Sonnet' : 'Select model',
      id: selectedModel 
    };
  }, [models, selectedModel]);

  // Show loading state if models aren't loaded yet
  if (models.length === 0) {
    return (
      <Button
        variant="outline"
        className={cn("flex justify-between w-[220px] text-sm", className)}
      >
        {selectedModel === 'claude' ? 'Claude 3.7 Sonnet' : 'Loading models...'}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

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
