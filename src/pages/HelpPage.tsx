
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search, Mail, MessageSquare, FileText, Video } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create a new project?",
      answer: "To create a new project, navigate to the Dashboard and click the '+ New Project' button. You'll be prompted to enter a project name and description to get started."
    },
    {
      question: "How does the AI website builder work?",
      answer: "Our AI website builder uses advanced AI to generate websites based on your descriptions. Simply navigate to the AI Builder page, describe the website you want, and our AI will generate it for you. You can then customize it further if needed."
    },
    {
      question: "Can I use my own domain?",
      answer: "Yes! Once you're on our Standard plan or higher, you can use custom domains with your websites. Go to your project settings, then 'Domain' tab, and follow the instructions to connect your domain."
    },
    {
      question: "How do I export my website code?",
      answer: "In your project view, click on the 'Code' tab to see the generated code. You can then use the 'Download' button to export the entire codebase as a ZIP file."
    },
    {
      question: "How do I invite team members?",
      answer: "Go to the 'Team' page from the dashboard sidebar, then click the 'Invite Member' button. Enter their email and select their role. They'll receive an invitation to join your team."
    },
    {
      question: "What AI models do you use?",
      answer: "We use Google's Gemini for text generation and various specialized AI models for different aspects of website building, including layout design, content generation, and image creation."
    }
  ];
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Help & Resources</h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Search Section */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4 text-center">
                  <h2 className="text-2xl font-bold">How can we help you?</h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Search our knowledge base or browse the topics below to find the answers you need
                  </p>
                  <div className="max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search help articles..."
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-blossom-500" />
                  </div>
                  <h3 className="font-medium mb-1">Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive guides and API references
                  </p>
                  <Button variant="link" className="mt-auto">View Docs</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center mb-3">
                    <Video className="h-6 w-6 text-blossom-500" />
                  </div>
                  <h3 className="font-medium mb-1">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Step-by-step visual walkthroughs
                  </p>
                  <Button variant="link" className="mt-auto">Watch Videos</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center mb-3">
                    <MessageSquare className="h-6 w-6 text-blossom-500" />
                  </div>
                  <h3 className="font-medium mb-1">Community</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join discussions with other users
                  </p>
                  <Button variant="link" className="mt-auto">Join Forum</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center mb-3">
                    <Mail className="h-6 w-6 text-blossom-500" />
                  </div>
                  <h3 className="font-medium mb-1">Contact Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get help from our support team
                  </p>
                  <Button variant="link" className="mt-auto">Contact Us</Button>
                </CardContent>
              </Card>
            </div>
            
            {/* FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions about our platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            
            {/* Contact Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Still Need Help?</CardTitle>
                <CardDescription>Our support team is ready to assist you</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col items-center text-center p-6 border rounded-lg">
                  <Mail className="h-8 w-8 text-blossom-500 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send us a message and we'll respond within 24 hours
                  </p>
                  <Button>
                    Email Support
                  </Button>
                </div>
                
                <div className="flex-1 flex flex-col items-center text-center p-6 border rounded-lg">
                  <MessageSquare className="h-8 w-8 text-blossom-500 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with our team for real-time assistance
                  </p>
                  <Button>
                    Start Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
