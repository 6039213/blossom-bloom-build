
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Key } from 'lucide-react';

interface ApiKeySetupPromptProps {
  onContinue: () => void;
}

const ApiKeySetupPrompt: React.FC<ApiKeySetupPromptProps> = ({ onContinue }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Key className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <CardTitle className="text-center">API Key Required</CardTitle>
        <CardDescription className="text-center">
          To use the AI Website Builder, you need to set up an API key
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <p className="mb-4">
          You'll need an API key from one of the following services:
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>
            <a 
              href="https://www.anthropic.com/product" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-400 hover:underline"
            >
              Anthropic Claude
            </a>
          </li>
          <li>
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-400 hover:underline"
            >
              OpenAI
            </a>
          </li>
        </ul>
        <p>
          Your API key will be used only for generating website code and is never shared with third parties.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
        <Button 
          className="bg-amber-600 hover:bg-amber-700"
          onClick={onContinue}
        >
          Set Up API Key
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeySetupPrompt;
