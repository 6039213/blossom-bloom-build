
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ProjectCard from '@/components/dashboard/ProjectCard';
import NewProjectModal from '@/components/dashboard/NewProjectModal';
import { toast } from 'sonner';
import { getSupabaseClient } from '@/lib/supabase-client';
import { Search, Plus, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const supabase = getSupabaseClient();
  
  // Example projects with placeholder images to avoid 404s
  const exampleProjects = [
    {
      id: '1',
      title: 'Coffee Shop Website',
      description: 'A modern landing page for a local coffee shop with online ordering capability',
      lastEdited: '2 hours ago',
      status: 'published',
      thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: '2',
      title: 'Personal Portfolio',
      description: 'My professional portfolio showcasing recent design work and case studies',
      lastEdited: 'Yesterday',
      status: 'draft',
      thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: '3',
      title: 'Travel Blog',
      description: 'A blog documenting my adventures around the world with photo galleries',
      lastEdited: '3 days ago',
      status: 'draft',
      thumbnail: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    }
  ];
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
          throw new Error("Not authenticated");
        }
        
        setUser(data.user);
        setProjects(exampleProjects);
      } catch (error) {
        console.error("Authentication error:", error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleCreateProject = async (projectData: { title: string; description?: string }) => {
    setProjects((prevProjects) => [
      ...prevProjects,
      {
        id: Date.now().toString(),
        ...projectData,
        lastEdited: 'Just now',
        status: 'draft',
        thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
      }
    ]);
    
    toast.success("New project created!");
  };
  
  const handleDeleteProject = async (id: string) => {
    setProjects((prevProjects) => prevProjects.filter(project => project.id !== id));
    toast.success("Project deleted");
  };
  
  const filteredProjects = projects.filter((project) => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const publishedCount = projects.filter(p => p.status === 'published').length;
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
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
            <div className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Welcome Card */}
              <Card className="mb-8 bg-gradient-to-r from-blossom-100 to-blossom-50 dark:from-blossom-900/40 dark:to-blossom-900/20 border-blossom-200 dark:border-blossom-800/30">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Creator'}!</h2>
                      <p className="text-muted-foreground">Continue building your amazing websites or start a new project</p>
                    </div>
                    <div className="flex-1" />
                    <Button 
                      className="bg-blossom-gradient hover:opacity-90 text-white shadow-blossom"
                      onClick={() => navigate('/dashboard/ai-builder')}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Try AI Builder
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Projects */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Projects</h2>
                  {projects.length > 3 && (
                    <Button variant="ghost" onClick={() => navigate('/dashboard/projects')}>
                      View All
                    </Button>
                  )}
                </div>
                
                {filteredProjects.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
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
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.slice(0, 3).map((project) => (
                      <ProjectCard 
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        lastEdited={project.lastEdited}
                        status={project.status as any}
                        thumbnail={project.thumbnail}
                        onDelete={handleDeleteProject}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{projects.length}</CardTitle>
                      <CardDescription>Total Projects</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>{publishedCount}</CardTitle>
                      <CardDescription>Published Sites</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '0'}</CardTitle>
                      <CardDescription>Last Login</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
