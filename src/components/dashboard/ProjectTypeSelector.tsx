
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    if (iconName in LucideIcons && typeof LucideIcons[iconName as keyof typeof LucideIcons] === 'function') {
      const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
      // Now we safely cast it and use it
      return <IconComponent className="h-5 w-5 text-blossom-500" />;
    }
    // Default to Code icon if not found
    return <Code className="h-5 w-5 text-blossom-500" />;
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Choose a project template</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(projectTemplates).map(([type, template]) => (
          <Card 
            key={type}
            className={cn(
              "p-4 cursor-pointer hover:border-blossom-400 transition-all",
              selectedType === type ? "border-2 border-blossom-500 bg-blossom-50 dark:bg-blossom-950/20" : ""
            )}
            onClick={() => handleSelect(type)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center">
                {renderIcon(template.icon)}
              </div>
              <div>
                <h4 className="font-medium">{template.displayName}</h4>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
