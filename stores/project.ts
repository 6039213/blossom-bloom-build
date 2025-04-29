
import { create } from "zustand";
import { ProjectTemplate } from "@/types";

interface ProjectState {
  templates: ProjectTemplate[];
  openProject: (slug: string) => void;
  previewHtml: string;
  setPreviewHtml: (html: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  templates: [
    { slug: "portfolio", name: "Portfolio Site", description: "Clean one-pager", thumbnail: "/img/port.png" },
    { slug: "saas", name: "SaaS Landing", description: "Hero + pricing", thumbnail: "/img/saas.png" }
  ],
  openProject: (slug: string) =>
    set(s => ({ previewHtml: `<h1>${s.templates.find(t => t.slug === slug)?.name}</h1>` })),
  previewHtml: "",
  setPreviewHtml: (html: string) => set({ previewHtml: html })
}));
