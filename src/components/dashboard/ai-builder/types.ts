
// Types for Project Files
export interface ProjectFiles {
  [path: string]: {
    code: string;
  };
}

// Types for Web Container
export interface WebContainerInstance {
  applyDiff: (diff: string) => Promise<void>;
  installAndRestartIfNeeded: (filesChanged: string[]) => Promise<void>;
  snapshot: () => Promise<any>;
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

// Project Templates
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  displayName: string;
  icon?: string;
  dependencies?: Record<string, string>;
}

// Chat Message Types
export interface AIMessage {
  role: 'assistant';
  content: string;
  files?: Record<string, string>;
  npmChanges?: string[];
}

export interface UserMessage {
  role: 'user';
  content: string;
}

export type InternalChatMessage = AIMessage | UserMessage;

// Error Type
export interface RuntimeError {
  message: string;
  file?: string;
}

// Gemini Response Type
export interface GeminiResponse {
  files: Record<string, string>;
  message: string;
  npmChanges?: string[];
}
