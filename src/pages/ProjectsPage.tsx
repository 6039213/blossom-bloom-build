
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ProjectCard from '@/components/dashboard/ProjectCard';
import NewProjectModal from '@/components/dashboard/NewProjectModal';
import { toast } from 'sonner';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useProjectStore, ProjectStatus } from '@/stores/projectStore';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoading, projects, fetchProjects, deleteProject, createProject } = useProjectStore();
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to auth if not logged in
    if (!user && !isAuthLoading) {
      navigate('/auth');
      return;
    }
    
    // Fetch projects if user is logged in
    if (user) {
      fetchProjects();
    }
  }, [user, isAuthLoading, navigate, fetchProjects]);
  
  const handleCreateProject = async (projectData: { title: string; description?: string }) => {
    try {
      await createProject({
        ...projectData,
        status: 'draft' as ProjectStatus,
        description: projectData.description || ''
      });
      
      toast.success("New project created!");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };
  
  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };
  
  const filteredProjects = projects.filter((project) => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Projects</h1>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-9 w-[200px] lg:w-[300px] border-blossom-200 focus:border-blossom-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <NewProjectModal onCreateProject={handleCreateProject} />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card>
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blossom-100 dark:bg-blossom-900/30 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-blossom-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm ? "No projects found" : "Create your first project"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? `No projects matching "${searchTerm}"`
                    : "Start by creating a new project to build your website"
                  }
                </p>
                {!searchTerm && (
                  <NewProjectModal onCreateProject={handleCreateProject} />
                )}
                {searchTerm && (
                  <Button 
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  lastEdited={new Date(project.updated_at).toLocaleString()}
                  status={project.status as any}
                  thumbnail={project.thumbnail || '/placeholder.svg'}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
