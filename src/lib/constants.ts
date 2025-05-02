
// API Keys
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

// Token limits and pricing
export const ANTHROPIC_MAX_TOKENS = 4096;
export const TOKENS_TO_CREDITS_RATIO = 10; // 1 token = 10 credits

// Cache settings
export const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Application name
export const APP_NAME = 'Blossom';

// System prompt for AI
export const SYSTEM_PROMPT = `
You are a helpful AI assistant that specializes in generating website code using React and Tailwind CSS.
Your goal is to help users create beautiful, responsive websites based on their descriptions.
`;

// Available AI models
export const MODEL_LIST = [
  {
    name: 'claude',
    label: 'Claude 3.7 Sonnet',
  },
  {
    name: 'gemini',
    label: 'Gemini 2.5 Flash',
  }
];

// Default AI model
export const DEFAULT_MODEL = 'claude';

// Pricing plans
export const PLANS = [
  {
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
  {
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
  {
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
];
