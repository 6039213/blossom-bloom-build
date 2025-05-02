
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Plus, Trash2, ExternalLink, FileCode, Calendar, Settings, Search
} from 'lucide-react';
import { toast } from 'sonner';

import { useProjectStore } from '@/stores/projectStore';

export default function Projects() {
  const navigate = useNavigate();
  const { 
    projects, 
    getProjectSummaries, 
    createProject, 
    deleteProject, 
    setCurrentProject 
  } = useProjectStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  
  // Get all project summaries
  const projectSummaries = getProjectSummaries().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Filter projects by search term
  const filteredProjects = projectSummaries.filter(
    project => project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle create new project
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    
    try {
      const id = createProject(
        newProjectName.trim(),
        newProjectDescription.trim() || "Created in Blossom AI Builder"
      );
      setCurrentProject(id);
      
      toast.success("Project created successfully");
      setShowCreateDialog(false);
      setNewProjectName('');
      setNewProjectDescription('');
      
      // Navigate to AI Builder with the new project
      navigate('/dashboard/ai-builder');
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };
  
  // Handle delete project
  const handleDeleteProject = (id: string) => {
    try {
      deleteProject(id);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Projects</h1>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </header>
        
        <div className="p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
              </div>
            </div>
            
            {filteredProjects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                {searchTerm ? (
                  <>
                    <h2 className="text-xl font-semibold mb-2">No matching projects</h2>
                    <p className="text-muted-foreground mb-6">
                      No projects match your search term: "{searchTerm}"
                    </p>
                    <Button variant="outline" onClick={() => setSearchTerm('')}>
                      Clear Search
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
                    <p className="text-muted-foreground mb-6">
                      Get started by creating your first AI project!
                    </p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map(project => (
                  <Card key={project.id} className="flex flex-col">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <Link to="/dashboard/ai-builder" 
                          onClick={() => setCurrentProject(project.id)}
                          className="hover:text-primary truncate"
                        >
                          {project.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex-1">
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <FileCode className="h-4 w-4 mr-1" />
                        <span>{project.fileCount} {project.fileCount === 1 ? 'file' : 'files'}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Updated {formatDate(project.updatedAt)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 border-t flex justify-between">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{project.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteProject(project.id)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <Link to="/dashboard/ai-builder" onClick={() => setCurrentProject(project.id)}>
                        <Button variant="default" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Project Dialog */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Project</AlertDialogTitle>
            <AlertDialogDescription>
              Enter details for your new AI project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="My Amazing Website"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Input
                id="description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="A brief description of your project"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateProject}>
              Create Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
