import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AIPromptInput from '@/components/dashboard/AIPromptInput';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GEMINI_API_KEY } from '@/lib/constants';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Download,
  Copy,
  Code,
  Eye,
  Sparkles,
  RefreshCw,
  Save,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  AlertTriangle
} from 'lucide-react';
import { useProjectStore, ProjectStatus } from '@/stores/projectStore';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackPreview,
  SandpackFileExplorer
} from '@codesandbox/sandpack-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import SandpackCustomCodeEditor from '@/components/dashboard/SandpackCustomCodeEditor';
import ProjectTypeSelector from '@/components/dashboard/ProjectTypeSelector';
import { 
  detectProjectType, 
  getTemplatePrompt, 
  projectTemplates, 
  ProjectTemplate,
  createDefaultFilesForTemplate 
} from '@/utils/projectTemplates';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProjectFile {
  code: string;
}

interface ProjectFiles {
  [filePath: string]: ProjectFile;
}

const defaultScssVariables = `
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

export default function AIBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>({});
  const [activeTab, setActiveTab] = useState('preview');
  const [projectName, setProjectName] = useState('');
  const [activeFile, setActiveFile] = useState('/src/App.tsx');
  const [viewportSize, setViewportSize] = useState('desktop');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const { createProject } = useProjectStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getProjectDependencies = (files: ProjectFiles) => {
    const dependencies = {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "typescript": "^5.0.4"
    };
    
    if (detectedType && projectTemplates[detectedType]) {
      const templateDependencies = projectTemplates[detectedType].suggestedDependencies;
      Object.assign(dependencies, templateDependencies);
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

  const fixScssImports = (files: ProjectFiles): ProjectFiles => {
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
  
  const verifyTemplateFilesExist = (files: ProjectFiles, template: ProjectTemplate | null): boolean => {
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
  
  const ensureRequiredFilesExist = (files: ProjectFiles, template: ProjectTemplate | null): ProjectFiles => {
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
  
  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setDetectedType(template.type);
    setShowTemplateSelector(false);
    
    const defaultFiles = createDefaultFilesForTemplate(template.type);
    if (Object.keys(defaultFiles).length > 0) {
      setProjectFiles(defaultFiles);
      setGeneratedCode(JSON.stringify(defaultFiles, null, 2));
      
      let mainFile = findMainFile(defaultFiles, template.type);
      setActiveFile(mainFile);
      
      toast.success("Template files created! You can customize with AI prompt or edit directly.");
    }
  };
  
  const handlePromptSubmit = async (prompt: string) => {
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      if (!GEMINI_API_KEY) {
        toast.error("Gemini API key is not configured correctly");
        return;
      }
      
      const extractedName = extractProjectName(prompt);
      setProjectName(extractedName);
      
      const type = detectProjectType(prompt);
      setDetectedType(type);
      
      const templateInstructions = getTemplatePrompt(type);
      
      let initialFiles: ProjectFiles = {};
      if (selectedTemplate) {
        initialFiles = createDefaultFilesForTemplate(selectedTemplate.type);
      }
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Generate a complete React website based on this description: "${prompt}". 

This MUST be a modern React 18+ application with TypeScript (.tsx files) and SCSS modules for styling.
Include the following file structure:

/src
  /components (with reusable UI components)
  /pages (with page components)
  /hooks (custom React hooks if needed)
  /contexts (React context providers if needed)
  /utils (utility functions)
  /styles (SCSS module files)
  App.tsx
  index.tsx
/public
  index.html
package.json
vite.config.ts

${templateInstructions}

Important requirements:
1. Use functional components with TypeScript (React.FC<Props>)
2. Use SCSS modules for styling (.module.scss files)
3. Proper imports and exports between files
4. Use react-router-dom for navigation if needed
5. All TypeScript types must be properly defined
6. Make it visually appealing with a modern design
7. Make sure the code is fully functional and the website is responsive
8. IMPORTANT: Define all SCSS variables! Create a variables.scss file with at least these variables:
   $primary-color: #f59e0b;
   $secondary-color: #3b82f6;
   $text-color: #374151;
   $background-color: #ffffff;
   And import it into all other SCSS files using the CORRECT RELATIVE PATH!
9. CRITICAL: All imports from the src directory MUST use the @/ prefix.
   For example: import Component from '@/components/Component';
10. Make sure App.tsx properly imports ALL page components and sets up routes to them!

Return the complete multi-file project as a single response with clear file path indicators like:
// FILE: src/App.tsx
// code here...

// FILE: src/components/Header.tsx
// code here...

Do not include any explanations, just the code files. Make sure to implement all necessary features for a production-ready application.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Error generating website');
      }
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }
      
      const text = data.candidates[0].content.parts[0].text;
      let parsedFiles = parseProjectFiles(text);
      
      if (Object.keys(initialFiles).length > 0) {
        parsedFiles = { ...initialFiles, ...parsedFiles };
      }
      
      if (detectedType && projectTemplates[detectedType]) {
        const template = projectTemplates[detectedType];
        parsedFiles = ensureRequiredFilesExist(parsedFiles, template);
      }
      
      const fixedFiles = fixScssImports(parsedFiles);
      
      setProjectFiles(fixedFiles);
      setGeneratedCode(JSON.stringify(fixedFiles, null, 2));
      
      let mainFile = findMainFile(fixedFiles, type);
      setActiveFile(mainFile);
      
      if (selectedTemplate && !verifyTemplateFilesExist(fixedFiles, selectedTemplate)) {
        toast.warning("Some template files may be missing. Please check your generated code.");
      } else {
        toast.success("Website generated successfully!");
      }
      
      setActiveTab('preview');
      setShowTemplateSelector(false);
    } catch (error) {
      console.error("Error generating website:", error);
      toast.error("Failed to generate website: " + (error instanceof Error ? error.message : "Unknown error"));
      setErrorMessage(error instanceof Error ? error.message : "Unknown error generating website");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const findMainFile = (files: ProjectFiles, type: string | null): string => {
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
  
  const parseProjectFiles = (text: string): ProjectFiles => {
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
  
  const extractProjectName = (prompt: string) => {
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
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard");
  };
  
  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded successfully");
  };

  const handleSaveProject = async () => {
    if (!user) {
      toast.error("You must be logged in to save a project");
      navigate('/auth');
      return;
    }

    if (Object.keys(projectFiles).length === 0) {
      toast.error("No project to save");
      return;
    }

    try {
      const projectData = {
        title: projectName,
        description: `${detectedType ? `${detectedType.charAt(0).toUpperCase() + detectedType.slice(1)} clone ` : ""}Generated with AI Builder`,
        code: JSON.stringify(projectFiles),
        status: 'draft' as ProjectStatus
      };

      const newProject = await createProject(projectData);
      
      toast.success("Project saved successfully");
      navigate(`/dashboard/projects/${newProject.id}`);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };

  const handleCodeChange = (updatedFiles: ProjectFiles) => {
    setProjectFiles(updatedFiles);
    setGeneratedCode(JSON.stringify(updatedFiles, null, 2));
  };

  const handleOpenInNewTab = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${projectName || 'AI Generated Project'}</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; }
          iframe { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <div id="sandbox-container"></div>
        <script type="module">
          const iframe = document.createElement('iframe');
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          document.getElementById('sandbox-container').appendChild(iframe);
          
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          doc.open();
          doc.write('<html><head><title>Preview</title><style>body{margin:0;padding:20px;font-family:sans-serif;}</style></head><body><h1>Preview Mode</h1><p>This is a preview of your project: ${projectName || 'Untitled Project'}</p></body></html>');
          doc.close();
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };
  
  const getViewportClasses = () => {
    switch(viewportSize) {
      case 'mobile':
        return 'w-[320px] mx-auto border border-border rounded-lg shadow-lg';
      case 'tablet':
        return 'w-[768px] mx-auto border border-border rounded-lg shadow-lg';
      case 'desktop':
      default:
        return 'w-full';
    }
  };
  
  const handleReportError = (error: Error) => {
    setErrorMessage(error.message);
    toast.error("Error reported. Our AI assistant will help resolve this issue.");
  };
  
  const handleResetSelection = () => {
    setSelectedTemplate(null);
    setShowTemplateSelector(true);
    setProjectFiles({});
    setGeneratedCode('');
  };

  const handleUseTemplatePrompt = () => {
    if (selectedTemplate) {
      handlePromptSubmit(selectedTemplate.defaultPrompt);
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AI Website Builder</h1>
            {detectedType && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Project type:</span>
                <span className="bg-blossom-100 dark:bg-blossom-900/30 px-2 py-1 rounded text-xs font-medium text-blossom-700 dark:text-blossom-300 capitalize">
                  {detectedType}
                </span>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden grid grid-rows-[auto_1fr]">
          <div className="p-4 bg-white dark:bg-gray-900 border-b border-border">
            <div className="max-w-4xl mx-auto">
              {showTemplateSelector && (
                <div className="mb-6">
                  <ProjectTypeSelector onSelect={handleTemplateSelect} />
                </div>
              )}
              
              {selectedTemplate && !Object.keys(projectFiles).length && (
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Selected template: {selectedTemplate.displayName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleResetSelection}>
                      Change Template
                    </Button>
                    <Button variant="default" size="sm" onClick={handleUseTemplatePrompt}>
                      Use Default Prompt
                    </Button>
                  </div>
                </div>
              )}
              
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-blossom-500" />
                {selectedTemplate ? "Customize your website" : "Tell us about your website"}
              </h2>
              
              {selectedTemplate && (
                <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/20">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    When using the {selectedTemplate.displayName} template, make sure to reference template files like <code>{selectedTemplate.fileStructure[0]}</code> in your prompt.
                  </AlertDescription>
                </Alert>
              )}
              
              <AIPromptInput 
                onSubmit={handlePromptSubmit} 
                isProcessing={isGenerating}
                onSaveCode={handleSaveProject}
                showSaveButton={Object.keys(projectFiles).length > 0}
                onReportError={handleReportError}
              />
              
              {errorMessage && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-xs text-red-700 dark:text-red-300">
                    <strong>Error:</strong> {errorMessage}
                  </p>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="mt-1"
                    onClick={() => setErrorMessage(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="overflow-hidden p-2 flex-grow">
            {Object.keys(projectFiles).length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-blossom-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Let's Create Something Amazing</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {selectedTemplate 
                      ? "Customize your website by entering a detailed prompt or use the default template prompt."
                      : "Choose a template or type a description of the website you want to build."}
                  </p>
                  <ul className="text-left space-y-2 bg-muted p-3 rounded-lg text-xs">
                    <li className="flex items-start">
                      <span className="bg-blossom-100 dark:bg-blossom-900/30 p-1 rounded text-blossom-700 dark:text-blossom-300 mr-2">Tip</span>
                      <span>Be specific about your website's purpose, style, and content.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blossom-100 dark:bg-blossom-900/30 p-1 rounded text-blossom-700 dark:text-blossom-300 mr-2">Tip</span>
                      <span>Mention color schemes or specific design elements you'd like to include.</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="w-full h-full mx-auto flex flex-col">
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full h-full flex flex-col"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <TabsList>
                        <TabsTrigger value="preview" className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </TabsTrigger>
                        <TabsTrigger value="code" className="flex items-center">
                          <Code className="h-3 w-3 mr-1" />
                          Code
                        </TabsTrigger>
                      </TabsList>
                      
                      {activeTab === 'preview' && (
                        <ToggleGroup type="single" value={viewportSize} onValueChange={(value) => value && setViewportSize(value)}>
                          <ToggleGroupItem value="mobile" aria-label="Mobile view">
                            <Smartphone className="h-3 w-3" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="tablet" aria-label="Tablet view">
                            <Tablet className="h-3 w-3" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="desktop" aria-label="Desktop view">
                            <Monitor className="h-3 w-3" />
                          </ToggleGroupItem>
                        </ToggleGroup>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      {activeTab === 'preview' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleOpenInNewTab}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          New Tab
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCopyCode}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDownloadCode}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setProjectFiles({});
                          setGeneratedCode('');
                          if (selectedTemplate) {
                            setShowTemplateSelector(false);
                          } else {
                            setShowTemplateSelector(true);
                          }
                        }}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                      <Button 
                        variant="default"
                        size="sm"
                        onClick={handleSaveProject}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden border border-border rounded-lg">
                    <TabsContent value="preview" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                      <div className={`h-full w-full overflow-auto transition-all duration-300 ${getViewportClasses()}`}>
                        {Object.keys(projectFiles).length > 0 && (
                          <SandpackProvider
                            template="react-ts"
                            theme="auto"
                            files={projectFiles}
                            customSetup={{
                              dependencies: getProjectDependencies(projectFiles),
                            }}
                            options={{
                              visibleFiles: [activeFile],
                            }}
                          >
                            <SandpackLayout className="h-full">
                              <SandpackPreview
                                showRefreshButton
                                className="flex-grow h-full"
                              />
                            </SandpackLayout>
                          </SandpackProvider>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="code" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden">
                      <SandpackProvider
                        template="react-ts"
                        theme="auto"
                        files={projectFiles}
                        customSetup={{
                          dependencies: getProjectDependencies(projectFiles),
                        }}
                      >
                        <SandpackLayout className="h-full">
                          <SandpackFileExplorer className="min-w-[180px]" />
                          <SandpackCustomCodeEditor onCodeChange={handleCodeChange} />
                        </SandpackLayout>
                      </SandpackProvider>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
