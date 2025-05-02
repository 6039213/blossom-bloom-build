
import { anthropicProvider } from '../providers/anthropic';
import { geminiProvider } from '../providers/gemini';
import type { LLMProvider } from '../types';

// Default to Gemini if no specific model is selected
let selectedProvider: LLMProvider = geminiProvider;

// Check if Anthropic API key is available
const hasAnthropicKey = () => {
  return !!import.meta.env.VITE_ANTHROPIC_API_KEY;
};

// Initialize based on API key availability
if (hasAnthropicKey()) {
  selectedProvider = anthropicProvider;
}

export const setSelectedModel = (provider: 'gemini' | 'claude') => {
  if (provider === 'claude' && !hasAnthropicKey()) {
    console.warn('Anthropic API key not found, staying with current provider');
    return;
  }
  
  selectedProvider = provider === 'claude' ? anthropicProvider : geminiProvider;
};

export const getSelectedModel = (): LLMProvider => {
  return selectedProvider;
};

export const getAvailableModels = () => {
  const models = [
    {
      id: 'gemini',
      name: 'Gemini 2.5 Flash',
      provider: 'Google',
      available: true
    }
  ];
  
  // Add Claude if available
  if (hasAnthropicKey()) {
    models.unshift({
      id: 'claude',
      name: 'Claude 3.7 Sonnet',
      provider: 'Anthropic',
      available: true
    });
  }
  
  return models;
};
