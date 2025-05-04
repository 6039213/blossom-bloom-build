
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Download, RotateCcw, Save, ExternalLink } from 'lucide-react';

interface CodeActionButtonsProps {
  onCopy?: () => void;
  onDownload?: () => void;
  onReset?: () => void;
  onSave?: () => void;
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
  return (
    <div className="flex items-center gap-2">
      {onCopy && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          disabled={!hasGeneratedCode}
          className="h-8"
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy
        </Button>
      )}
      
      {onDownload && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          disabled={!hasGeneratedCode}
          className="h-8"
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      )}
      
      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!hasGeneratedCode}
          className="h-8"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      )}
      
      {onSave && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={!hasGeneratedCode}
          className="h-8"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      )}
      
      {showExternalLink && onOpenInNewTab && (
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenInNewTab}
          disabled={!hasGeneratedCode}
          className="h-8 w-8 p-0"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">Open in new tab</span>
        </Button>
      )}
    </div>
  );
}
