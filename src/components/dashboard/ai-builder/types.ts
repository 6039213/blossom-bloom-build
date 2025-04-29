
import { ChatMessage } from "@/components/dashboard/AIResponseDisplay";

export interface ProjectFile {
  code: string;
}

export interface ProjectFiles {
  [filePath: string]: ProjectFile;
}

export interface ViewportSizeProps {
  viewportSize: string;
  setViewportSize: (size: string) => void;
}

export interface ProjectTemplate {
  type: string;
  displayName: string;
  description: string;
  fileStructure: string[];
  boilerplateCode?: Record<string, string>;
  suggestedDependencies?: Record<string, string>;
  defaultPrompt: string;
}
