
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: {
    included: boolean;
    text: string;
  }[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  highlighted?: boolean;
}

export default function Pricing() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out our platform with basic features.",
      features: [
        { included: true, text: "3 projects" },
        { included: true, text: "Basic AI website generation" },
        { included: true, text: "Community support" },
        { included: false, text: "Custom domains" },
        { included: false, text: "Advanced AI models" },
        { included: false, text: "Priority support" }
      ],
      buttonText: "Get Started",
      buttonVariant: "outline"
    },
    {
      name: "Pro",
      price: billingInterval === 'monthly' ? "$19" : "$190",
      description: "Everything you need for professional web development.",
      features: [
        { included: true, text: "Unlimited projects" },
        { included: true, text: "Advanced AI website generation" },
        { included: true, text: "Custom domains" },
        { included: true, text: "API access" },
        { included: true, text: "Email support" },
        { included: false, text: "Enterprise features" }
      ],
      buttonText: "Subscribe",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: billingInterval === 'monthly' ? "$99" : "$990",
      description: "Advanced features for teams and businesses.",
      features: [
        { included: true, text: "Everything in Pro" },
        { included: true, text: "Team collaboration" },
        { included: true, text: "Custom AI training" },
        { included: true, text: "SSO Authentication" },
        { included: true, text: "Dedicated account manager" },
        { included: true, text: "24/7 phone support" }
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <MainNavbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-900 dark:text-amber-300">Simple, Transparent Pricing</h1>
          <p className="text-xl text-amber-700 dark:text-amber-400 max-w-2xl mx-auto">
            Choose the plan that's right for you and start building amazing websites with AI.
          </p>
          
          <div className="flex items-center justify-center mt-8">
            <div className="bg-amber-100/70 dark:bg-amber-900/30 p-1 rounded-lg inline-flex">
              <button
                className={`px-4 py-2 rounded-md transition-all ${billingInterval === 'monthly' ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-900 dark:text-amber-300' : 'text-amber-700 dark:text-amber-400'}`}
                onClick={() => setBillingInterval('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${billingInterval === 'yearly' ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-900 dark:text-amber-300' : 'text-amber-700 dark:text-amber-400'}`}
                onClick={() => setBillingInterval('yearly')}
              >
                Yearly <span className="text-xs text-amber-600 dark:text-amber-500">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <Card 
              key={i} 
              className={`p-8 flex flex-col border-amber-200 dark:border-amber-700 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm ${
                tier.highlighted 
                  ? 'border-2 border-amber-500 dark:border-amber-400 shadow-lg shadow-amber-200/30 dark:shadow-amber-900/20' 
                  : ''
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs py-1 px-3 rounded-full">Popular</span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-300">{tier.name}</h3>
              <div className="mt-4 mb-4">
                <span className="text-3xl font-bold text-amber-900 dark:text-amber-300">{tier.price}</span>
                <span className="text-amber-700 dark:text-amber-400 ml-1">
                  {billingInterval === 'monthly' ? '/month' : '/year'}
                </span>
              </div>
              <p className="text-amber-700 dark:text-amber-400 mb-6">{tier.description}</p>
              
              <ul className="mb-8 space-y-3 flex-1">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-amber-400 dark:text-amber-600 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "text-amber-800 dark:text-amber-300" : "text-amber-500 dark:text-amber-500"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild
                className={`w-full ${
                  tier.buttonVariant === 'outline' 
                    ? 'border-amber-500 text-amber-700 dark:border-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                }`}
                variant={tier.buttonVariant || "default"}
              >
                <Link to="/auth">
                  {tier.buttonText}
                </Link>
              </Button>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-amber-900 dark:text-amber-300">Need something more specific?</h2>
          <p className="text-amber-700 dark:text-amber-400 mb-6 max-w-xl mx-auto">
            Contact our sales team for custom pricing options or to discuss specific requirements for your organization.
          </p>
          <Button asChild variant="outline" className="border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20">
            <a href="mailto:sales@example.com">Contact Sales</a>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
