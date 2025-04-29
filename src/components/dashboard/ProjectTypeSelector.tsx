
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { projectTemplates, ProjectTemplate } from '@/utils/projectTemplates';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Code } from 'lucide-react';

interface ProjectTypeSelectorProps {
  onSelect: (template: ProjectTemplate) => void;
}

export default function ProjectTypeSelector({ onSelect }: ProjectTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const handleSelect = (type: string) => {
    setSelectedType(type);
    onSelect(projectTemplates[type]);
  };
  
  // Helper function to render the icon component safely
  const renderIcon = (iconName: string) => {
    // Check if the icon exists in LucideIcons
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent && typeof IconComponent === 'function') {
      return <IconComponent className="h-4 w-4 text-blossom-500" />;
    }
    // Default to Code icon if not found
    return <Code className="h-4 w-4 text-blossom-500" />;
  };
  
  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium mb-1">Choose a template</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        {Object.entries(projectTemplates).map(([type, template]) => (
          <Button 
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            className={cn(
              "h-auto py-1.5 px-2 justify-start flex-col items-center gap-1 w-full",
              selectedType === type ? "bg-blossom-500 hover:bg-blossom-600 text-white" : "hover:bg-blossom-50 hover:text-blossom-600"
            )}
            onClick={() => handleSelect(type)}
          >
            <div className="w-6 h-6 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center">
              {renderIcon(template.icon)}
            </div>
            <span className="text-xs font-medium truncate w-full text-center">{template.displayName}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
