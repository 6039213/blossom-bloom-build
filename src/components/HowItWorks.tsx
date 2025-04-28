
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  PencilRuler, 
  MonitorSmartphone, 
  Rocket,
  Code
} from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      icon: <PencilRuler className="h-8 w-8" />,
      title: "Describe Your Vision",
      description: "Tell Blossom about your website goals and design preferences. Our AI will understand exactly what you need.",
      image: "/placeholder.svg"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "AI Generates Your Site",
      description: "Watch as our AI creates a complete website based on your description, with optimized code and stunning design.",
      image: "/placeholder.svg"
    },
    {
      icon: <MonitorSmartphone className="h-8 w-8" />,
      title: "Customize Your Design",
      description: "Easily modify and refine any element of your website using our intuitive drag-and-drop editor.",
      image: "/placeholder.svg"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Publish & Share",
      description: "With one click, publish your website to a custom domain and share it with the world.",
      image: "/placeholder.svg"
    }
  ];
  
  return (
    <section className="py-16 md:py-24 bg-blossom-50/50 dark:bg-blossom-950/10">
      <div className="container max-w-screen-xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Blossom Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Create stunning websites in four simple steps, guided by AI
          </p>
        </div>
        
        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Steps Navigation (Left Side) */}
          <div className="md:col-span-5 space-y-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                onClick={() => setActiveStep(index)}
                className={`p-4 md:p-6 rounded-xl cursor-pointer transition-all ${
                  activeStep === index
                    ? 'bg-white dark:bg-gray-800 shadow-blossom border border-blossom-200 dark:border-blossom-800/30'
                    : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`p-2 rounded-lg ${
                    activeStep === index 
                      ? 'bg-blossom-100 dark:bg-blossom-900/50 text-blossom-600 dark:text-blossom-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium text-lg ${
                      activeStep === index ? 'text-blossom-600 dark:text-blossom-400' : ''
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      activeStep === index ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-8 md:hidden">
              <Button
                onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                className="w-full bg-blossom-500 hover:bg-blossom-600 text-white"
              >
                Next Step
              </Button>
            </div>
          </div>
          
          {/* Visual Representation (Right Side) */}
          <div className="md:col-span-7">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 relative overflow-hidden border border-blossom-200 dark:border-blossom-800/30 shadow-blossom">
              {/* Steps progress indicator */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-gray-700">
                <div 
                  className="h-full bg-blossom-500 transition-all duration-300" 
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} 
                />
              </div>
              
              <div className="mt-4 rounded-lg overflow-hidden aspect-video relative">
                <img
                  src={steps[activeStep].image}
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover"
                />
                
                {/* Placeholder overlay for demo */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blossom-500/20 to-blossom-700/20 dark:from-blossom-500/10 dark:to-blossom-700/10">
                  <div className="text-center p-8 backdrop-blur-sm rounded-lg">
                    <div className="p-3 bg-blossom-100 dark:bg-blossom-900/50 rounded-full inline-flex mb-4 text-blossom-600 dark:text-blossom-400">
                      {steps[activeStep].icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{steps[activeStep].title}</h3>
                    <p className="text-sm text-muted-foreground">{steps[activeStep].description}</p>
                    <Button className="mt-4 bg-blossom-500 hover:bg-blossom-600 text-white">
                      Try it now
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Navigation dots for mobile */}
              <div className="flex justify-center gap-2 mt-4">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeStep === index 
                        ? 'bg-blossom-500 w-6' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
