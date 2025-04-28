import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';
import { useProjectStore, ProjectStatus } from '@/stores/projectStore';
import { useAuth } from '@/contexts/AuthContext';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackPreview,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import SandpackCustomCodeEditor from '@/components/dashboard/SandpackCustomCodeEditor';

// File structure types
interface ProjectFile {
  code: string;
}

interface ProjectFiles {
  [filePath: string]: ProjectFile;
}

// Default SCSS variable definitions to avoid errors
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

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProject, updateProject, deleteProject } = useProjectStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>({});
  const [projectData, setProjectData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Get default dependencies based on the generated files
  const getProjectDependencies = (files: ProjectFiles) => {
    const dependencies = {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "typescript": "^5.0.4"
    };
    
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

  // Fix SCSS import paths and add default variables
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
  
  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const project = await getProject(id);
        
        if (!project) {
          toast.error("Project not found");
          navigate('/dashboard/projects');
          return;
        }
        
        setProjectData(project);
        
        if (project.code) {
          try {
            const parsedFiles = JSON.parse(project.code);
            const fixedFiles = fixScssImports(parsedFiles);
            setProjectFiles(fixedFiles);
          } catch (error) {
            console.error("Failed to parse project code:", error);
            toast.error("Failed to load project code");
          }
        }
      } catch (error) {
        console.error("Error loading project:", error);
        toast.error("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadProject();
    } else {
      navigate('/auth');
    }
  }, [id, user, navigate, getProject]);
  
  const handleSaveProject = async () => {
    if (!projectData) return;
    
    try {
      await updateProject(projectData.id, {
        code: JSON.stringify(projectFiles),
        status: projectData.status as ProjectStatus,
      });
      
      toast.success("Project saved successfully");
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };
  
  const handleDeleteProject = async () => {
    if (!projectData) return;
    
    try {
      await deleteProject(projectData.id);
      toast.success("Project deleted successfully");
      navigate('/dashboard/projects');
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleCodeChange = (updatedFiles: ProjectFiles) => {
    setProjectFiles(updatedFiles);
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(JSON.stringify(projectFiles, null, 2));
    toast.success("Code copied to clipboard");
  };
  
  const handleDownloadCode = () => {
    const blob = new Blob([JSON.stringify(projectFiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData?.title || 'project'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded successfully");
  };

  const handleOpenInNewTab = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${projectData?.title || 'Project Preview'}</title>
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
          doc.write('<html><head><title>Preview</title><style>body{margin:0;padding:20px;font-family:sans-serif;}</style></head><body><h1>Preview Mode</h1><p>This is a preview of your project: ${projectData?.title || 'Untitled Project'}</p></body></html>');
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
  
  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden md:block md:w-64 h-full">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p>Loading project...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard/projects')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">{projectData?.title || 'Project Details'}</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSaveProject}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden p-6">
          {Object.keys(projectFiles).length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <p className="text-lg mb-4">This project doesn't have any code yet.</p>
                <Button onClick={() => navigate('/dashboard/ai-builder')}>
                  Create with AI Builder
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-full mx-auto h-full flex flex-col">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full h-full flex flex-col"
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="flex items-center gap-4">
                    <TabsList>
                      <TabsTrigger value="preview" className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="code" className="flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Code
                      </TabsTrigger>
                    </TabsList>
                    
                    {activeTab === 'preview' && (
                      <ToggleGroup type="single" value={viewportSize} onValueChange={(value) => value && setViewportSize(value)}>
                        <ToggleGroupItem value="mobile" aria-label="Mobile view">
                          <Smartphone className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="tablet" aria-label="Tablet view">
                          <Tablet className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="desktop" aria-label="Desktop view">
                          <Monitor className="h-4 w-4" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {activeTab === 'preview' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleOpenInNewTab}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in New Tab
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopyCode}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDownloadCode}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden border border-border rounded-lg">
                  <TabsContent value="preview" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                    <div className={`h-full overflow-auto transition-all duration-300 ${getViewportClasses()}`}>
                      <SandpackProvider
                        template="react-ts"
                        theme="auto"
                        files={projectFiles}
                        customSetup={{
                          dependencies: getProjectDependencies(projectFiles),
                        }}
                        options={{
                          showNavigator: true,
                          showTabs: false,
                          showLineNumbers: true,
                          classes: {
                            'sp-layout': 'h-full',
                            'sp-preview': 'h-full',
                          }
                        }}
                      >
                        <SandpackLayout className="h-full">
                          <SandpackPreview
                            showRefreshButton
                            showNavigator
                            className="flex-grow h-full"
                          />
                        </SandpackLayout>
                      </SandpackProvider>
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
                        <SandpackFileExplorer className="min-w-[200px]" />
                        <SandpackCustomCodeEditor onCodeChange={handleCodeChange} />
                      </SandpackLayout>
                    </SandpackProvider>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </main>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              project and remove all its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
