
import { getSelectedModel } from "@/lib/llm/modelSelection";

interface CodeGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  enhancePrompt?: boolean;
}

interface CodeGenerationResult {
  files: Record<string, string>;
  message?: string;
  error?: string;
}

// Enhanced prompt templates for different project types
const PROMPT_TEMPLATES = {
  default: `
Create a complete React application with TypeScript and Tailwind CSS based on this description:
"{prompt}"

REQUIREMENTS:
1. Use TypeScript (.tsx) for all React components
2. Use Tailwind CSS for all styling
3. Create reusable, well-structured components
4. Follow React best practices
5. Add comments explaining complex logic
6. Create a responsive design
7. All code must be production-ready
8. Add realistic placeholder content

FORMAT ALL FILES PROPERLY:
\`\`\`tsx src/components/ComponentName.tsx
// Full component code here
\`\`\`

Make sure to include ALL necessary files including:
- Main App.tsx
- Component files
- Utility files if needed
- Type definitions
- CSS modules if needed (though inline Tailwind is preferred)
`,

  landingPage: `
Create a professional landing page using React, TypeScript and Tailwind CSS based on this description:
"{prompt}"

REQUIREMENTS:
1. Use TypeScript (.tsx) for all React components
2. Use Tailwind CSS for all styling with a cohesive color scheme
3. Create sections including: Hero, Features, Testimonials, Pricing, CTA, and Footer
4. Follow modern landing page design principles with attention to conversion
5. Make it fully responsive for mobile, tablet and desktop
6. Add animations for improved user experience (subtle and professional)
7. Include navigation and proper scroll behavior
8. Add realistic placeholder content and images

FORMAT ALL FILES PROPERLY:
\`\`\`tsx src/components/ComponentName.tsx
// Full component code here
\`\`\`

Make sure to include ALL necessary files for a complete landing page.
`,

  dashboard: `
Create a professional admin dashboard using React, TypeScript, and Tailwind CSS based on this description:
"{prompt}"

REQUIREMENTS:
1. Use TypeScript (.tsx) for all React components
2. Use Tailwind CSS for all styling
3. Create components for: Sidebar, Header, Main Content Area, Charts/Graphs, Tables, and Cards
4. Make it fully responsive for mobile, tablet and desktop
5. Include dark/light mode toggle
6. Add realistic data visualization with charts (using recharts library)
7. Create multiple dashboard views/pages
8. Include mock API data and loading states
9. Implement proper navigation between dashboard sections

FORMAT ALL FILES PROPERLY:
\`\`\`tsx src/components/ComponentName.tsx
// Full component code here
\`\`\`

Make sure to include ALL necessary files for a complete dashboard.
`,
};

// Helper function to detect code blocks of different formats in the response
export const extractCodeBlocks = (response: string): Record<string, string> => {
  const codeBlocks: Record<string, string> = {};
  
  // Try multiple formats of code blocks
  const formats = [
    // Format: ```tsx src/components/Button.tsx
    {
      regex: /```(?:typescript|tsx|jsx|ts|js|html|css)(?: ([^\n]+))?\n([\s\S]*?)```/g,
      fileNameIndex: 1,
      codeIndex: 2
    },
    // Format: // FILE: src/components/Button.tsx
    {
      regex: /\/\/\s*FILE:\s*([^\n]+)\n([\s\S]*?)(?=\/\/\s*FILE:|$)/g,
      fileNameIndex: 1,
      codeIndex: 2
    },
    // Format: /* FILE: src/components/Button.tsx */
    {
      regex: /\/\*\s*FILE:\s*([^\n]+)\s*\*\/\n([\s\S]*?)(?=\/\*\s*FILE:|$)/g,
      fileNameIndex: 1,
      codeIndex: 2
    }
  ];
  
  // Try each format
  for (const format of formats) {
    let match;
    while ((match = format.regex.exec(response)) !== null) {
      const fileName = match[format.fileNameIndex]?.trim();
      let codeContent = match[format.codeIndex]?.trim();
      
      if (fileName && codeContent) {
        // Clean up the code content (remove extra backticks)
        if (codeContent.startsWith('```') && codeContent.endsWith('```')) {
          codeContent = codeContent.substring(3, codeContent.length - 3).trim();
        }
        
        codeBlocks[fileName] = codeContent;
      }
    }
  }
  
  return codeBlocks;
};

// Detect the type of project from the prompt
const detectProjectType = (prompt: string): 'landingPage' | 'dashboard' | 'default' => {
  prompt = prompt.toLowerCase();
  
  if (prompt.includes('landing page') || 
      prompt.includes('homepage') || 
      prompt.includes('marketing site')) {
    return 'landingPage';
  }
  
  if (prompt.includes('dashboard') || 
      prompt.includes('admin panel') || 
      prompt.includes('analytics') ||
      prompt.includes('control panel')) {
    return 'dashboard';
  }
  
  return 'default';
};

// Enhance user prompt based on the detected project type
const enhancePrompt = (prompt: string, options: CodeGenerationOptions = {}): string => {
  if (!options.enhancePrompt) return prompt;
  
  const projectType = detectProjectType(prompt);
  const template = PROMPT_TEMPLATES[projectType];
  
  return template.replace('{prompt}', prompt);
};

// Generate code from a prompt
export const generateCode = async (
  prompt: string, 
  options: CodeGenerationOptions = {}
): Promise<CodeGenerationResult> => {
  try {
    // Get the Claude 3.7 Sonnet model
    const model = getSelectedModel();
    
    if (!model) {
      throw new Error("No AI model available");
    }
    
    // Enhance the prompt if needed
    const enhancedPrompt = enhancePrompt(prompt, {
      enhancePrompt: options.enhancePrompt !== false
    });
    
    let fullResponse = '';
    
    // Generate code from the model
    await model.generateStream(
      enhancedPrompt,
      (token: string) => {
        fullResponse += token;
      },
      {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 4000
      }
    );
    
    // Extract code blocks from the response
    const codeBlocks = extractCodeBlocks(fullResponse);
    
    // If no code blocks were found, return an error
    if (Object.keys(codeBlocks).length === 0) {
      return {
        files: {},
        error: "No code blocks found in the response. Please try again with a more specific prompt."
      };
    }
    
    return {
      files: codeBlocks,
      message: `Successfully generated ${Object.keys(codeBlocks).length} files.`
    };
  } catch (error) {
    console.error("Error generating code:", error);
    return {
      files: {},
      error: error instanceof Error ? error.message : "Unknown error generating code"
    };
  }
};

export default {
  generateCode,
  extractCodeBlocks,
  detectProjectType,
  enhancePrompt
};
