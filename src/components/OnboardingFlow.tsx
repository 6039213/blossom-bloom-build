
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Step {
  title: string;
  description: string;
  image?: string;
}

export default function OnboardingFlow({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: Step[] = [
    {
      title: "Welcome to Blossom!",
      description: "Let's quickly show you how to create amazing websites with AI.",
      image: "/placeholder.svg"
    },
    {
      title: "Step 1: Describe Your Website",
      description: "Use natural language to tell Blossom what kind of website you want to build.",
      image: "/placeholder.svg"
    },
    {
      title: "Step 2: Review and Edit",
      description: "Our AI generates your website instantly. Preview and make any desired changes.",
      image: "/placeholder.svg"
    },
    {
      title: "Step 3: Publish Your Site",
      description: "With one click, your website is live and ready to share with the world.",
      image: "/placeholder.svg"
    },
    {
      title: "You're All Set!",
      description: "Start creating your first website now or explore templates for inspiration.",
      image: "/placeholder.svg"
    }
  ];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const skipTutorial = () => {
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        
        {steps[currentStep].image && (
          <div className="w-full aspect-video bg-muted rounded-md overflow-hidden">
            <img 
              src={steps[currentStep].image} 
              alt={steps[currentStep].title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2 my-2">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all ${
                index === currentStep 
                  ? 'w-8 bg-blossom-500' 
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button 
            variant="outline"
            size="sm" 
            onClick={skipTutorial}
          >
            Skip Tutorial
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={prevStep}
              >
                Back
              </Button>
            )}
            <Button 
              onClick={nextStep}
              className="bg-blossom-500 hover:bg-blossom-600 text-white"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
