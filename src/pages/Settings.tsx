
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star } from 'lucide-react';
import { PLANS, STRIPE_CONFIG } from '@/lib/constants';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

export default function Settings() {
  const handleSubscribe = async (planId: string) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId: 'user_' + Date.now(), // In real app, get from auth
        }),
      });

      const session = await response.json();
      
      if (session.url) {
        // Redirect to Stripe checkout
        window.open(session.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <Layout>
      <div className="container py-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your subscription and application preferences.
            </p>
          </div>
          
          <Tabs defaultValue="subscription" className="space-y-6">
            <TabsList>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscription" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <Card key={key} className={`relative ${key === 'STANDARD' ? 'border-primary shadow-lg' : ''}`}>
                    {key === 'STANDARD' && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-2">
                        {key === 'FREE' && <Star className="h-8 w-8 text-gray-400" />}
                        {key === 'STANDARD' && <Check className="h-8 w-8 text-primary" />}
                        {key === 'PREMIUM' && <Crown className="h-8 w-8 text-yellow-500" />}
                      </div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        <span className="text-3xl font-bold">€{plan.price}</span>
                        {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {plan.price > 0 && (
                        <Button 
                          className="w-full" 
                          variant={key === 'STANDARD' ? 'default' : 'outline'}
                          onClick={() => handleSubscribe(plan.priceId)}
                        >
                          Subscribe to {plan.name}
                        </Button>
                      )}
                      {plan.price === 0 && (
                        <Button className="w-full" variant="outline" disabled>
                          Current Plan
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>User Preferences</CardTitle>
                  <CardDescription>
                    Configure your application preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Preferences settings coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize how your application looks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Appearance settings coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
