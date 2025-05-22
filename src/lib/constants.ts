
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
    price: 29,
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
    price: 99,
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

// API keys (retrieved from environment variables)
export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Cache duration in milliseconds (24 hours)
export const CACHE_DURATION = 24 * 60 * 60 * 1000;

// System prompt for AI generation
export const SYSTEM_PROMPT = `You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS.
Your responses should be clear, helpful, and focused on best practices.`;

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
