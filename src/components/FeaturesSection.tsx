
import { Sparkles, Globe, Laptop, Palette, LayoutGrid, PaintBucket, FileCode, Zap } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-blossom-500" />,
      title: "AI-Powered Generation",
      description: "Describe your vision and let our AI create a complete website design in seconds."
    },
    {
      icon: <Palette className="h-6 w-6 text-blossom-500" />,
      title: "Custom Themes",
      description: "Choose from hundreds of professionally designed themes or create your own unique style."
    },
    {
      icon: <LayoutGrid className="h-6 w-6 text-blossom-500" />,
      title: "Drag-and-Drop Editor",
      description: "Easily customize your pages with our intuitive drag-and-drop interface."
    },
    {
      icon: <Laptop className="h-6 w-6 text-blossom-500" />,
      title: "Responsive Design",
      description: "Your website will look great on any device, from mobile phones to desktops."
    },
    {
      icon: <PaintBucket className="h-6 w-6 text-blossom-500" />,
      title: "Visual Customization",
      description: "Adjust colors, fonts, and layouts without writing a single line of code."
    },
    {
      icon: <FileCode className="h-6 w-6 text-blossom-500" />,
      title: "Clean Code Export",
      description: "Export your projects as clean HTML, CSS, and JavaScript for full control."
    },
    {
      icon: <Globe className="h-6 w-6 text-blossom-500" />,
      title: "One-Click Publishing",
      description: "Publish your website to your custom domain with a single click."
    },
    {
      icon: <Zap className="h-6 w-6 text-blossom-500" />,
      title: "Version Control",
      description: "Track changes and revert to previous versions anytime you want."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-blossom-50/50 dark:from-background dark:to-blossom-950/10">
      <div className="container max-w-screen-xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features to Build Your Dream Website
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to create professional websites without any technical skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-blossom-200 dark:border-blossom-800/30 transition-all hover:shadow-blossom hover:-translate-y-1 duration-300"
            >
              <div className="bg-blossom-100 dark:bg-blossom-900/50 p-3 rounded-lg inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
