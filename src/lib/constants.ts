
// API Keys - hardcoded backup for Claude
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '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';

// Token limits and pricing
export const ANTHROPIC_MAX_TOKENS = 4096;
export const TOKENS_TO_CREDITS_RATIO = 10; // 1 token = 10 credits

// Cache settings
export const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Application name
export const APP_NAME = 'Blossom';

// System prompt for AI
export const SYSTEM_PROMPT = `
You are an expert AI assistant specialized in generating complete web applications using React and Tailwind CSS.
Your task is to create fully functional, responsive, and beautiful websites based on user descriptions.

When generating code:
1. Create all necessary files including components, styles, and utilities
2. Use TypeScript for all components
3. Implement responsive design using Tailwind CSS
4. Structure the application logically with separate components
5. Add detailed comments to help understand complex logic
6. Ensure proper error handling and fallbacks

Always aim to create a complete solution that works out of the box.
`;

// Available AI models - now only showing Claude 3.7 Sonnet
export const MODEL_LIST = [
  {
    name: 'claude',
    label: 'Claude 3.7 Sonnet',
  }
];

// Default AI model
export const DEFAULT_MODEL = 'claude';

// Pricing plans - change from array to object with named properties
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    description: 'Get started with basic features',
    features: [
      '5 projects',
      'Basic templates',
      'Community support',
      '1,000 AI credits per month'
    ],
    highlight: false,
    buttonText: 'Get Started'
  },
  STANDARD: {
    name: 'Pro',
    price: 19,
    description: 'For professionals and small teams',
    features: [
      'Unlimited projects',
      'All templates',
      'Priority support',
      '10,000 AI credits per month',
      'Custom domains',
      'Remove Blossom branding'
    ],
    highlight: true,
    buttonText: 'Upgrade to Pro'
  },
  PREMIUM: {
    name: 'Enterprise',
    price: 49,
    description: 'For businesses with custom needs',
    features: [
      'Everything in Pro',
      'Dedicated support',
      '50,000 AI credits per month',
      'Custom integrations',
      'Team collaboration',
      'Advanced analytics'
    ],
    highlight: false,
    buttonText: 'Contact Sales'
  }
};

// For backward compatibility, also export PLANS as an array
export const PLANS_ARRAY = [PLANS.FREE, PLANS.STANDARD, PLANS.PREMIUM];
