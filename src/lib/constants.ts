
// API Keys
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Application information
export const APP_NAME = 'Blossom';

// Import the gemini provider
import { geminiProvider } from "./providers/gemini";

// Provider configuration
export const PROVIDERS = { 
  gemini: geminiProvider 
};

// Model configurations - Standardized on Gemini 2.5 Flash
export const MODEL_LIST = [
  {
    name: 'gemini-2.5-flash-preview',
    label: 'Gemini 2.5 Flash',
    provider: 'gemini'
  }
];

export const DEFAULT_MODEL = 'gemini-2.5-flash-preview';

// System prompt for guidance
export const SYSTEM_PROMPT = `You are Blossom AI, a sophisticated code assistant.
Always generate TypeScript React (.tsx) files, follow Tailwind CSS utility classes from our custom gold color palette, and never touch configuration files unless explicitly asked.
When creating components, use functional components with TypeScript and proper imports.
Respond with minimal prose followed by the code.
Always define all SCSS variables in a variables.scss file and import it into all other SCSS files using the correct relative path.
All imports from the src directory MUST use the @/ prefix.
Always output React components in TypeScript (.tsx) format.
Never create .js, .jsx or plain HTML files unless explicitly asked.`;

// File extension mapping
export const FILE_EXTENSION_MAPPING = {
  '.jsx': '.tsx',
  '.js': '.tsx'
};

// Project templates
export const PROJECT_TYPES = [
  'landing',
  'dashboard',
  'ecommerce',
  'blog',
  'portfolio'
];

// Pricing plans configuration
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      'Up to 3 projects',
      'Basic templates',
      'Community support',
      'Standard AI responses',
      'Export as HTML/CSS/JS'
    ]
  },
  STANDARD: {
    name: 'Standard',
    price: 19,
    features: [
      'Unlimited projects',
      'All templates',
      'Priority support',
      'Advanced AI capabilities',
      'Custom domain hosting',
      'No Blossom branding',
      'Export source code'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    price: 49,
    features: [
      'Everything in Standard',
      'Team collaboration',
      'API access',
      'Custom templates',
      'SSO Authentication',
      'Analytics dashboard',
      'Dedicated support'
    ]
  }
};
