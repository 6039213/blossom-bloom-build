
// API Keys
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Model configurations
export const MODEL_LIST = [
  {
    name: 'gemini-pro',
    label: 'Gemini Pro',
    provider: 'gemini'
  },
  {
    name: 'gemini-1.5-flash',
    label: 'Gemini 1.5 Flash',
    provider: 'gemini'
  }
];

export const DEFAULT_MODEL = 'gemini-1.5-flash';

// System prompt for guidance
export const SYSTEM_PROMPT = `You are Blossom AI, a sophisticated code assistant.
Always generate TypeScript React (.tsx) files, follow Tailwind CSS utility classes from our custom gold color palette, and never touch configuration files unless explicitly asked.
When creating components, use functional components with TypeScript and proper imports.
Respond with minimal prose followed by the code.
Always define all SCSS variables in a variables.scss file and import it into all other SCSS files using the correct relative path.
All imports from the src directory MUST use the @/ prefix.`;

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
