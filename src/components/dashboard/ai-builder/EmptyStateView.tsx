
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
            : "Choose a template or type a description of the website you want to build."}
        </p>
        <ul className="text-left space-y-2 bg-muted p-3 rounded-lg text-xs">
          <li className="flex items-start">
            <span className="bg-blossom-100 dark:bg-blossom-900/30 p-1 rounded text-blossom-700 dark:text-blossom-300 mr-2">Tip</span>
            <span>Be specific about your website's purpose, style, and content.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blossom-100 dark:bg-blossom-900/30 p-1 rounded text-blossom-700 dark:text-blossom-300 mr-2">Tip</span>
            <span>Mention color schemes or specific design elements you'd like to include.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
