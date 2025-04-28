
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
} from 'lucide-react';
import { useProjectStore, ProjectStatus } from '@/stores/projectStore';
import { useAuth } from '@/contexts/AuthContext';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview,
  SandpackFileExplorer,
  SandpackFiles,
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

// File structure types
interface ProjectFile {
  code: string;
}

interface ProjectFiles {
  [filePath: string]: ProjectFile;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProject, updateProject, deleteProject } = useProjectStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>({});
  const [sandpackFiles, setSandpackFiles] = useState<SandpackFiles>({});
  const [projectData, setProjectData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Get default dependencies based on the generated files
  const getProjectDependencies = (files: ProjectFiles) => {
    const dependencies = {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "typescript": "^5.0.4"
    };
    
    // Check for common libraries in the code
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
        
        // Parse code from string to object
        if (project.code) {
          try {
            const parsedFiles = JSON.parse(project.code);
            setProjectFiles(parsedFiles);
            
            // Convert ProjectFiles to SandpackFiles format
            const convertedFiles: SandpackFiles = {};
            Object.entries(parsedFiles).forEach(([path, file]) => {
              convertedFiles[path] = { 
                code: (file as ProjectFile).code,
                active: true 
              };
            });
            setSandpackFiles(convertedFiles);
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

  // Handle sandpack file changes
  const handleFileChange = (newFiles: Record<string, { code: string }>) => {
    // Convert Sandpack's file format to our format
    const updatedProjectFiles: ProjectFiles = {};
    Object.entries(newFiles).forEach(([path, content]) => {
      updatedProjectFiles[path] = { code: content.code };
    });
    
    setProjectFiles(updatedProjectFiles);
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
                  
                  <div className="flex space-x-2">
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
                    <div className="h-full w-full overflow-auto">
                      {Object.keys(sandpackFiles).length > 0 && (
                        <SandpackProvider
                          template="react-ts"
                          theme="auto"
                          files={sandpackFiles}
                          customSetup={{
                            dependencies: getProjectDependencies(projectFiles),
                          }}
                        >
                          <SandpackLayout>
                            <SandpackFileExplorer />
                            <SandpackCodeEditor
                              showLineNumbers
                              readOnly={false}
                            />
                            <SandpackPreview
                              showRefreshButton
                              showNavigator
                            />
                          </SandpackLayout>
                        </SandpackProvider>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="code" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden">
                    <pre className="h-full w-full p-4 text-sm bg-gray-50 dark:bg-gray-950 overflow-auto">
                      <code>{JSON.stringify(projectFiles, null, 2)}</code>
                    </pre>
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
