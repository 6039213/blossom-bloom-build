
export interface ProjectFiles {
  [key: string]: { code: string };
}

export interface InternalChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface GenerateStreamOptions {
  system?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface ErrorData {
  message: string;
  file?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  files: ProjectFiles;
  thumbnail?: string;
  prompt?: string;
}

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
