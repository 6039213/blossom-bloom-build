
import { anthropicProvider } from '../providers/anthropic';
import type { LLMProvider } from '../types';

// Always use Claude 3.7 Sonnet as our provider
const selectedProvider: LLMProvider = anthropicProvider;

export const setSelectedModel = () => {
  // Only Claude 3.7 Sonnet is available, so this is a no-op
  return;
};

export const getSelectedModel = (): LLMProvider => {
  return selectedProvider;
};

export const getAvailableModels = () => {
  // Only return Claude 3.7 Sonnet as available model
  return [
    {
      id: 'claude',
      name: 'Claude 3.7 Sonnet',
      provider: 'Anthropic',
      available: true
    }
  ];
};
