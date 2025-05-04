
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
