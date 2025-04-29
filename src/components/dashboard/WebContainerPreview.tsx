
import { useProjectStore } from "@/stores/projectStore";

export default function WebContainerPreview() {
  const { previewHtml } = useProjectStore();
  
  return (
    <iframe
      srcDoc={previewHtml}
      className="h-full w-full border-0"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
