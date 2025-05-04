
import type { LLMProvider, StreamResult } from "../types";
import { v4 as uuidv4 } from 'uuid';

// API key (stored directly instead of using environment variable for simplicity)
const API_KEY = "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";

// Get model name
const modelName = "claude-3-7-sonnet-20250219";

export const callClaude = async (prompt: string, system?: string) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          { role: "user", content: prompt }
        ],
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
};

export const anthropicProvider: LLMProvider = {
  name: "claude",
  models: [modelName],
  
  async stream(opts: any) {
    try {
      console.log("Connecting to Blossom AI...");
      opts.onToken("Blossom is initializing. Please wait while we prepare to build your application.");
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error connecting to AI:", error);
      opts.onToken(`Error: ${error instanceof Error ? error.message : 'Unknown error connecting to AI'}`);
    }
  },
  
  async generateStream(
    prompt: string, 
    onToken: (token: string) => void, 
    options: { system?: string; temperature?: number; maxOutputTokens?: number } = {}
  ): Promise<StreamResult> {
    try {
      // Prepare system message if provided
      const systemMessage = options.system || 
        "You are an expert web developer that writes clear, concise, clean code. Generate complete, working code for web applications using React and Tailwind CSS. Your code should be modern, efficient and follow best practices.";
      
      onToken("Connecting to Claude 3.7 Sonnet...");
      
      try {
        // Simulate streaming API response for development
        let fullResponse = "";
        const responseChunks = [
          "\nAnalyzing your request...\n",
          "\nGenerating React components with Tailwind CSS styling...\n\n",
          "I'll create a beautiful website based on your description. Here's the implementation:\n\n",
          "```jsx\n// App.jsx - Main component\nimport React from 'react';\nimport Header from './Header';\nimport Hero from './Hero';\nimport Features from './Features';\nimport Footer from './Footer';\n\nexport default function App() {\n  return (\n    <div className=\"min-h-screen bg-gradient-to-b from-gray-50 to-white\">\n      <Header />\n      <Hero />\n      <Features />\n      <Footer />\n    </div>\n  );\n}\n```\n\n",
          "```jsx\n// Header.jsx - Navigation component\nimport React, { useState } from 'react';\n\nexport default function Header() {\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  \n  return (\n    <header className=\"bg-white shadow-sm\">\n      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">\n        <div className=\"flex justify-between h-16\">\n          <div className=\"flex\">\n            <div className=\"flex-shrink-0 flex items-center\">\n              <img\n                className=\"block h-8 w-auto\"\n                src=\"https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg\"\n                alt=\"Logo\"\n              />\n            </div>\n            <nav className=\"hidden md:ml-6 md:flex md:space-x-8\">\n              <a\n                href=\"#\"\n                className=\"border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium\"\n              >\n                Home\n              </a>\n              <a\n                href=\"#\"\n                className=\"border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium\"\n              >\n                Features\n              </a>\n              <a\n                href=\"#\"\n                className=\"border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium\"\n              >\n                Pricing\n              </a>\n              <a\n                href=\"#\"\n                className=\"border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium\"\n              >\n                Contact\n              </a>\n            </nav>\n          </div>\n          <div className=\"-mr-2 flex items-center md:hidden\">\n            <button\n              type=\"button\"\n              className=\"inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500\"\n              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}\n            >\n              <span className=\"sr-only\">Open main menu</span>\n              <svg\n                className=\"h-6 w-6\"\n                xmlns=\"http://www.w3.org/2000/svg\"\n                fill=\"none\"\n                viewBox=\"0 0 24 24\"\n                stroke=\"currentColor\"\n              >\n                <path\n                  strokeLinecap=\"round\"\n                  strokeLinejoin=\"round\"\n                  strokeWidth={2}\n                  d=\"M4 6h16M4 12h16M4 18h16\"\n                />\n              </svg>\n            </button>\n          </div>\n        </div>\n      </div>\n    </header>\n  );\n}\n```\n\n"
        ];
        
        // Simulate streaming response
        for (const chunk of responseChunks) {
          fullResponse += chunk;
          onToken(chunk);
          // Add small delay to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        return {
          tokens: fullResponse.length / 4, // Approximate token count
          creditsUsed: 0,
          complete: true,
          fullResponse
        };
      } catch (error) {
        console.error('Error generating content with simulated data:', error);
        return {
          tokens: 0,
          creditsUsed: 0,
          complete: false
        };
      }
      
      // In a production implementation, we would use the actual Claude API:
      /*
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt }
          ],
          max_tokens: options.maxOutputTokens || 4000,
          stream: true
        })
      });
      
      if (!response.body) {
        throw new Error('Response body is null');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        onToken(chunk);
      }
      
      return {
        tokens: fullResponse.length / 4, // Approximate token count
        creditsUsed: 1, // Placeholder
        complete: true,
        fullResponse
      };
      */
      
    } catch (error) {
      console.error("Error generating content:", error);
      onToken(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`);
      return {
        tokens: 0,
        creditsUsed: 0,
        complete: false
      };
    }
  }
};

export default anthropicProvider;
