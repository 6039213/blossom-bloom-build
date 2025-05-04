
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, MessageCircle, Video, Share2, FileText, ArrowRight, Mail } from 'lucide-react';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100
    }
  }
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('faqs');
  
  const handleSearch = (e) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
  };
  
  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you shortly.");
    // Reset form fields
    e.target.reset();
  };
  
  // FAQ data
  const faqs = [
    {
      id: "1",
      question: "How do I create a new project?",
      answer: "To create a new project, go to your dashboard and click on the 'New Project' button. Follow the prompts to name your project and select a template or start from scratch."
    },
    {
      id: "2",
      question: "How does the AI Builder work?",
      answer: "The AI Builder uses advanced AI to generate website code based on your text description. Simply describe what you want, and our AI will create a functional website for you to customize further."
    },
    {
      id: "3",
      question: "Can I collaborate with my team?",
      answer: "Yes! You can invite team members to collaborate on your projects. Go to the Team page from your dashboard and use the 'Invite Member' button to add collaborators."
    },
    {
      id: "4",
      question: "How do I publish my website?",
      answer: "When your project is ready, click the 'Publish' button in the project editor. You can publish to our hosting platform with one click, or export your code to deploy elsewhere."
    },
    {
      id: "5",
      question: "Can I use custom domains?",
      answer: "Yes! On paid plans, you can connect your custom domain. Go to your project settings and follow the instructions in the 'Domain' section to set up your domain."
    },
    {
      id: "6",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and certain regional payment methods. All payments are securely processed through our payment providers."
    }
  ];
  
  // Filtered FAQs based on search
  const filteredFaqs = searchQuery.trim() === '' 
    ? faqs 
    : faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  return (
    <Layout>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">Help Center</h1>
          <p className="text-muted-foreground mt-1">Find answers and support for using our platform</p>
        </motion.div>
        
        {/* Search */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900 border-blue-100 dark:border-blue-950/40">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex w-full max-w-2xl mx-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for help articles..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-400 pr-4 py-2"
                  />
                </div>
                <Button type="submit" className="ml-2">
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="faqs" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">FAQs</span>
              </TabsTrigger>
              <TabsTrigger value="documentation" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documentation</span>
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Tutorials</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Contact Support</span>
              </TabsTrigger>
            </TabsList>

            {/* FAQs Content */}
            <TabsContent value="faqs">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find quick answers to common questions about our platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredFaqs.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {filteredFaqs.map((faq) => (
                          <AccordionItem value={faq.id} key={faq.id}>
                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground">{faq.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No FAQs matching your search. Try a different query or browse our documentation.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Still need help?</CardTitle>
                    <CardDescription>Reach out to our support team for personalized assistance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Button onClick={() => setActiveTab('contact')}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Join Community
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Documentation Content */}
            <TabsContent value="documentation">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>Comprehensive guides and references for our platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Getting Started Guide</h3>
                        <Badge variant="outline">Beginner</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">Learn the basics of our platform and create your first project</p>
                      <Button variant="link" size="sm" className="p-0">
                        Read Guide
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">AI Builder Documentation</h3>
                        <Badge variant="outline">Intermediate</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">Deep dive into the AI Builder functionality and features</p>
                      <Button variant="link" size="sm" className="p-0">
                        Read Guide
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Team Collaboration</h3>
                        <Badge variant="outline">Intermediate</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">Learn how to collaborate effectively with your team</p>
                      <Button variant="link" size="sm" className="p-0">
                        Read Guide
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">API Reference</h3>
                        <Badge variant="outline">Advanced</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">Technical documentation for our API integrations</p>
                      <Button variant="link" size="sm" className="p-0">
                        Read Guide
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tutorials Content */}
            <TabsContent value="tutorials">
              <Card>
                <CardHeader>
                  <CardTitle>Video Tutorials</CardTitle>
                  <CardDescription>Learn how to use our platform through step-by-step video guides</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="white"/>
                            </svg>
                          </div>
                        </div>
                        <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=500" alt="Getting Started Tutorial" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-2">Getting Started with the Dashboard</h3>
                        <p className="text-sm text-muted-foreground">Learn how to navigate the dashboard and create your first project</p>
                        <div className="flex justify-between items-center mt-4">
                          <Badge variant="secondary">5:32</Badge>
                          <Button variant="link" className="p-0">Watch Now</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="white"/>
                            </svg>
                          </div>
                        </div>
                        <img src="https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=500" alt="AI Builder Tutorial" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-2">Building with AI</h3>
                        <p className="text-sm text-muted-foreground">Master the AI Builder to create amazing websites with just text prompts</p>
                        <div className="flex justify-between items-center mt-4">
                          <Badge variant="secondary">8:17</Badge>
                          <Button variant="link" className="p-0">Watch Now</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Support Content */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>Get in touch with our customer support team for personalized help</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                        <Input id="name" name="name" placeholder="Your name" required />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <Input id="email" name="email" type="email" placeholder="Your email" required />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                      <Input id="subject" name="subject" placeholder="What's your query about?" required />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        id="message" 
                        name="message"
                        rows={4}
                        className="w-full border border-input rounded-md px-3 py-2 resize-y"
                        placeholder="Describe your issue in detail..."
                        required
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
                      <Button type="submit">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle>Other Ways to Get Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                        <Share2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-medium mb-2">Community Forum</h3>
                      <p className="text-sm text-muted-foreground mb-3">Ask questions and share knowledge with other users</p>
                      <Button variant="link" className="text-blue-600">Visit Forum</Button>
                    </div>
                    
                    <div className="border rounded-md p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-medium mb-2">Live Chat</h3>
                      <p className="text-sm text-muted-foreground mb-3">Chat with our support team during business hours</p>
                      <Button variant="link" className="text-blue-600">Start Chat</Button>
                    </div>
                    
                    <div className="border rounded-md p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-medium mb-2">Knowledge Base</h3>
                      <p className="text-sm text-muted-foreground mb-3">Browse our extensive help articles collection</p>
                      <Button variant="link" className="text-blue-600">Browse Articles</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
