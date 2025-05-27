
import { generateCode, extractFilesFromResponse, type FileContent } from './claudeService';

export { type FileContent } from './claudeService';

export class AnthropicService {
  static async generateCode(
    prompt: string,
    existingFiles: FileContent[] = [],
    options: {
      system?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    return generateCode(prompt, existingFiles, undefined, options);
  }

  static extractFilesFromResponse(text: string): FileContent[] {
    return extractFilesFromResponse(text);
  }
}

// Export as anthropicService for compatibility
export const anthropicService = {
  generateCode: AnthropicService.generateCode.bind(AnthropicService),
  extractFilesFromResponse: AnthropicService.extractFilesFromResponse.bind(AnthropicService)
};

export default anthropicService;
