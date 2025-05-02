import { anthropicProvider } from '../providers/anthropic';
import { geminiProvider } from '../providers/gemini';
import type { LLMProvider } from '../types';

// Always use Claude 3.7 Sonnet as our default provider
let selectedProvider: LLMProvider = anthropicProvider;

// Check if Anthropic API key is available - we now have a hardcoded key
const hasAnthropicKey = () => {
  return true;
};

// We're only using Claude 3.7 Sonnet, but keeping this for potential future expansion
const hasGeminiKey = () => {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
};

// Initialize based on API key availability - but always default to Claude
if (!hasAnthropicKey() && hasGeminiKey()) {
  selectedProvider = geminiProvider;
} else {
  selectedProvider = anthropicProvider; // Ensure Claude is selected
}

export const setSelectedModel = (provider: 'gemini' | 'claude') => {
  // For now we're only using Claude 3.7 Sonnet
  selectedProvider = anthropicProvider;
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
