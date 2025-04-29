
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

// WebContainer related types
export interface WebContainerInstance {
  applyDiff: (diff: string) => Promise<void>;
  installAndRestartIfNeeded: (filesChanged: string[]) => Promise<void>;
  snapshot: () => Promise<void>;
  revert: () => Promise<void>;
  packZip: () => Promise<Blob>;
  onTerminalData: (callback: (data: string) => void) => () => void;
}

export interface FileChange {
  path: string;
  content: string;
  type: 'create' | 'update' | 'delete';
}

export interface DiffResult {
  changes: FileChange[];
  requiresInstall: boolean;
}

// Extension of ChatMessage for internal use
export interface InternalChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id: string;
  createdAt?: Date;
}

