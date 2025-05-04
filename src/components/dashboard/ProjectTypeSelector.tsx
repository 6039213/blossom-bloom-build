
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { projectTemplates, ProjectTemplate } from '@/utils/projectTemplates';

interface ProjectTypeSelectorProps {
  onSelect: (template: ProjectTemplate) => void;
}

export default function ProjectTypeSelector({ onSelect }: ProjectTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Choose a template to get started</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(projectTemplates).map((template) => (
          <Card 
            key={template.id}
            className="overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
            onClick={() => onSelect(template)}
          >
            <div className="aspect-video w-full bg-muted relative overflow-hidden">
              {template.imageUrl ? (
                <img 
                  src={template.imageUrl} 
                  alt={template.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-muted-foreground/5 to-muted-foreground/20">
                  <span className="text-lg font-medium text-muted-foreground/70">{template.displayName}</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-1">{template.displayName}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                Select
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
