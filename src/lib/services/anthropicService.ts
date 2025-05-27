
import { ANTHROPIC_CONFIG, SYSTEM_PROMPT } from '@/lib/constants';
import { toast } from 'sonner';

export interface FileContent {
  path: string;
  content: string;
  type?: string;
}

export interface GenerationOptions {
  system?: string;
  temperature?: number;
  maxTokens?: number;
}

class AnthropicService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = ANTHROPIC_CONFIG.apiKey;
    this.model = ANTHROPIC_CONFIG.model;
  }

  async generateCode(
    prompt: string,
    existingFiles: FileContent[] = [],
    options: GenerationOptions = {}
  ): Promise<string> {
    if (!this.apiKey) {
      toast.error("Anthropic API key not configured");
      throw new Error("API key not configured");
    }

    try {
      // Prepare context from existing files
      let filesContext = "";
      if (existingFiles.length > 0) {
        filesContext = "Here are the existing files in the project:\n\n" +
          existingFiles.map(file => `File: ${file.path}\n\`\`\`\n${file.content}\n\`\`\``).join("\n\n") +
          "\n\nPlease work with these existing files and create new ones as needed.";
      }

      const fullPrompt = filesContext ? 
        `${filesContext}\n\nNow, based on the existing codebase, ${prompt}` : 
        prompt;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: options.maxTokens || ANTHROPIC_CONFIG.maxTokens,
          temperature: options.temperature || ANTHROPIC_CONFIG.temperature,
          system: options.system || SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: fullPrompt
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        return data.content[0].text;
      }
      
      throw new Error("Unexpected response format from Anthropic API");
    } catch (error) {
      console.error("Anthropic generation error:", error);
      toast.error(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  extractFilesFromResponse(text: string): FileContent[] {
    const codeBlockRegex = /```(?:jsx?|tsx?|html|css|json)?\s*(?:\/\/\s*)?([^\n]+)?\n([\s\S]*?)```/g;
    const files: FileContent[] = [];
    
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const pathLine = match[1]?.trim();
      const content = match[2]?.trim() || "";
      
      // Extract file path from various formats
      let path = pathLine || `file${files.length + 1}.tsx`;
      
      // Clean up common path prefixes
      if (path.startsWith('// ') || path.startsWith('# ')) {
        path = path.substring(2).trim();
      }
      
      // Ensure path starts with src/ if it's a component
      if (!path.startsWith('src/') && !path.startsWith('public/') && !path.startsWith('/')) {
        if (path.includes('component') || path.includes('Component') || path.endsWith('.tsx') || path.endsWith('.jsx')) {
          path = `src/components/${path}`;
        } else {
          path = `src/${path}`;
        }
      }
      
      const fileExtension = path.split('.').pop() || 'tsx';
      
      files.push({
        path,
        content,
        type: fileExtension
      });
    }
    
    return files;
  }
}

export const anthropicService = new AnthropicService();
export default anthropicService;
