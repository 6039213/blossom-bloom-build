
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, Info, MessageCircle, Video, BookOpen, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Sample FAQs
const faqs = [
  {
    question: "How do I create a new project?",
    answer: "To create a new project, navigate to the Dashboard and click the 'Create New Project' button. You'll be prompted to select a template or start from scratch, then give your project a name."
  },
  {
    question: "How does the AI Website Builder work?",
    answer: "The AI Website Builder uses Claude 3.7 Sonnet to generate React components based on your text description. Simply describe the website you want, and the AI will create the HTML, CSS, and React code for you. You can then customize, preview, and export the code."
  },
  {
    question: "Can I export my projects?",
    answer: "Yes, you can export your projects as a ZIP file containing all the source code. This allows you to continue development in your preferred environment or deploy the site to any hosting service."
  },
  {
    question: "How do I invite team members?",
    answer: "Go to the Team page, click on 'Invite Member', and enter their email address and role. They'll receive an invitation to join your team and collaborate on your projects."
  },
  {
    question: "What's the difference between the pricing plans?",
    answer: "Our pricing plans differ based on the number of projects you can create, team members you can add, priority support, and additional features like custom domains and commercial usage rights."
  },
  {
    question: "How secure is my data?",
    answer: "We take security seriously and employ industry-standard encryption and security practices. Your project data is encrypted at rest and in transit, and we perform regular security audits of our infrastructure."
  }
];

// Sample tutorials
const tutorials = [
  {
    title: "Getting Started with Blossom AI",
    description: "Learn the basics of creating and managing projects",
    length: "5 min",
    type: "video"
  },
  {
    title: "Using the AI Website Builder",
    description: "How to create websites using natural language",
    length: "8 min",
    type: "video"
  },
  {
    title: "Team Collaboration",
    description: "Working with team members on shared projects",
    length: "6 min",
    type: "video"
  },
  {
    title: "Customizing Generated Code",
    description: "How to modify and extend AI-generated code",
    length: "10 min",
    type: "article"
  },
  {
    title: "Deploying Your Website",
    description: "Options for publishing your Blossom AI projects",
    length: "7 min",
    type: "article"
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    searchQuery === '' || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
            <p className="text-muted-foreground">Find answers, tutorials, and support resources.</p>
          </div>
          
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              type="search" 
              placeholder="Search for help..." 
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Documentation
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Guides</div>
              <p className="text-xs text-muted-foreground">
                Detailed documentation and user guides
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#documentation">
                  <span>Browse docs</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Video Tutorials
              </CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Learn</div>
              <p className="text-xs text-muted-foreground">
                Step-by-step video guides and walkthroughs
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#tutorials">
                  <span>Watch tutorials</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Support
              </CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Contact us</div>
              <p className="text-xs text-muted-foreground">
                Get help from our support team
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#contact">
                  <span>Contact support</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Tabs defaultValue="faqs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="faqs" className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center gap-1.5">
              <Video className="h-4 w-4" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about Blossom AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  
                  {filteredFaqs.length === 0 && (
                    <div className="py-8 text-center">
                      <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="font-medium mb-1">No FAQs found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try a different search term or browse all FAQs by clearing your search.
                      </p>
                      <Button
                        variant="link"
                        onClick={() => setSearchQuery('')}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tutorials">
            <Card>
              <CardHeader>
                <CardTitle>Tutorials & Guides</CardTitle>
                <CardDescription>
                  Learn how to use Blossom AI with step-by-step tutorials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {tutorials.map((tutorial, index) => (
                    <div 
                      key={index}
                      className="border rounded-lg p-4 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{tutorial.title}</h3>
                        <Badge variant="outline" className={
                          tutorial.type === "video" 
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }>
                          {tutorial.type === "video" ? (
                            <Video className="h-3 w-3 mr-1" />
                          ) : (
                            <BookOpen className="h-3 w-3 mr-1" />
                          )}
                          {tutorial.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{tutorial.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{tutorial.length}</span>
                        <Button variant="ghost" size="sm" className="h-7 p-0">
                          {tutorial.type === "video" ? "Watch" : "Read"}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Get help from our team if you can't find what you need.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" placeholder="your.email@example.com" type="email" />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none" 
                      placeholder="Please describe your issue in detail..."
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                    <select 
                      id="priority"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="low">Low - General question</option>
                      <option value="medium">Medium - Need help soon</option>
                      <option value="high">High - Blocking issue</option>
                      <option value="urgent">Urgent - System down</option>
                    </select>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={() => alert('Support ticket submitted!')}>Submit Support Ticket</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
}
