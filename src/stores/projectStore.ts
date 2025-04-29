
import { create } from "zustand";

export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  code?: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
}

type Template = { 
  slug: string; 
  name: string; 
  html: string 
};

interface ProjectStore {
  previewHtml: string;
  templates: Template[];
  projects: Project[];
  isLoading: boolean;
  setPreviewHtml: (html: string) => void;
  openProject: (slug: string) => void;
  
  // Project management functions
  fetchProjects: () => Promise<void>;
  getProject: (id: string) => Promise<Project | undefined>;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  previewHtml: "",
  templates: [
    { slug: "portfolio", name: "Portfolio", html: "<h1 class='text-4xl'>Portfolio starter</h1>" },
    { slug: "saas", name: "SaaS Landing", html: "<h1 class='text-4xl'>SaaS starter</h1>" }
  ],
  projects: [],
  isLoading: false,
  
  setPreviewHtml: (html: string) => set({ previewHtml: html }),
  
  openProject: (slug: string) =>
    set(state => ({ 
      previewHtml: state.templates.find(t => t.slug === slug)?.html || "" 
    })),
    
  // Mock implementations for project management functions
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      // Simulating a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock project data
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'Portfolio Website',
          description: 'My professional portfolio site',
          status: 'published',
          thumbnail: '/placeholder.svg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'SaaS Landing Page',
          description: 'Landing page for my new SaaS product',
          status: 'draft',
          thumbnail: '/placeholder.svg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      set({ projects: mockProjects });
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  getProject: async (id: string) => {
    const { projects } = get();
    return projects.find(project => project.id === id);
  },
  
  createProject: async (projectData) => {
    const newProject: Project = {
      id: Math.random().toString(36).substring(2, 9), // Generate a random ID
      ...projectData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    set(state => ({ 
      projects: [...state.projects, newProject] 
    }));
    
    return newProject;
  },
  
  updateProject: async (id: string, updates: Partial<Project>) => {
    let updatedProject: Project | undefined;
    
    set(state => {
      const updatedProjects = state.projects.map(project => {
        if (project.id === id) {
          updatedProject = {
            ...project,
            ...updates,
            updated_at: new Date().toISOString()
          };
          return updatedProject;
        }
        return project;
      });
      
      return { projects: updatedProjects };
    });
    
    if (!updatedProject) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    return updatedProject;
  },
  
  deleteProject: async (id: string) => {
    set(state => ({
      projects: state.projects.filter(project => project.id !== id)
    }));
  }
}));
