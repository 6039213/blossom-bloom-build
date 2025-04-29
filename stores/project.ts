
import { create } from 'zustand';

type Template = {
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
};

type ProjectStore = {
  templates: Template[];
  openProject: (slug: string) => void;
  previewHtml: string;
  setPreviewHtml: (html: string) => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  templates: [
    { slug: "portfolio", name: "Portfolio Site", description: "Clean one-pager", thumbnail: "/img/port.png" },
    { slug: "saas", name: "SaaS Landing", description: "Hero + pricing", thumbnail: "/img/saas.png" }
  ],
  openProject: (slug: string) =>
    set((state) => ({ 
      previewHtml: `<h1 style="font-family: system-ui; color: #333; text-align: center; margin-top: 40px;">${state.templates.find(t => t.slug === slug)?.name}</h1>` 
    })),
  previewHtml: "",
  setPreviewHtml: (html: string) => set({ previewHtml: html })
}));
