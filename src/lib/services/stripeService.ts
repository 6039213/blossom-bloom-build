import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = 'pk_live_51R2XkQP3GFaeFOE467f1y4JLmp6cXwtrLi8CxrsFirS0zqdCL1H42cNU6UUCvRg5WlI6zVpgjzS2LtJRJRkBx35M004xazkEeo';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  productId: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 20,
    features: [
      'Basic AI Code Generation',
      'Standard Support',
      'Up to 5 Projects'
    ],
    productId: 'prod_S9HVoXku7P4TBW'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 100,
    features: [
      'Advanced AI Code Generation',
      'Priority Support',
      'Unlimited Projects',
      'Custom Templates',
      'Team Collaboration'
    ],
    productId: 'prod_S9HVkBwzlkjjAE'
  }
];

export async function createCheckoutSession(planId: string, userId: string) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        userId,
      }),
    });

    const session = await response.json();

    if (!response.ok) {
      throw new Error(session.error || 'Failed to create checkout session');
    }

    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function getSubscriptionStatus(userId: string) {
  try {
    const response = await fetch(`/api/subscription-status?userId=${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get subscription status');
    }

    return data;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to cancel subscription');
    }

    return data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
} 