
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  code?: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface NewProject {
  title: string;
  description: string;
  code?: string;
  status: ProjectStatus;
  thumbnail?: string;
}

interface ProjectStore {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
  createProject: (project: NewProject) => Promise<Project>;
  updateProject: (id: string, updates: Partial<NewProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,
  
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      set({ projects: projects || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to fetch projects');
    }
  },
  
  getProject: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching project:', error);
      set({ error: error.message });
      toast.error('Failed to fetch project');
      return null;
    }
  },
  
  createProject: async (project: NewProject) => {
    set({ isLoading: true, error: null });
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a project');
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...project,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update the local state
      set(state => ({
        projects: [data, ...state.projects],
        isLoading: false
      }));
      
      return data;
    } catch (error: any) {
      console.error('Error creating project:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create project');
      throw error;
    }
  },
  
  updateProject: async (id: string, updates: Partial<NewProject>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state
      set(state => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
        ),
        isLoading: false
      }));
      
      toast.success('Project updated');
    } catch (error: any) {
      console.error('Error updating project:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to update project');
    }
  },
  
  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state
      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
        isLoading: false
      }));
      
      toast.success('Project deleted');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to delete project');
    }
  },
  
  setError: (error) => set({ error }),
}));
