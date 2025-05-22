import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe('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', {
  apiVersion: '2025-04-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing userId' });
  }
  try {
    const subscriptions = await stripe.subscriptions.list({
      limit: 10,
      expand: ['data.default_payment_method'],
    });
    const subscription = subscriptions.data.find(sub => sub.metadata.userId === userId);
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }
    // Use type assertion to access current_period_end if present
    const currentPeriodEnd = (subscription as any).current_period_end;
    res.status(200).json({
      id: subscription.id,
      status: subscription.status,
      planId: subscription.metadata.planId,
      currentPeriodEnd: currentPeriodEnd ? currentPeriodEnd * 1000 : null,
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
} 