
// API keys should come from environment variables or Supabase secrets
// These are placeholders that will be replaced at runtime
export const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Project constants
export const PROJECT_NAME = 'Blossom AI';
export const PROJECT_DESCRIPTION = 'AI-powered web application builder';

// Feature flags
export const FEATURES = {
  AI_BUILDER: true,
  WEB_CONTAINER: false,
  CODE_EDITOR: true,
};

// Theme colors
export const THEME_COLORS = {
  primary: 'amber',
  secondary: 'blue',
  accent: 'emerald',
};
