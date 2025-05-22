import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe('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', {
  apiVersion: '2025-04-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { subscriptionId } = req.body;
  if (!subscriptionId) {
    return res.status(400).json({ error: 'Missing subscriptionId' });
  }
  try {
    const canceled = await stripe.subscriptions.cancel(subscriptionId);
    res.status(200).json({ id: canceled.id, status: canceled.status });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
} 