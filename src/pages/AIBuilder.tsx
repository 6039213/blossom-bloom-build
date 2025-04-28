
import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AIPromptInput from '@/components/dashboard/AIPromptInput';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GEMINI_API_KEY } from '@/lib/constants';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Download,
  Copy,
  Code,
  Eye,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function AIBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  
  const handlePromptSubmit = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // Here you would call the Gemini API
      // For now, we're just simulating a response
      
      // Simulated API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate placeholder HTML
      const mockHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Generated Website</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #f1e5c4, #fff9e6);
      color: #222;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    header {
      background: linear-gradient(to right, #d89305, #f9ca54);
      color: white;
      padding: 20px 0;
      box-shadow: 0 2px 10px rgba(216, 147, 5, 0.3);
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .logo img {
      width: 40px;
      height: 40px;
    }
    
    .logo span {
      font-weight: bold;
      font-size: 24px;
    }
    
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    nav ul {
      display: flex;
      list-style: none;
      gap: 20px;
    }
    
    nav a {
      color: white;
      text-decoration: none;
      font-weight: 500;
    }
    
    .hero {
      padding: 80px 0;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 48px;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #d89305, #f9ca54);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero p {
      font-size: 18px;
      color: #666;
      max-width: 700px;
      margin: 0 auto 30px;
      line-height: 1.6;
    }
    
    .cta {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(to right, #d89305, #f9ca54);
      color: white;
      text-decoration: none;
      border-radius: 30px;
      font-weight: bold;
      box-shadow: 0 4px 10px rgba(216, 147, 5, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(216, 147, 5, 0.4);
    }
    
    .features {
      padding: 60px 0;
      background: white;
    }
    
    .features h2 {
      text-align: center;
      font-size: 32px;
      margin-bottom: 40px;
      color: #d89305;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    
    .feature {
      padding: 30px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      transition: transform 0.2s;
    }
    
    .feature:hover {
      transform: translateY(-5px);
    }
    
    .feature-icon {
      width: 50px;
      height: 50px;
      background: #fff2d9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d89305;
      margin-bottom: 20px;
    }
    
    .feature h3 {
      margin-top: 0;
      color: #222;
    }
    
    .feature p {
      color: #666;
      line-height: 1.5;
    }
    
    footer {
      background: #333;
      color: white;
      padding: 40px 0;
      text-align: center;
    }
    
    footer .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .social-links {
      display: flex;
      gap: 15px;
    }
    
    .social-links a {
      color: white;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <nav>
        <div class="logo">
          <img src="https://via.placeholder.com/40" alt="Logo">
          <span>Gold Blossom</span>
        </div>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <section class="hero">
    <div class="container">
      <h1>Transform Your Digital Presence</h1>
      <p>Create stunning websites effortlessly with our AI-powered platform. Describe what you want, and watch as we bring your vision to life.</p>
      <a href="#" class="cta">Get Started — It's Free</a>
    </div>
  </section>
  
  <section class="features">
    <div class="container">
      <h2>Amazing Features</h2>
      <div class="feature-grid">
        <div class="feature">
          <div class="feature-icon">✨</div>
          <h3>AI Generation</h3>
          <p>Create custom websites by simply describing what you want - no technical skills required.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🎨</div>
          <h3>Beautiful Design</h3>
          <p>Professional designs and templates that adapt perfectly to any device or screen size.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🚀</div>
          <h3>Instant Deployment</h3>
          <p>Publish your website instantly with a single click and share it with the world.</p>
        </div>
      </div>
    </div>
  </section>
  
  <footer>
    <div class="container">
      <p>&copy; 2025 Gold Blossom. All rights reserved.</p>
      <div class="social-links">
        <a href="#">Twitter</a>
        <a href="#">Facebook</a>
        <a href="#">Instagram</a>
      </div>
    </div>
  </footer>
</body>
</html>
      `;
      
      // Set the generated code and preview HTML
      setGeneratedCode(mockHtml);
      setPreviewHtml(mockHtml);
      
      // Show success toast
      toast.success("Website generated successfully!");
      
      // Switch to preview tab
      setActiveTab('preview');
      
    } catch (error) {
      console.error("Error generating website:", error);
      toast.error("Failed to generate website. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard");
  };
  
  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded successfully");
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AI Website Builder</h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden grid grid-rows-[auto_1fr]">
          <div className="p-6 bg-white dark:bg-gray-900 border-b border-border">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blossom-500" />
                Tell us about your website
              </h2>
              <AIPromptInput 
                onSubmit={handlePromptSubmit} 
                isProcessing={isGenerating}
              />
            </div>
          </div>
          
          <div className="overflow-hidden p-6">
            {!generatedCode ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-8 w-8 text-blossom-500" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Let's Create Something Amazing</h3>
                  <p className="text-muted-foreground mb-6">
                    Type a description of the website you want to build and our AI will generate it for you.
                  </p>
                  <ul className="text-left space-y-2 bg-muted p-4 rounded-lg text-sm">
                    <li className="flex items-start">
                      <span className="bg-blossom-100 dark:bg-blossom-900/30 p-1 rounded text-blossom-700 dark:text-blossom-300 mr-2">Tip</span>
                      <span>Be specific about your website's purpose, style, and content.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blossom-100 dark:bg-blossom-900/30 p-1 rounded text-blossom-700 dark:text-blossom-300 mr-2">Tip</span>
                      <span>Mention color schemes or specific design elements you'd like to include.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blossom-100 dark:bg-blossom-900/30 p-1 rounded text-blossom-700 dark:text-blossom-300 mr-2">Tip</span>
                      <span>You can always regenerate if you're not satisfied with the results.</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <Tabs 
                    value={activeTab} 
                    onValueChange={setActiveTab} 
                    className="w-full"
                  >
                    <TabsList>
                      <TabsTrigger value="preview" className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="code" className="flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Code
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex-1" />
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCopyCode}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDownloadCode}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setGeneratedCode('')}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </Tabs>
                </div>
                
                <div className="flex-1 overflow-hidden border border-border rounded-lg">
                  <TabsContent value="preview" className="h-full m-0">
                    <iframe 
                      srcDoc={previewHtml}
                      title="Website Preview"
                      className="w-full h-full border-0"
                    />
                  </TabsContent>
                  <TabsContent value="code" className="h-full m-0 overflow-auto">
                    <pre className="h-full p-4 text-sm bg-gray-50 dark:bg-gray-950 overflow-auto">
                      <code>{generatedCode}</code>
                    </pre>
                  </TabsContent>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
