
import { getTemplateImage } from './sampleImages';

export interface ProjectTemplate {
  id: string;
  displayName: string;
  description: string;
  defaultPrompt: string;
  dependencies?: Record<string, string>;
  tags: string[];
  category: string;
  imageUrl?: string;
}

export const projectTemplates: Record<string, ProjectTemplate> = {
  'landing-page': {
    id: 'landing-page',
    displayName: 'Landing Page',
    description: 'A modern, responsive landing page with hero section, features, pricing, and contact form',
    defaultPrompt: 'Create a professional landing page with a hero section, animated features grid, pricing tables, testimonials, and a contact form',
    tags: ['landing', 'business', 'marketing'],
    category: 'marketing',
    imageUrl: getTemplateImage('coffee-shop')
  },
  'portfolio': {
    id: 'portfolio',
    displayName: 'Portfolio',
    description: 'Professional portfolio site with project showcase, about me section, and contact form',
    defaultPrompt: 'Build a clean and modern portfolio website for a designer with project showcase, about section, skills, and contact form',
    tags: ['portfolio', 'personal', 'showcase'],
    category: 'personal',
    imageUrl: getTemplateImage('portfolio')
  },
  'blog': {
    id: 'blog',
    displayName: 'Blog',
    description: 'Full-featured blog with articles, categories, search, and comments',
    defaultPrompt: 'Create a travel blog with article listings, featured posts section, category navigation, and comment system',
    tags: ['blog', 'content', 'publishing'],
    category: 'content',
    imageUrl: getTemplateImage('travel-blog')
  },
  'dashboard': {
    id: 'dashboard',
    displayName: 'Admin Dashboard',
    description: 'Feature-rich dashboard with charts, tables, and statistics',
    defaultPrompt: 'Build an admin dashboard with charts, data tables, user management, and analytics overview',
    tags: ['dashboard', 'admin', 'analytics'],
    category: 'application'
  },
  'e-commerce': {
    id: 'e-commerce',
    displayName: 'E-commerce',
    description: 'Online store with product listings, cart, checkout, and user accounts',
    defaultPrompt: 'Create an e-commerce site with product grid, filtering, shopping cart, and checkout process',
    tags: ['ecommerce', 'shop', 'products'],
    category: 'business'
  },
  'social-media': {
    id: 'social-media',
    displayName: 'Social App',
    description: 'Social networking app with profiles, posts, comments, and likes',
    defaultPrompt: 'Build a social media app interface with news feed, user profiles, comments system, and notifications',
    tags: ['social', 'network', 'community'],
    category: 'application'
  }
};

export const getTemplateById = (id: string): ProjectTemplate | undefined => {
  return projectTemplates[id];
};

export default projectTemplates;
