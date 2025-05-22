
export const APP_NAME = "Blossom AI";

export const CLAUDE_MODEL = "claude-3-7-sonnet-20240229";

// API Keys - Use environment variables or empty strings as defaults
export const ANTHROPIC_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || "";
export const OPENAI_API_KEY = "";
export const GEMINI_API_KEY = "";

// System prompts
export const SYSTEM_PROMPT = "You are an expert web developer that creates beautiful, modern websites using React and Tailwind CSS.";

// Cache settings
export const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Plans configuration
export const PLANS = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "3 AI projects per month",
      "Basic AI generation models",
      "Community support",
      "24-hour response time"
    ]
  },
  STANDARD: {
    id: "standard",
    productId: "prod_S9HVoXku7P4TBW",
    name: "Standard",
    price: 20,
    features: [
      "Unlimited AI projects",
      "Advanced AI models",
      "Priority email support",
      "Custom domains",
      "4-hour response time"
    ]
  },
  PREMIUM: {
    id: "premium",
    productId: "prod_S9HVkBwzlkjjAE",
    name: "Premium",
    price: 100,
    features: [
      "Everything in Standard",
      "Dedicated account manager",
      "Custom AI model training",
      "Team collaboration",
      "Phone support",
      "1-hour response time"
    ]
  }
};

// Stripe configuration
export const STRIPE_PUBLIC_KEY = "pk_live_51R2XkQP3GFaeFOE467f1y4JLmp6cXwtrLi8CxrsFirS0zqdCL1H42cNU6UUCvRg5WlI6zVpgjzS2LtJRJRkBx35M004xazkEeo";

// API settings (using your common API)
export const USE_COMMON_API = true;
