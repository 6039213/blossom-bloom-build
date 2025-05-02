
// API Keys
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

// Token limits and pricing
export const ANTHROPIC_MAX_TOKENS = 4096;
export const TOKENS_TO_CREDITS_RATIO = 10; // 1 token = 10 credits

// Cache settings
export const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
