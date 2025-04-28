
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Code } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Smartphone, Tablet, Monitor } from 'lucide-react';

interface CodePreviewTabsProps {
  activeTab: string;
  viewportSize: string;
  onTabChange: (value: string) => void;
  onViewportChange: (value: string) => void;
  showViewportToggle?: boolean;
}

export default function CodePreviewTabs({
  activeTab,
  viewportSize,
  onTabChange,
  onViewportChange,
  showViewportToggle = true
}: CodePreviewTabsProps) {
  return (
    <div className="flex items-center gap-2">
      <TabsList>
        <TabsTrigger value="preview" onClick={() => onTabChange('preview')} className={`flex items-center ${activeTab === 'preview' ? 'bg-primary/20' : ''}`}>
          <Eye className="h-3 w-3 mr-1" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code" onClick={() => onTabChange('code')} className={`flex items-center ${activeTab === 'code' ? 'bg-primary/20' : ''}`}>
          <Code className="h-3 w-3 mr-1" />
          Code
        </TabsTrigger>
      </TabsList>
      
      {showViewportToggle && activeTab === 'preview' && (
        <ToggleGroup type="single" value={viewportSize} onValueChange={(value) => value && onViewportChange(value)}>
          <ToggleGroupItem value="mobile" aria-label="Mobile view">
            <Smartphone className="h-3 w-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="tablet" aria-label="Tablet view">
            <Tablet className="h-3 w-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="desktop" aria-label="Desktop view">
            <Monitor className="h-3 w-3" />
          </ToggleGroupItem>
        </ToggleGroup>
      )}
    </div>
  );
}
