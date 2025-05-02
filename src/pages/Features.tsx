
import React from 'react';
import { Rocket, Zap, Database, Shield, Code, Laptop } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';

export default function Features() {
  const features = [
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: "AI-Powered Website Generation",
      description: "Create complete websites from simple text prompts with advanced AI models."
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Lightning Fast Development",
      description: "Build in minutes what would normally take days or weeks with traditional development."
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: "Project Management",
      description: "Organize and manage all your web projects in one centralized dashboard."
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Secure Deployment",
      description: "Deploy your websites with industry-standard security practices built in."
    },
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Full Code Access",
      description: "Get complete access to the generated code, with no lock-in or black boxes."
    },
    {
      icon: <Laptop className="h-10 w-10 text-primary" />,
      title: "Responsive Design",
      description: "All generated websites are fully responsive and work on any device."
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-gradient-to-r from-primary to-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features for Modern Web Development</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Build, deploy, and manage websites with our AI-powered platform
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to experience these features?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
