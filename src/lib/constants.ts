
export const APP_NAME = 'Blossom';
export const APP_DESCRIPTION = 'Create beautiful websites with AI';
export const GEMINI_API_KEY = 'AIzaSyAOo3YOsgQE5Qq4APJISQ6tuQvd_dFmVV0'; 
export const STRIPE_PUBLIC_KEY = 'pk_live_51R2XkQP3GFaeFOE467f1y4JLmp6cXwtrLi8CxrsFirS0zqdCL1H42cNU6UUCvRg5WlI6zVpgjzS2LtJRJRkBx35M004xazkEeo';

// Plans
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '3 projects',
      'Basic website builder',
      'Community support'
    ]
  },
  STANDARD: {
    name: 'Standard',
    price: 20,
    stripePriceId: 'prod_S9HVoXku7P4TBW',
    features: [
      'Unlimited projects',
      'AI content generation',
      'Custom domains',
      'Priority support',
      'Version history'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    price: 100,
    stripePriceId: 'prod_S9HVkBwzlkjjAE',
    features: [
      'Everything in Standard',
      'Advanced AI features',
      'White-label websites',
      'Team collaboration',
      'API access',
      'Analytics dashboard'
    ]
  }
}
