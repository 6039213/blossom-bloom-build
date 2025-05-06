
// API keys should come from environment variables or Supabase secrets
// These are placeholders that will be replaced at runtime
export const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Project constants
export const PROJECT_NAME = 'Blossom AI';
export const PROJECT_DESCRIPTION = 'AI-powered web application builder';
export const APP_NAME = 'Blossom AI'; // Adding APP_NAME

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

// Cache duration in milliseconds (24 hours)
export const CACHE_DURATION = 24 * 60 * 60 * 1000;

// System prompt for AI
export const SYSTEM_PROMPT = `You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS.
Generate a complete, functional website based on the user's prompt.`;

// Pricing plans
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '3 AI-generated websites',
      'Basic components',
      'Community support',
      'Export HTML & CSS'
    ]
  },
  STANDARD: {
    name: 'Standard',
    price: 9.99,
    features: [
      'Unlimited websites',
      'Advanced components',
      'Priority support',
      'Export source code',
      'Custom domains'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    price: 19.99,
    features: [
      'Everything in Standard',
      'Team collaboration',
      'White labeling',
      'API access',
      'Advanced analytics',
      '24/7 dedicated support'
    ]
  }
};
