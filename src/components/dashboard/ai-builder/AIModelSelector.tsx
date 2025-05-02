
import React, { useEffect, useState } from 'react';
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

export default function AIModelSelector({ 
  className, 
  selectedModel, 
  onModelChange 
}: AIModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<Array<{
    id: string;
    name: string;
    provider: string;
    available: boolean;
  }>>([]);
  
  // Load models on component mount
  useEffect(() => {
    const loadModels = () => {
      try {
        setLoading(true);
        const availableModels = getAvailableModels();
        
        // Make sure we have at least one model
        if (availableModels && availableModels.length > 0) {
          setModels(availableModels);
        } else {
          // Fallback to default models
          setModels([{
            id: 'claude',
            name: 'Claude 3.7 Sonnet',
            provider: 'Anthropic',
            available: true // Changed to true since we have a hardcoded key
          }]);
        }
      } catch (error) {
        console.error('Error loading models:', error);
        // Fallback to default models
        setModels([{
          id: 'claude',
          name: 'Claude 3.7 Sonnet',
          provider: 'Anthropic',
          available: true // Changed to true since we have a hardcoded key
        }]);
      } finally {
        setLoading(false);
      }
    };
    
    loadModels();
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

  // Find the current model display name (with safe fallback)
  const currentModel = React.useMemo(() => {
    if (!models || models.length === 0) {
      return { 
        name: selectedModel === 'claude' ? 'Claude 3.7 Sonnet' : 'Gemini 2.5 Flash',
        id: selectedModel 
      };
    }
    
    return models.find(m => m.id === selectedModel) || { 
      name: selectedModel === 'claude' ? 'Claude 3.7 Sonnet' : 'Gemini 2.5 Flash',
      id: selectedModel 
    };
  }, [models, selectedModel]);

  // Show loading state if models aren't loaded yet
  if (loading) {
    return (
      <Button
        variant="outline"
        className={cn("flex justify-between w-[220px] text-sm", className)}
        disabled
      >
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading models...
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  // Make sure we have models before rendering the popover
  if (!models || models.length === 0) {
    return (
      <Button
        variant="outline"
        className={cn("flex justify-between w-[220px] text-sm", className)}
        disabled
      >
        No models available
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
