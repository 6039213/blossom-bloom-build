
export interface LLMProvider {
  name: string;
  models: string[];
  stream: (opts: {
    messages: Array<{ role: string; content: string }>;
    model?: string;
    onToken: (token: string) => void;
  }) => Promise<void>;
  generateStream: (
    prompt: string, 
    onToken: (token: string) => void, 
    options?: { temperature?: number; maxOutputTokens?: number }
  ) => Promise<any>;
}
