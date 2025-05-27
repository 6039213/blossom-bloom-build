
import { STRIPE_CONFIG, PLANS } from '@/lib/constants';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Handle OPTIONS request for CORS preflight
export function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const { planId, userId } = await request.json();
    
    // Find the plan
    const plan = Object.values(PLANS).find(p => p.priceId === planId);
    if (!plan) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan ID' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // In a real implementation, you would create a Stripe checkout session here
    // For now, we'll create a mock session that redirects to Stripe
    const sessionData = {
      id: 'cs_' + Math.random().toString(36).substring(2, 15),
      url: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substring(2, 15)}#fidkdWxOYHwnPyd1blpxYHZxWjA0VGpyZDBLdGhATlZxVF01TktrVlZqT3FuNDRHTE1nVkRLTE9xTTVKajJKYm9qPGpCNk42a1NoSGR2M1FCNTFLf2J3UGNqUnZMMkNnbEpHYmFLXzVVb0FAN00wVTJSUEhKZzAxSycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl`
    };

    return new Response(
      JSON.stringify(sessionData),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { status: 500, headers: corsHeaders }
    );
  }
}
