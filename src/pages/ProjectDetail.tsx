
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, Trash2, FileCode, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import { FileSystemItem } from '@/components/dashboard/FileExplorer';
import { buildFileTree } from '@/utils/fileStructureUtils';

type ProjectDetailParams = {
  id: string;
};

export default function ProjectDetail() {
  const { id } = useParams<ProjectDetailParams>();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProjectStore();
  
  // Local state for the project
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('files');
  const [fileTree, setFileTree] = useState<FileSystemItem[]>([]);

  // Get the project from the store
  const project = projects.find(p => p.id === id);

  // When the project changes, update the local state
  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      
      // Build file tree if there are files
      if (project.files && project.files.length > 0) {
        try {
          // Convert project files to a Record<string, string> format for the file tree builder
          const filesRecord: Record<string, string> = {};
          project.files.forEach(file => {
            filesRecord[file.path] = file.content;
          });
          
          const tree = buildFileTree(filesRecord);
          setFileTree(tree);
        } catch (error) {
          console.error("Error building file tree:", error);
        }
      }
    }
  }, [project]);

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="mb-4">The project you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/dashboard/projects')}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveChanges = () => {
    try {
      updateProject(project.id, {
        name,
        description,
      });
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = () => {
    try {
      deleteProject(project.id);
      toast.success("Project deleted successfully");
      navigate('/dashboard/projects');
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Error deleting project:", error);
    }
  };

  // Get chat message count
  const chatCount = project.chat ? project.chat.length : 0;
  
  // Get file count
  const fileCount = project.files ? project.files.length : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-64"
                  autoFocus
                />
                <Button size="sm" onClick={() => {
                  setIsEditingName(false);
                  handleSaveChanges();
                }}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setName(project.name);
                    setIsEditingName(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <h1 
                className="text-2xl font-bold cursor-pointer hover:text-primary truncate"
                onClick={() => setIsEditingName(true)}
              >
                {name || 'Unnamed Project'}
              </h1>
            )}
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleDeleteProject}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button onClick={() => navigate(`/dashboard/ai-builder`)}>
                Edit Project
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium mb-2 flex items-center">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Project Details
                  </h2>
                  {isEditingDescription ? (
                    <div className="space-y-2">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-20"
                        placeholder="Enter project description..."
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => {
                          setIsEditingDescription(false);
                          handleSaveChanges();
                        }}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setDescription(project.description);
                            setIsEditingDescription(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p 
                      className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-primary"
                      onClick={() => setIsEditingDescription(true)}
                    >
                      {description || 'No description. Click to add one.'}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 border rounded-md p-3">
                    <div className="text-sm font-medium mb-1">Created</div>
                    <div>{new Date(project.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex-1 border rounded-md p-3">
                    <div className="text-sm font-medium mb-1">Last Updated</div>
                    <div>{new Date(project.updatedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="files" className="flex items-center">
                  <FileCode className="h-4 w-4 mr-2" />
                  Files ({fileCount})
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat History ({chatCount})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="files">
                <Card className="p-4">
                  {fileCount > 0 ? (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Project Files</h3>
                      <div className="border rounded-md p-2 max-h-96 overflow-auto">
                        {/* File tree would go here */}
                        <pre className="text-xs">{JSON.stringify(fileTree, null, 2)}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileCode className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium">No Files Yet</h3>
                      <p className="text-gray-500 mt-1">
                        This project doesn't have any files yet.
                      </p>
                      <Button 
                        onClick={() => navigate(`/dashboard/ai-builder`)}
                        className="mt-4"
                      >
                        Generate Files with AI
                      </Button>
                    </div>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="chat">
                <Card className="p-4">
                  {chatCount > 0 ? (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Chat History</h3>
                      <div className="space-y-4">
                        {project.chat.map((message, index) => (
                          <div 
                            key={message.id || index}
                            className={`p-3 rounded-lg ${
                              message.role === 'user' 
                                ? 'bg-blue-50 ml-12' 
                                : 'bg-gray-50 mr-12'
                            }`}
                          >
                            <div className="font-medium">
                              {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </div>
                            <div className="mt-1 whitespace-pre-wrap">
                              {message.content.length > 300 
                                ? `${message.content.substring(0, 300)}...` 
                                : message.content
                              }
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(message.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium">No Chat History</h3>
                      <p className="text-gray-500 mt-1">
                        You haven't chatted with the AI assistant about this project yet.
                      </p>
                      <Button 
                        onClick={() => navigate(`/dashboard/ai-builder`)}
                        className="mt-4"
                      >
                        Start AI Chat
                      </Button>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
