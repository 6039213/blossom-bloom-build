
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
      return <IconComponent className="h-5 w-5 text-blossom-500" />;
    }
    // Default to Code icon if not found
    return <Code className="h-5 w-5 text-blossom-500" />;
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium mb-2">Choose a template</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-1">
        {Object.entries(projectTemplates).map(([type, template]) => (
          <Button 
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            className={cn(
              "h-auto py-3 px-4 justify-start flex-col items-center gap-2 w-full",
              "transition-all duration-200 hover:scale-105",
              selectedType === type ? "bg-blossom-500 hover:bg-blossom-600 text-white" : "hover:bg-blossom-50 hover:text-blossom-600"
            )}
            onClick={() => handleSelect(type)}
          >
            <div className="w-10 h-10 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center mb-1">
              {renderIcon(template.icon)}
            </div>
            <span className="text-sm font-medium truncate w-full text-center">{template.displayName}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
