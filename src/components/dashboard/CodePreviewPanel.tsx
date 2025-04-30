
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface CodePreviewPanelProps {
  activeTab: 'preview' | 'code';
}

export default function CodePreviewPanel({ activeTab }: CodePreviewPanelProps) {
  // In a real app, you would get this from your state
  const previewHtml = '<div class="p-8"><h1 class="text-4xl font-bold mb-4">Hello from Blossom AI</h1><p class="mb-4">This is a preview of your generated website.</p><button class="bg-blossom-500 text-white px-4 py-2 rounded-md">Click me</button></div>';
  const generatedCode = `
// App.tsx
import React from 'react';

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Hello from Blossom AI</h1>
      <p className="mb-4">This is a preview of your generated website.</p>
      <button className="bg-blossom-500 text-white px-4 py-2 rounded-md">
        Click me
      </button>
    </div>
  );
}
  `;

  if (activeTab === 'preview') {
    return (
      <div className="h-full w-full overflow-hidden bg-gray-100 border-t border-border">
        <iframe
          srcDoc={`<!DOCTYPE html><html><head><style>body{font-family:sans-serif;margin:0;}</style><link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></head><body>${previewHtml}</body></html>`}
          className="w-full h-full border-0"
          title="Website Preview"
          sandbox="allow-scripts"
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
      <pre className="text-sm font-mono bg-white dark:bg-gray-800 p-4 rounded-md shadow overflow-x-auto">
        <code>{generatedCode}</code>
      </pre>
    </div>
  );
}
