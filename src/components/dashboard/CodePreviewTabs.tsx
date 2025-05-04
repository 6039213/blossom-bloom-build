
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet, Code } from 'lucide-react';

interface CodePreviewTabsProps {
  activeTab: string;
  viewportSize: string;
  onTabChange: (tab: string) => void;
  onViewportChange: (size: string) => void;
}

export default function CodePreviewTabs({ 
  activeTab, 
  viewportSize, 
  onTabChange, 
  onViewportChange 
}: CodePreviewTabsProps) {
  return (
    <div className="flex items-center">
      <TabsList>
        <TabsTrigger value="preview" onClick={() => onTabChange('preview')} className="flex items-center gap-1">
          <Monitor className="h-4 w-4" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code" onClick={() => onTabChange('code')} className="flex items-center gap-1">
          <Code className="h-4 w-4" />
          Code
        </TabsTrigger>
      </TabsList>
      
      {activeTab === 'preview' && (
        <div className="ml-4 flex items-center gap-1">
          <Button
            variant={viewportSize === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewportChange('desktop')}
            className="h-8 w-8 p-0"
          >
            <Monitor className="h-4 w-4" />
            <span className="sr-only">Desktop</span>
          </Button>
          <Button
            variant={viewportSize === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewportChange('tablet')}
            className="h-8 w-8 p-0"
          >
            <Tablet className="h-4 w-4" />
            <span className="sr-only">Tablet</span>
          </Button>
          <Button
            variant={viewportSize === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewportChange('mobile')}
            className="h-8 w-8 p-0"
          >
            <Smartphone className="h-4 w-4" />
            <span className="sr-only">Mobile</span>
          </Button>
        </div>
      )}
    </div>
  );
}
