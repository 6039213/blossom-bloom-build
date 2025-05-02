
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Project, ProjectSummary, ChatMessage, FileContent, Permission } from '@/types/project';

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  
  // Selectors
  getCurrentProject: () => Project | undefined;
  getProjectSummaries: () => ProjectSummary[];
  
  // Actions
  createProject: (name: string, description: string) => string;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'files' | 'chat'>>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string) => void;
  
  // File management
  addFiles: (projectId: string, files: FileContent[]) => void;
  updateFile: (projectId: string, path: string, content: string) => void;
  deleteFile: (projectId: string, path: string) => void;
  
  // Chat management
  addChatMessage: (projectId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  getPermission: (projectId: string, permission: Permission) => Promise<boolean>;
  
  // Project export/import
  exportProject: (projectId: string) => string;
  importProject: (projectData: string) => string | null;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      
      getCurrentProject: () => {
        const { projects, currentProjectId } = get();
        return projects.find(p => p.id === currentProjectId);
      },
      
      getProjectSummaries: () => {
        return get().projects.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          thumbnail: p.thumbnail,
          fileCount: p.files.length
        }));
      },
      
      createProject: (name, description) => {
        const id = uuidv4();
        const now = new Date();
        
        const newProject: Project = {
          id,
          name,
          description,
          createdAt: now,
          updatedAt: now,
          files: [],
          chat: []
        };
        
        set(state => ({
          projects: [...state.projects, newProject],
          currentProjectId: id
        }));
        
        return id;
      },
      
      updateProject: (id, updates) => {
        set(state => ({
          projects: state.projects.map(p => 
            p.id === id 
              ? { ...p, ...updates, updatedAt: new Date() }
              : p
          )
        }));
      },
      
      deleteProject: (id) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId
        }));
      },
      
      setCurrentProject: (id) => {
        set({ currentProjectId: id });
      },
      
      addFiles: (projectId, files) => {
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== projectId) return p;
            
            // Create a map of existing files for quick lookup
            const existingFiles = new Map(p.files.map(f => [f.path, f]));
            
            // Process new files, either adding them or updating existing ones
            files.forEach(file => {
              existingFiles.set(file.path, file);
            });
            
            return {
              ...p,
              files: Array.from(existingFiles.values()),
              updatedAt: new Date()
            };
          })
        }));
      },
      
      updateFile: (projectId, path, content) => {
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== projectId) return p;
            
            const fileExists = p.files.some(f => f.path === path);
            
            if (fileExists) {
              // Update existing file
              return {
                ...p,
                files: p.files.map(f => 
                  f.path === path ? { ...f, content } : f
                ),
                updatedAt: new Date()
              };
            } else {
              // Add new file
              return {
                ...p,
                files: [...p.files, { path, content }],
                updatedAt: new Date()
              };
            }
          })
        }));
      },
      
      deleteFile: (projectId, path) => {
        set(state => ({
          projects: state.projects.map(p => 
            p.id === projectId 
              ? {
                  ...p,
                  files: p.files.filter(f => f.path !== path),
                  updatedAt: new Date()
                }
              : p
          )
        }));
      },
      
      addChatMessage: (projectId, message) => {
        const id = uuidv4();
        
        set(state => ({
          projects: state.projects.map(p => 
            p.id === projectId
              ? {
                  ...p,
                  chat: [...p.chat, { ...message, id, timestamp: new Date() }],
                  updatedAt: new Date()
                }
              : p
          )
        }));
        
        return id;
      },
      
      getPermission: async (projectId, permission) => {
        // In a real app, this would be a dialog prompt
        // For now, we'll just log and return true
        console.log(`Requesting permission for ${permission.action}`, permission.details);
        
        // Mock confirmation dialog by returning a Promise
        return new Promise((resolve) => {
          // Auto-confirm after a short delay
          setTimeout(() => resolve(true), 500);
        });
      },
      
      exportProject: (projectId) => {
        const project = get().projects.find(p => p.id === projectId);
        if (!project) return '';
        
        return JSON.stringify(project);
      },
      
      importProject: (projectData) => {
        try {
          const project = JSON.parse(projectData) as Project;
          
          // Validate minimal project structure
          if (!project.id || !project.name || !Array.isArray(project.files) || !Array.isArray(project.chat)) {
            throw new Error('Invalid project data');
          }
          
          // Generate a new ID to avoid collisions
          const id = uuidv4();
          const importedProject = {
            ...project,
            id,
            name: `${project.name} (Imported)`,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          set(state => ({
            projects: [...state.projects, importedProject],
            currentProjectId: id
          }));
          
          return id;
        } catch (error) {
          console.error('Failed to import project:', error);
          return null;
        }
      }
    }),
    {
      name: 'blossom-projects-storage'
    }
  )
);
