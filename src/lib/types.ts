
export interface GenerateStreamOptions {
  temperature?: number;
  maxOutputTokens?: number;
  system?: string;
  context?: string;
}

export interface StreamResult {
  tokens: number;
  creditsUsed: number;
  complete: boolean;
  fullResponse?: string;
}

export interface LLMStreamOptions {
  onToken: (token: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface LLMProvider {
  name: string;
  models: string[];
  stream: (opts: LLMStreamOptions) => Promise<void>;
  generateStream: (
    prompt: string, 
    onToken: (token: string) => void, 
    options?: GenerateStreamOptions
  ) => Promise<StreamResult>;
}

export interface LLMModelSelector {
  getSelectedModel: () => LLMProvider | null;
}
