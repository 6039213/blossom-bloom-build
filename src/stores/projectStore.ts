
import { create } from "zustand";

type Template = { 
  slug: string; 
  name: string; 
  html: string 
};

interface ProjectStore {
  previewHtml: string;
  templates: Template[];
  setPreviewHtml: (html: string) => void;
  openProject: (slug: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  previewHtml: "",
  templates: [
    { slug: "portfolio", name: "Portfolio", html: "<h1 class='text-4xl'>Portfolio starter</h1>" },
    { slug: "saas", name: "SaaS Landing", html: "<h1 class='text-4xl'>SaaS starter</h1>" }
  ],
  setPreviewHtml: (html: string) => set({ previewHtml: html }),
  openProject: (slug: string) =>
    set(state => ({ 
      previewHtml: state.templates.find(t => t.slug === slug)?.html || "" 
    }))
}));
