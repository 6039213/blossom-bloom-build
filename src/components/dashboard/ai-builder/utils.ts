
import { ProjectFile, ProjectFiles, ProjectTemplate } from './types';

export const defaultScssVariables = `
$primary-color: #f59e0b;
$secondary-color: #3b82f6;
$text-color: #374151;
$background-color: #ffffff;
$accent-color: #10b981;
$font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
$border-radius: 0.375rem;
$box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
$transition-duration: 0.15s;
`;

export const fixScssImports = (files: ProjectFiles): ProjectFiles => {
  const updatedFiles = { ...files };
  
  if (!Object.keys(updatedFiles).some(path => path.includes('variables.scss'))) {
    updatedFiles['/src/styles/variables.scss'] = { code: defaultScssVariables };
  }

  Object.keys(updatedFiles).forEach(filePath => {
    if (filePath.endsWith('.scss') || filePath.endsWith('.sass')) {
      if (!filePath.includes('variables.scss')) {
        const fileContent = updatedFiles[filePath].code;
        
        if (!fileContent.includes('@import') || !fileContent.includes('variables.scss')) {
          const pathSegments = filePath.split('/').filter(Boolean);
          pathSegments.pop();
          
          let relativePath = '';
          for (let i = 0; i < pathSegments.length - 1; i++) {
            if (pathSegments[i] !== 'styles') {
              relativePath += '../';
            }
          }
          
          updatedFiles[filePath] = { 
            code: `@import '${relativePath}styles/variables.scss';\n\n${fileContent}`
          };
        }
      }
    }
  });
  
  return updatedFiles;
};

export const verifyTemplateFilesExist = (files: ProjectFiles, template: ProjectTemplate | null): boolean => {
  if (!template) return true;
  
  const missingFiles: string[] = [];
  
  template.fileStructure.forEach(file => {
    if (!files[file]) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.warn('Missing required template files:', missingFiles);
    return false;
  }
  
  return true;
};

export const ensureRequiredFilesExist = (files: ProjectFiles, template: ProjectTemplate | null): ProjectFiles => {
  if (!template) return files;
  
  const updatedFiles = { ...files };
  
  template.fileStructure.forEach(file => {
    if (!updatedFiles[file]) {
      if (template.boilerplateCode && template.boilerplateCode[file]) {
        updatedFiles[file] = { code: template.boilerplateCode[file] };
      } else {
        const componentName = file.split('/').pop()?.replace('.tsx', '') || 'Component';
        updatedFiles[file] = { 
          code: `import React from 'react';
          
export default function ${componentName}() {
  return (
    <div>
      <h1>${componentName}</h1>
      <p>This is the ${componentName} component.</p>
    </div>
  );
}` 
        };
      }
      console.log(`Added missing template file: ${file}`);
    }
  });
  
  if (!updatedFiles['/src/App.tsx']) {
    updatedFiles['/src/App.tsx'] = {
      code: `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}`
    };
  }
  
  return updatedFiles;
};

export const findMainFile = (files: ProjectFiles, type: string | null): string => {
  const fileKeys = Object.keys(files);
  
  if (type) {
    const typeSpecificFiles = fileKeys.filter(path => {
      const lowercasePath = path.toLowerCase();
      return lowercasePath.includes(`/${type}`) || 
             lowercasePath.includes(`${type}.tsx`) ||
             lowercasePath.includes(`${type}page`) ||
             lowercasePath.includes(`${type}component`);
    });
    
    if (typeSpecificFiles.length > 0) {
      return typeSpecificFiles[0];
    }
    
    if (projectTemplates[type]) {
      const templateFiles = projectTemplates[type].fileStructure;
      for (const expectedPath of templateFiles) {
        const foundFile = fileKeys.find(path => path === expectedPath);
        if (foundFile) {
          return foundFile;
        }
      }
    }
  }
  
  const appFile = fileKeys.find(path => path.endsWith('App.tsx'));
  const indexPage = fileKeys.find(path => path.includes('/pages/') && path.includes('index'));
  const homePage = fileKeys.find(path => path.includes('/pages/') && (path.includes('Home') || path.includes('home')));
  
  return appFile || indexPage || homePage || fileKeys[0];
};

export const extractProjectName = (prompt: string) => {
  let name = prompt.split('.')[0].split('!')[0].trim();
  
  const typeDetected = detectProjectType(prompt);
  if (typeDetected) {
    const words = prompt.split(' ');
    const typePlusClone = words.findIndex((word, i) => 
      word.toLowerCase().includes(typeDetected) && 
      i < words.length - 1 && 
      words[i + 1].toLowerCase().includes('clone')
    );
    
    if (typePlusClone !== -1) {
      name = `${typeDetected.charAt(0).toUpperCase() + typeDetected.slice(1)} Clone`;
    }
  }
  
  if (name.length > 50) {
    name = name.substring(0, 47) + '...';
  }
  
  return name || 'New Project';
};

export const parseProjectFiles = (text: string): ProjectFiles => {
  const fileRegex = /\/\/ FILE: (.*?)\n([\s\S]*?)(?=\/\/ FILE:|$)/g;
  const files: ProjectFiles = {};
  let match;
  
  while ((match = fileRegex.exec(text)) !== null) {
    const filePath = match[1].trim();
    const fileContent = match[2].trim();
    
    const sandpackPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    
    files[sandpackPath] = { code: fileContent };
  }
  
  return files;
};

export const getProjectDependencies = (files: ProjectFiles, detectedType: string | null, projectTemplates: Record<string, ProjectTemplate>) => {
  const dependencies = {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.4"
  };
  
  if (detectedType && projectTemplates[detectedType]) {
    const templateDependencies = projectTemplates[detectedType].suggestedDependencies;
    if (templateDependencies) {
      Object.assign(dependencies, templateDependencies);
    }
  }
  
  const allCode = Object.values(files).map(file => file.code).join(' ');
  
  if (allCode.includes('react-router-dom')) {
    dependencies["react-router-dom"] = "^6.15.0";
  }
  
  if (allCode.includes('.scss')) {
    dependencies["sass"] = "^1.64.2";
  }
  
  if (allCode.includes('axios')) {
    dependencies["axios"] = "^1.4.0";
  }
  
  return dependencies;
};

// Import from project templates to avoid duplicating code
import { detectProjectType, projectTemplates } from '@/utils/projectTemplates';
