
import React from 'react';
import { useProjectStore } from '@/stores/project';

export const WebContainerPreview = () => {
  const { previewHtml } = useProjectStore();
  
  return (
    <div className="w-full h-full flex flex-col">
      <iframe
        srcDoc={previewHtml || '<div style="padding: 20px; font-family: sans-serif; text-align: center;"><h2>Preview will appear here</h2><p>Enter a prompt and click generate to see the preview</p></div>'}
        className="h-full w-full border-0 rounded-md flex-1"
        sandbox="allow-scripts allow-same-origin"
        title="Component Preview"
      />
    </div>
  );
};
