
import { anthropicProvider } from '../providers/anthropic';
import { geminiProvider } from '../providers/gemini';
import type { LLMProvider } from '../types';

// Default to Claude if API key is available, otherwise fallback to Gemini
let selectedProvider: LLMProvider = anthropicProvider;

// Check if Anthropic API key is available - always true now with hardcoded key
const hasAnthropicKey = () => {
  return true;
};

// Check if Gemini API key is available
const hasGeminiKey = () => {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
};

// Initialize based on API key availability
if (!hasAnthropicKey() && hasGeminiKey()) {
  selectedProvider = geminiProvider;
}

export const setSelectedModel = (provider: 'gemini' | 'claude') => {
  // Since we now always have a Claude key, we'll allow switching regardless
  selectedProvider = provider === 'claude' ? anthropicProvider : geminiProvider;
};

export const getSelectedModel = (): LLMProvider => {
  return selectedProvider;
};

export const getAvailableModels = () => {
  const models = [];
  
  // Add Claude (always available now with hardcoded key)
  models.push({
    id: 'claude',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    available: true
  });
  
  // Add Gemini if available
  if (hasGeminiKey()) {
    models.push({
      id: 'gemini',
      name: 'Gemini 2.5 Flash',
      provider: 'Google',
      available: true
    });
  }
  
  return models;
};
