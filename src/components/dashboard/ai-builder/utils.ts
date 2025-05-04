
import { ProjectFiles } from './types';
import { projectTemplates as templates } from '@/utils/projectTemplates';

// Helper to check for TypeScript or React code patterns in files
export const detectProjectType = (files: ProjectFiles): string | null => {
  // Default to React
  let isReact = false;
  let isNext = false;
  let isTypescript = false;
  let isExpress = false;
  let isTailwind = false;
  
  // Check file patterns and content
  for (const path in files) {
    const content = files[path].code || '';
    
    // Check for TypeScript
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      isTypescript = true;
    }
    
    // Check for React
    if (
      path.endsWith('.jsx') || 
      path.endsWith('.tsx') || 
      content.includes('import React') || 
      content.includes('from "react"') ||
      content.includes('from \'react\'')
    ) {
      isReact = true;
    }
    
    // Check for Next.js 
    if (
      path.includes('pages/') || 
      path.includes('app/') || 
      content.includes('next/') ||
      content.includes('import { useRouter }')
    ) {
      isNext = true;
    }
    
    // Check for Express
    if (
      content.includes('const express = require') || 
      content.includes('import express from') ||
      content.includes('app.listen(')
    ) {
      isExpress = true;
    }
    
    // Check for Tailwind
    if (
      path.includes('tailwind') || 
      content.includes('@tailwind') ||
      content.includes('className=')
    ) {
      isTailwind = true;
    }
  }
  
  // Determine the most specific type
  if (isNext) return 'next';
  if (isReact && isTypescript) return 'react-ts';
  if (isReact) return 'react';
  if (isExpress) return 'express';
  if (isTypescript) return 'typescript';
  return 'react'; // Default to React
};

// Get dependencies based on project type
export const getProjectDependencies = (
  files: ProjectFiles, 
  detectedType: string | null,
  templates: Record<string, any>
): Record<string, string> => {
  const baseDeps: Record<string, string> = {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  };
  
  // Add TypeScript if detected
  if (detectedType === 'react-ts' || detectedType === 'typescript' || detectedType === 'next') {
    baseDeps["typescript"] = "^4.9.5";
    baseDeps["@types/react"] = "^18.0.28";
    baseDeps["@types/react-dom"] = "^18.0.11";
  }
  
  // Add Tailwind
  baseDeps["tailwindcss"] = "^3.3.0";
  baseDeps["postcss"] = "^8.4.21";
  baseDeps["autoprefixer"] = "^10.4.14";
  
  // Look for additional dependencies from common imports
  for (const path in files) {
    const content = files[path].code || '';
    const importLines = content.match(/import\s+(?:.*?)\s+from\s+['"]([^./][^'"]*)['"];?/gm);
    
    if (importLines) {
      importLines.forEach(line => {
        const match = line.match(/['"]([^./][^'"]*)['"]/);
        if (match && match[1]) {
          const packageName = match[1].split('/')[0]; // Get base package name
          if (!packageName.startsWith('@types') && !baseDeps[packageName]) {
            baseDeps[packageName] = "latest";
          }
        }
      });
    }
  }
  
  // Include Lucide React icons
  if (!baseDeps["lucide-react"]) {
    baseDeps["lucide-react"] = "^0.244.0";
  }
  
  return baseDeps;
};

// Helper to extract errors from console logs
export const extractErrorInfo = (errorText: string): { message: string; file?: string } => {
  const errorInfo = {
    message: errorText,
  };

  // Try to extract file information from common error patterns
  const fileMatch = errorText.match(/in\s+([^:(\s]+)/i) || 
                   errorText.match(/at\s+([^:(\s]+)/i) ||
                   errorText.match(/([^\/\s]+\.(?:js|jsx|ts|tsx))/i);
                   
  if (fileMatch && fileMatch[1]) {
    return {
      ...errorInfo,
      file: fileMatch[1],
    };
  }

  return errorInfo;
};
