
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, Book, MessageSquare, FileCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border rounded-lg mb-3">
      <button
        className="flex items-center justify-between w-full p-4 text-left font-medium focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "How do I create a new project?",
      answer: "To create a new project, go to the Dashboard and click on the 'New Project' button. Follow the prompts to select a template or start from scratch. Fill in the project details and click 'Create' to get started."
    },
    {
      question: "How do I invite team members?",
      answer: "To invite team members, navigate to the Team page from the sidebar. Click on the 'Invite Member' button, enter their email address and select their role. They will receive an email invitation to join your project."
    },
    {
      question: "How do I use the AI Website Builder?",
      answer: "The AI Website Builder allows you to create websites using AI. Simply navigate to the AI Builder page, enter a detailed description of the website you want to create, and click 'Generate Website'. The AI will create a complete website based on your description."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support payments via PayPal and bank transfers for enterprise customers."
    },
    {
      question: "How do I export my project?",
      answer: "To export your project, open your project and click on the 'Export' button in the top right corner. Choose your preferred export format (HTML/CSS, React components, etc.) and click 'Download' to save your project."
    }
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Help Center</h1>
          <p className="text-muted-foreground mt-1">Find answers, tutorials, and support</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for help articles, tutorials, and FAQs..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-2"
          >
            <Tabs defaultValue="articles">
              <TabsList className="mb-4">
                <TabsTrigger value="articles">
                  <Book className="h-4 w-4 mr-2" />
                  Help Articles
                </TabsTrigger>
                <TabsTrigger value="faq">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="tutorials">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Tutorials
                </TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Getting Started</CardTitle>
                      <CardDescription>Learn the basics and set up your first project</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Introduction to the platform</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Creating your first project</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Navigating the dashboard</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Understanding the AI builder</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Account Management</CardTitle>
                      <CardDescription>Manage your account settings and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Updating your profile</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Managing notification settings</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Changing your password</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Subscription management</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">AI Website Builder</CardTitle>
                      <CardDescription>Learn how to use AI to create websites</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Writing effective prompts</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Customizing generated websites</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Exporting your AI creations</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Best practices for AI generation</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Team Collaboration</CardTitle>
                      <CardDescription>Work together with your team effectively</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Inviting team members</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Setting up roles and permissions</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Sharing projects</li>
                        <li className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Collaboration best practices</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center">
                  <Button variant="outline" className="mt-4">
                    View All Help Articles
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="faq" className="space-y-4">
                <div className="bg-muted/30 p-6 rounded-lg mb-6">
                  <h2 className="text-xl font-medium mb-2">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">
                    Find quick answers to common questions about our platform
                  </p>
                </div>
                
                {faqs.map((faq, index) => (
                  <Accordion key={index} title={faq.question}>
                    <p>{faq.answer}</p>
                  </Accordion>
                ))}
                
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Don't see your question? Contact support for help.</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Contact Support
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tutorials" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-md mb-2 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                      </div>
                      <CardTitle className="text-lg">Getting Started Tutorial</CardTitle>
                      <CardDescription>5 min • Beginner</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-md mb-2 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                      </div>
                      <CardTitle className="text-lg">AI Website Builder Mastery</CardTitle>
                      <CardDescription>12 min • Intermediate</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-md mb-2 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                      </div>
                      <CardTitle className="text-lg">Team Collaboration</CardTitle>
                      <CardDescription>8 min • Beginner</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-md mb-2 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                      </div>
                      <CardTitle className="text-lg">Advanced Customization</CardTitle>
                      <CardDescription>15 min • Advanced</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                
                <div className="text-center">
                  <Button variant="outline" className="mt-4">
                    View All Tutorials
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1"
          >
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>Get help from our support team</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    Our support team is available 24/7 to help you with any questions or issues.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Start a Conversation
                  </Button>
                </CardContent>
              </Card>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Popular Articles</h3>
                </div>
                <div className="divide-y">
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">How to use the AI Website Builder</h4>
                      <Badge variant="outline" className="text-xs">Popular</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Learn how to create websites using AI...</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer">
                    <h4 className="text-sm font-medium">Setting up your team workspace</h4>
                    <p className="text-xs text-muted-foreground mt-1">Create a collaborative environment...</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer">
                    <h4 className="text-sm font-medium">Exporting and deploying your website</h4>
                    <p className="text-xs text-muted-foreground mt-1">Learn how to publish your website...</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer">
                    <h4 className="text-sm font-medium">Managing your subscription</h4>
                    <p className="text-xs text-muted-foreground mt-1">Change, upgrade, or cancel your plan...</p>
                  </div>
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Support Hours</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">9 AM - 8 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">10 AM - 6 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium">12 PM - 6 PM EST</span>
                  </div>
                  <div className="pt-2 text-xs text-muted-foreground">
                    * Emergency support available 24/7 for enterprise plans
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}
