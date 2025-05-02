
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
      
      // ShadCN UI components
      if (content.includes("from '@/components/ui/")) {
        dependencies["class-variance-authority"] = "^0.7.0";
        dependencies["clsx"] = "^2.0.0";
      }
      
      // Zustand
      if (content.includes("from 'zustand'") || content.includes('from "zustand"')) {
        dependencies["zustand"] = "^4.4.1";
      }
      
      // TanStack Query
      if (content.includes("from '@tanstack/react-query'") || content.includes('from "@tanstack/react-query"')) {
        dependencies["@tanstack/react-query"] = "^5.0.0";
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

/**
 * Parse project files from AI response
 */
export function parseProjectFiles(response: string): ProjectFiles {
  const projectFiles: ProjectFiles = {};
  
  // Extract file blocks from markdown code blocks
  const fileBlockRegex = /```(?:tsx?|jsx?|css|scss|html|json|md)?\s*(?:\/\/\s*FILE:\s*([^\n]+))?([^`]*?)```/g;
  let match;
  
  while ((match = fileBlockRegex.exec(response)) !== null) {
    const path = match[1]?.trim();
    const content = match[2]?.trim();
    
    if (path && content) {
      projectFiles[path] = { code: content };
    }
  }
  
  // Also extract files from FILE: format
  const fileHeaderRegex = /\/\/\s*FILE:\s*([^\n]+)\n([\s\S]*?)(?=\/\/\s*FILE:|$)/g;
  while ((match = fileHeaderRegex.exec(response)) !== null) {
    const path = match[1]?.trim();
    const content = match[2]?.trim();
    
    if (path && content) {
      projectFiles[path] = { code: content };
    }
  }
  
  // If no files were found but the response has TSX/JSX code, try to infer a component
  if (Object.keys(projectFiles).length === 0 && (response.includes('export default') || response.includes('React.')) && 
      (response.includes('return') || response.includes('render'))) {
    
    // Try to determine a component name
    const componentNameMatch = response.match(/function\s+([A-Z][a-zA-Z0-9]+)/);
    const componentName = componentNameMatch ? componentNameMatch[1] : 'Component';
    
    // Create a default file with the extracted component
    projectFiles[`src/components/${componentName}.tsx`] = { code: response };
  }
  
  return projectFiles;
}

/**
 * Extract project name from user prompt
 */
export function extractProjectName(prompt: string): string {
  // Simple heuristic to extract a project name
  const words = prompt.split(/\s+/).filter(word => word.length > 3 && !word.match(/^(a|an|the|and|or|but|if|of|at|by|for|with|about)$/i));
  
  if (words.length > 0) {
    // Capitalize first letter
    return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  
  return "MyProject";
}

/**
 * Fix SCSS imports in project files
 */
export function fixScssImports(files: ProjectFiles): ProjectFiles {
  const result = { ...files };
  
  // Look for .scss imports and make sure the files exist
  Object.entries(files).forEach(([path, { code }]) => {
    const scssImports = code.match(/import ['"](.+\.scss)['"]/g);
    
    if (scssImports) {
      scssImports.forEach(importStmt => {
        const importPath = importStmt.match(/import ['"](.+\.scss)['"]/)?.[1];
        if (importPath && !files[importPath]) {
          // Create empty SCSS file if it doesn't exist
          result[importPath] = { code: '// Auto-generated SCSS file' };
        }
      });
    }
  });
  
  return result;
}

/**
 * Ensure all files have the proper imports and references
 */
export function fixImportsAndReferences(files: ProjectFiles): ProjectFiles {
  const result = { ...files };
  
  // Track all component names defined in the files
  const definedComponents = new Map<string, string>();
  
  // First pass: find all component definitions
  Object.entries(files).forEach(([path, { code }]) => {
    // Check for component definitions (export default function ComponentName...)
    const componentMatch = code.match(/export\s+default\s+function\s+([A-Z][a-zA-Z0-9]*)/);
    if (componentMatch) {
      const componentName = componentMatch[1];
      definedComponents.set(componentName, path);
    }
    
    // Check for component definitions with const
    const constComponentMatch = code.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=\s*\(\s*(?:{[^}]*}\s*:.*?)?\s*\)\s*=>/);
    if (constComponentMatch) {
      const componentName = constComponentMatch[1];
      definedComponents.set(componentName, path);
    }
  });
  
  // Second pass: fix missing imports
  Object.entries(files).forEach(([path, { code }]) => {
    // Look for JSX tags that match component names
    definedComponents.forEach((componentPath, componentName) => {
      if (path !== componentPath) {
        // Check if component name is used as a JSX tag
        const jsxTagRegex = new RegExp(`<${componentName}[\\s>/]`, 'g');
        
        if (jsxTagRegex.test(code) && !code.includes(`import ${componentName} from`)) {
          // Calculate relative path
          const relativePath = getRelativeImportPath(path, componentPath);
          
          // Add import statement at the top
          const importStatement = `import ${componentName} from '${relativePath}';\n`;
          result[path] = { code: importStatement + code };
        }
      }
    });
  });
  
  return result;
}

/**
 * Helper function to calculate relative import path
 */
function getRelativeImportPath(fromPath: string, toPath: string): string {
  const fromParts = fromPath.split('/');
  const toParts = toPath.split('/');
  
  // Remove file names
  fromParts.pop();
  const toFileName = toParts.pop() || '';
  
  // Find common path
  let commonParts = 0;
  for (let i = 0; i < Math.min(fromParts.length, toParts.length); i++) {
    if (fromParts[i] === toParts[i]) {
      commonParts++;
    } else {
      break;
    }
  }
  
  // Calculate up-directory traversal
  const upDirs = fromParts.length - commonParts;
  
  // Build relative path
  let relativePath = '';
  
  if (upDirs === 0 && commonParts === 0) {
    relativePath = './';
  } else {
    for (let i = 0; i < upDirs; i++) {
      relativePath += '../';
    }
  }
  
  // Add destination path
  for (let i = commonParts; i < toParts.length; i++) {
    relativePath += toParts[i] + '/';
  }
  
  // Add file name without extension
  relativePath += toFileName.replace(/\.(tsx|jsx|ts|js)$/, '');
  
  return relativePath;
}

/**
 * Find the main file in the project
 */
export function findMainFile(files: ProjectFiles, type: string | null): string {
  // Try to find the main file based on project type
  if (type === 'nextjs') {
    if (files['pages/index.tsx']) return 'pages/index.tsx';
    if (files['pages/index.jsx']) return 'pages/index.jsx';
    if (files['app/page.tsx']) return 'app/page.tsx';
  }
  
  // For React projects
  if (files['src/App.tsx']) return 'src/App.tsx';
  if (files['src/App.jsx']) return 'src/App.jsx';
  if (files['src/app.tsx']) return 'src/app.tsx';
  if (files['src/app.jsx']) return 'src/app.jsx';
  if (files['src/index.tsx']) return 'src/index.tsx';
  if (files['src/index.jsx']) return 'src/index.jsx';
  
  // Default to first .tsx or .jsx file
  const tsxFile = Object.keys(files).find(path => path.endsWith('.tsx'));
  if (tsxFile) return tsxFile;
  
  const jsxFile = Object.keys(files).find(path => path.endsWith('.jsx'));
  if (jsxFile) return jsxFile;
  
  // Return first file as fallback
  return Object.keys(files)[0] || '';
}

/**
 * Ensure required files exist for a template
 */
export function ensureRequiredFilesExist(files: ProjectFiles, template: any): ProjectFiles {
  const result = { ...files };
  
  // Add default files based on template if they don't exist
  if (template && template.requiredFiles) {
    template.requiredFiles.forEach((fileConfig: {path: string, content: string}) => {
      if (!files[fileConfig.path]) {
        result[fileConfig.path] = { code: fileConfig.content };
      }
    });
  }
  
  return result;
}

/**
 * Verify that all template files exist
 */
export function verifyTemplateFilesExist(files: ProjectFiles, template: any): boolean {
  if (!template || !template.requiredFiles) return true;
  
  return template.requiredFiles.every((fileConfig: {path: string}) => 
    Object.keys(files).includes(fileConfig.path)
  );
}
