
import { ProjectFiles } from './types';

/**
 * Extract dependencies from project files
 */
export function getProjectDependencies(
  files: ProjectFiles, 
  detectedType: string | null,
  templates: any
): Record<string, string> {
  // Base dependencies for React + Tailwind
  const dependencies: Record<string, string> = {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  };
  
  // Check for import statements in the files to determine additional dependencies
  Object.values(files).forEach(file => {
    const content = file.code;
    
    // Check for common libraries
    if (content.includes('import') && content.includes('from')) {
      // React Router
      if (content.includes("from 'react-router-dom'") || content.includes('from "react-router-dom"')) {
        dependencies["react-router-dom"] = "^6.16.0";
      }
      
      // Framer Motion
      if (content.includes("from 'framer-motion'") || content.includes('from "framer-motion"')) {
        dependencies["framer-motion"] = "^10.16.4";
      }
      
      // Lucide React Icons
      if (content.includes("from 'lucide-react'") || content.includes('from "lucide-react"')) {
        dependencies["lucide-react"] = "^0.276.0";
      }
      
      // React Hook Form
      if (content.includes("from 'react-hook-form'") || content.includes('from "react-hook-form"')) {
        dependencies["react-hook-form"] = "^7.46.1";
      }
    }
  });
  
  // Add template-specific dependencies
  if (detectedType && templates[detectedType] && templates[detectedType].dependencies) {
    Object.entries(templates[detectedType].dependencies).forEach(([key, value]) => {
      dependencies[key] = value as string;
    });
  }
  
  return dependencies;
}

/**
 * Detect project type based on files and structure
 */
export function detectProjectType(files: ProjectFiles): string | null {
  // Check for Next.js specific files
  if (files['next.config.js'] || files['next.config.ts']) {
    return 'nextjs';
  }
  
  // Check for React/Vite specific files
  if (files['vite.config.ts'] || files['vite.config.js']) {
    return 'react-vite';
  }
  
  // Default to basic React
  return 'react';
}
