
import { anthropicProvider } from "../providers/anthropic";
import type { LLMProvider } from "../types";

// Define available providers
const providers: Record<string, LLMProvider> = {
  claude: anthropicProvider,
  // Add other providers as needed
};

// Set the default provider
const DEFAULT_PROVIDER = 'claude';

// Get the selected AI model based on user preferences or default
export function getSelectedModel(): LLMProvider | null {
  try {
    // For security, we're only using the demo mode of the Claude provider
    console.log("Using Claude provider in demo mode for security");
    return providers[DEFAULT_PROVIDER];
  } catch (error) {
    console.error('Error getting selected model:', error);
    return null;
  }
}

// Get all available models
export function getAllModels(): { id: string, name: string }[] {
  const models: { id: string, name: string }[] = [];
  
  // Add models from all providers
  Object.entries(providers).forEach(([providerId, provider]) => {
    provider.models.forEach(modelId => {
      models.push({
        id: `${providerId}:${modelId}`,
        name: `${modelId} (Demo Mode)` // Mark as Demo Mode for security
      });
    });
  });
  
  return models;
}
