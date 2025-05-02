
import React, { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, FileText, MessageCircle, Book } from "lucide-react";
import { Link } from 'react-router-dom';

interface HelpArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const helpArticles: HelpArticle[] = [
    {
      id: "getting-started",
      title: "Getting Started with Blossom AI",
      excerpt: "Learn how to create your first website using our AI builder.",
      category: "basics"
    },
    {
      id: "api-keys",
      title: "Managing API Keys",
      excerpt: "How to set up and manage API keys for external services.",
      category: "advanced"
    },
    {
      id: "deploying",
      title: "Deploying Your Website",
      excerpt: "A step-by-step guide to deploying your Blossom website.",
      category: "deployment"
    },
    {
      id: "custom-domains",
      title: "Setting up Custom Domains",
      excerpt: "Connect your own domain to your Blossom website.",
      category: "deployment"
    },
    {
      id: "ai-prompts",
      title: "Writing Effective AI Prompts",
      excerpt: "Tips for getting better results from the AI builder.",
      category: "ai"
    },
    {
      id: "editing-code",
      title: "Editing Generated Code",
      excerpt: "How to customize and extend the AI-generated code.",
      category: "advanced"
    }
  ];
  
  const faqs: FAQ[] = [
    {
      question: "How does the AI builder work?",
      answer: "Our AI builder uses Claude 3.7 Sonnet to analyze your requirements and generate complete, functional websites based on your instructions. It can create React components, styling, and functionality all from simple text prompts.",
      category: "ai"
    },
    {
      question: "Can I edit the code after it's generated?",
      answer: "Yes, you have full access to edit and customize all generated code. You can use our built-in code editor or export the project for editing in your preferred development environment.",
      category: "basics"
    },
    {
      question: "Do I need to know how to code to use Blossom?",
      answer: "No, you don't need coding knowledge to create websites with Blossom. Our AI builder can generate complete websites from simple text descriptions. However, having some knowledge of web development can help you customize and extend your projects further.",
      category: "basics"
    },
    {
      question: "How do I deploy my website?",
      answer: "Blossom provides one-click deployment to our hosting platform. Once your website is ready, simply click the 'Deploy' button in your project dashboard. You can also export your project and deploy it to any hosting provider that supports React applications.",
      category: "deployment"
    },
    {
      question: "Can I use my own domain name?",
      answer: "Yes, you can connect your own custom domain to your Blossom website. Go to your project settings, navigate to the 'Domains' section, and follow the instructions to set up your domain with our platform.",
      category: "deployment"
    },
    {
      question: "What API integrations are supported?",
      answer: "Blossom supports a wide range of API integrations, including authentication providers, database services, payment processors, and more. You can add your API keys in the API Settings section and the AI builder can help you implement these integrations in your website.",
      category: "advanced"
    }
  ];
  
  const categories = [
    { id: "basics", name: "Basics", icon: <Book className="h-4 w-4" /> },
    { id: "ai", name: "AI Builder", icon: <Sparkles className="h-4 w-4" /> },
    { id: "deployment", name: "Deployment", icon: <Globe className="h-4 w-4" /> },
    { id: "advanced", name: "Advanced", icon: <Code className="h-4 w-4" /> }
  ];

  const filteredArticles = helpArticles.filter(article => 
    (activeCategory ? article.category === activeCategory : true) &&
    (searchQuery ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );
  
  const filteredFaqs = faqs.filter(faq => 
    (activeCategory ? faq.category === activeCategory : true) &&
    (searchQuery ? faq.question.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4">
          <h1 className="text-2xl font-bold">Help Center</h1>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search for help articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="mb-6 flex flex-wrap gap-3">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(null)}
              >
                All Categories
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
            
            <Tabs defaultValue="articles">
              <TabsList className="mb-4">
                <TabsTrigger value="articles" className="flex gap-2 items-center">
                  <FileText className="h-4 w-4" />
                  Help Articles
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex gap-2 items-center">
                  <MessageCircle className="h-4 w-4" />
                  FAQs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="articles">
                {filteredArticles.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredArticles.map(article => (
                      <Card 
                        key={article.id} 
                        className="p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-medium mb-2">{article.title}</h3>
                        <p className="text-muted-foreground mb-4 text-sm">{article.excerpt}</p>
                        <Button asChild variant="ghost" size="sm" className="mt-auto">
                          <Link to={`/dashboard/help/${article.id}`}>Read More</Link>
                        </Button>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No help articles found for your search.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="faq">
                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No FAQs found for your search.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="mt-12 text-center p-6 bg-muted rounded-lg">
              <h2 className="text-xl font-bold mb-2">Can't find what you're looking for?</h2>
              <p className="text-muted-foreground mb-4">
                Our support team is ready to help with any questions you might have.
              </p>
              <Button asChild>
                <a href="mailto:support@example.com">Contact Support</a>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Missing components
const Sparkles = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const Globe = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const Code = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
