
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProjectTemplate } from './types';

export interface EmptyStateViewProps {
  onTemplateSelect: (template: ProjectTemplate) => void;
}

export default function EmptyStateView({ onTemplateSelect }: EmptyStateViewProps) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Create a New Project</h2>
        <p className="text-muted-foreground mb-6">
          Select a template to get started or describe your project to the AI assistant.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* These are placeholder buttons - in a real implementation, they would use actual templates */}
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => onTemplateSelect({
              id: 'landing',
              name: 'Landing Page',
              displayName: 'Landing Page',
              description: 'A simple landing page',
              type: 'landing',
              icon: 'layout',
              fileStructure: [],
              suggestedDependencies: {},
              defaultPrompt: "Create a landing page",
              boilerplateCode: {}
            })}
          >
            <Plus className="h-6 w-6" />
            <span>Landing Page</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => onTemplateSelect({
              id: 'dashboard',
              name: 'Dashboard',
              displayName: 'Dashboard',
              description: 'Admin dashboard',
              type: 'dashboard',
              icon: 'layout-dashboard',
              fileStructure: [],
              suggestedDependencies: {},
              defaultPrompt: "Create a dashboard app",
              boilerplateCode: {}
            })}
          >
            <Plus className="h-6 w-6" />
            <span>Dashboard</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => onTemplateSelect({
              id: 'blog',
              name: 'Blog',
              displayName: 'Blog',
              description: 'A blog template',
              type: 'blog',
              icon: 'file-text',
              fileStructure: [],
              suggestedDependencies: {},
              defaultPrompt: "Create a blog",
              boilerplateCode: {}
            })}
          >
            <Plus className="h-6 w-6" />
            <span>Blog</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => onTemplateSelect({
              id: 'ecommerce',
              name: 'E-commerce',
              displayName: 'E-commerce',
              description: 'Online store',
              type: 'ecommerce',
              icon: 'shopping-cart',
              fileStructure: [],
              suggestedDependencies: {},
              defaultPrompt: "Create an e-commerce site",
              boilerplateCode: {}
            })}
          >
            <Plus className="h-6 w-6" />
            <span>E-commerce</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Or type a prompt like "Create a portfolio website with dark theme"
        </p>
      </div>
    </div>
  );
}
