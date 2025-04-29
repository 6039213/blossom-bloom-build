
// API Keys
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Application information
export const APP_NAME = 'Blossom';

// Import the gemini provider
import { geminiProvider } from "./providers/gemini";

// Provider configuration - Standardized on Gemini 2.5 Flash only
export const PROVIDERS = { 
  gemini: geminiProvider 
};

// Simplified model configuration - Only using Gemini 2.5 Flash
export const MODEL_LIST = [
  {
    name: 'gemini-2.5-flash-preview',
    label: 'Gemini 2.5 Flash',
    provider: 'gemini'
  }
];

export const DEFAULT_MODEL = 'gemini-2.5-flash-preview';

// System prompt for guidance
export const SYSTEM_PROMPT = `You are Blossom AI, a sophisticated code assistant specialized in generating modern websites with React and TypeScript.
Generate complete, functional TypeScript React components following best practices.
Use Tailwind CSS for styling with our branded gold color palette.
Always use functional components with TypeScript and proper imports.
Keep responses concise, focusing primarily on code with minimal explanations.
All imports from the src directory MUST use the @/ prefix.
Always output React components in TypeScript (.tsx) format.`;

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
