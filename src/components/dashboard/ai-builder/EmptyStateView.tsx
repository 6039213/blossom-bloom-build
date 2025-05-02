
import React from 'react';
import { Sparkles } from 'lucide-react';
import { ProjectTemplate } from './types';

interface EmptyStateViewProps {
  selectedTemplate: ProjectTemplate | null;
}

export default function EmptyStateView({ selectedTemplate }: EmptyStateViewProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-6 w-6 text-blossom-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Let's Create Something Amazing</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          {selectedTemplate 
            ? "Customize your website by entering a detailed prompt or use the default template prompt."
            : "Enter a description of the website you want to build in the prompt field."}
        </p>
        <div className="text-left space-y-2 bg-muted p-4 rounded-lg text-sm">
          <h4 className="font-medium">Your generated website will appear here</h4>
          <p className="text-muted-foreground text-xs">
            Try prompts like "Create a landing page for a coffee shop" or "Build a portfolio website for a photographer"
          </p>
        </div>
      </div>
    </div>
  );
}
