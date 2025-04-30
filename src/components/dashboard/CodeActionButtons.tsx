
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Download,
  Copy,
  RefreshCw,
  Save,
  ExternalLink,
} from 'lucide-react';

interface CodeActionButtonsProps {
  onCopy: () => void;
  onDownload: () => void;
  onReset: () => void;
  onSave: () => void;
  onOpenInNewTab?: () => void;
  showExternalLink?: boolean;
  hasGeneratedCode: boolean;
}

export default function CodeActionButtons({
  onCopy,
  onDownload,
  onReset,
  onSave,
  onOpenInNewTab,
  showExternalLink = false,
  hasGeneratedCode
}: CodeActionButtonsProps) {
  if (!hasGeneratedCode) return null;
  
  return (
    <div className="flex space-x-1">
      {showExternalLink && onOpenInNewTab && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onOpenInNewTab}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          New Tab
        </Button>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onCopy}
      >
        <Copy className="h-3 w-3 mr-1" />
        Copy
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDownload}
      >
        <Download className="h-3 w-3 mr-1" />
        Download
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReset}
      >
        <RefreshCw className="h-3 w-3 mr-1" />
        Reset
      </Button>
      <Button 
        variant="default"
        size="sm"
        onClick={onSave}
      >
        <Save className="h-3 w-3 mr-1" />
        Save
      </Button>
    </div>
  );
}
