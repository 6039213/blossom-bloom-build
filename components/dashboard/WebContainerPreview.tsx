
import { getServerUrl } from '@/lib/builder/webcontainer';

export const WebContainerPreview = () => {
  return <iframe src={getServerUrl()} className="h-full w-full border-0" />;
};
