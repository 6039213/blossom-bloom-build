
import { anthropicProvider } from '../providers/anthropic';
import { geminiProvider } from '../providers/gemini';
import type { LLMProvider } from '../types';

// Default to Claude if API key is available, otherwise fallback to Gemini
let selectedProvider: LLMProvider = anthropicProvider;

// Check if Anthropic API key is available
const hasAnthropicKey = () => {
  return true; // We now have a hardcoded key in the anthropic.ts file
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
  if (provider === 'claude' && !hasAnthropicKey()) {
    console.warn('Anthropic API key not found, staying with current provider');
    return;
  }
  
  if (provider === 'gemini' && !hasGeminiKey()) {
    console.warn('Gemini API key not found, staying with current provider');
    return;
  }
  
  selectedProvider = provider === 'claude' ? anthropicProvider : geminiProvider;
};

export const getSelectedModel = (): LLMProvider => {
  return selectedProvider;
};

export const getAvailableModels = () => {
  const models = [];
  
  // Add Claude if available (should always be true now with hardcoded key)
  if (hasAnthropicKey()) {
    models.push({
      id: 'claude',
      name: 'Claude 3.7 Sonnet',
      provider: 'Anthropic',
      available: true
    });
  }
  
  // Add Gemini if available
  if (hasGeminiKey()) {
    models.push({
      id: 'gemini',
      name: 'Gemini 2.5 Flash',
      provider: 'Google',
      available: true
    });
  }
  
  // If no models are available, add Claude with available false
  // (This shouldn't happen now with hardcoded Anthropic key)
  if (models.length === 0) {
    models.push({
      id: 'claude',
      name: 'Claude 3.7 Sonnet',
      provider: 'Anthropic',
      available: true // Changed to true since we have a hardcoded key
    });
  }
  
  return models;
};
