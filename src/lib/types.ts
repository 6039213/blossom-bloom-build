
export interface LLMProvider {
  name: string;
  models: string[];
  stream: (opts: {
    messages: Array<{ role: string; content: string }>;
    model?: string;
    onToken: (token: string) => void;
  }) => Promise<void>;
}
