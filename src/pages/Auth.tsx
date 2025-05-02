
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';

export default function Auth() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-primary-600 to-primary-400 p-12">
        <div className="h-full flex flex-col justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold">Welcome to Blossom AI</h1>
            <p className="text-white/80 mt-2 text-lg">
              Build beautiful websites with the power of AI
            </p>
          </div>
          
          <div className="text-white/70">
            <div className="mb-8">
              <h3 className="font-semibold text-white mb-2">Build websites instantly</h3>
              <p>Use AI to generate fully functional websites from simple text prompts</p>
            </div>
            
            <div className="mb-8">
              <h3 className="font-semibold text-white mb-2">Customize with ease</h3>
              <p>Fine-tune your website with an intuitive interface and powerful tools</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Deploy with confidence</h3>
              <p>One-click deployment to get your site online in minutes</p>
            </div>
          </div>
          
          <div className="text-white/80 text-sm">
            © {new Date().getFullYear()} Blossom AI. All rights reserved.
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
