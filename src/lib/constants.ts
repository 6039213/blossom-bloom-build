
// Application constants

// App name
export const APP_NAME = "Blossom";

// Plan definitions
export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    features: [
      "3 projects",
      "Basic AI website generation",
      "Community support",
      "Standard templates",
      "Public hosting",
    ]
  },
  STANDARD: {
    name: "Standard",
    price: 20,
    priceId: "prod_S9HVoXku7P4TBW",
    features: [
      "Unlimited projects",
      "Advanced AI website generation",
      "Custom domains",
      "Priority support",
      "Premium templates",
      "API access",
      "Remove Blossom branding",
    ]
  },
  PREMIUM: {
    name: "Premium",
    price: 100,
    priceId: "prod_S9HVkBwzlkjjAE",
    features: [
      "Everything in Standard",
      "Team collaboration",
      "Custom AI training",
      "Advanced analytics",
      "Dedicated account manager",
      "White-label solution",
      "SSO Authentication",
      "24/7 priority support",
    ]
  }
};

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: "pk_live_51R2XkQP3GFaeFOE467f1y4JLmp6cXwtrLi8CxrsFirS0zqdCL1H42cNU6UUCvRg5WlI6zVpgjzS2LtJRJRkBx35M004xazkEeo",
  secretKey: "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"
};

// Anthropic API configuration
export const ANTHROPIC_CONFIG = {
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
  model: "claude-3-5-sonnet-20241022",
  maxTokens: 4000,
  temperature: 0.7
};

// API Keys (for compatibility with legacy code)
export const ANTHROPIC_API_KEY = ANTHROPIC_CONFIG.apiKey;
export const OPENAI_API_KEY = '';
export const GEMINI_API_KEY = '';

// System prompt for AI generation
export const SYSTEM_PROMPT = `You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS.
Your responses should be clear, helpful, and focused on best practices.
Generate complete, functional React components with proper TypeScript typing.
Use Tailwind CSS for all styling and ensure responsive design.
Format your code blocks properly with file paths.`;

// Cache duration in milliseconds (24 hours)
export const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Company information
export const COMPANY_INFO = {
  name: APP_NAME,
  tagline: "Create Beautiful Websites with AI-Powered Magic",
  email: "support@blossom.io",
  socialLinks: {
    twitter: "https://twitter.com/blossomaiapp",
    github: "https://github.com/blossom-ai",
    discord: "https://discord.gg/blossom"
  },
  address: "123 AI Boulevard, San Francisco, CA 94107",
};

// Copyright text
export const COPYRIGHT_TEXT = `© ${new Date().getFullYear()} ${COMPANY_INFO.name}. All rights reserved.`;
