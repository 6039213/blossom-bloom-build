
export interface StreamResult {
  tokens: number;
  creditsUsed: number;
  complete: boolean;
  fullResponse?: string;
}

export interface LLMProvider {
  name: string;
  models: string[];
  generateStream: (prompt: string, onToken: (token: string) => void, options?: any) => Promise<StreamResult>;
}
