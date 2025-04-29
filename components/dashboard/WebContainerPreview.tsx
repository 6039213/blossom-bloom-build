
import { useProjectStore } from '@/stores/project';

export const WebContainerPreview = () => {
  const { previewHtml } = useProjectStore();
  return (
    <iframe
      srcDoc={previewHtml}
      className="h-full w-full border-0"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};
