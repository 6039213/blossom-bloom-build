
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Layers, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Mock projects data
const projects = [
  {
    id: '1',
    name: 'E-commerce Website',
    description: 'Online store with product catalog and shopping cart',
    updatedAt: '2023-05-20T10:30:00Z',
    type: 'Retail',
    coverImage: '/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png'
  },
  {
    id: '2',
    name: 'Portfolio Site',
    description: 'Personal portfolio showcasing creative work',
    updatedAt: '2023-05-18T14:15:00Z',
    type: 'Personal',
    coverImage: '/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png'
  },
  {
    id: '3',
    name: 'Blog Platform',
    description: 'Content management system for publishing articles',
    updatedAt: '2023-05-15T09:45:00Z',
    type: 'Media',
    coverImage: '/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png'
  },
  {
    id: '4',
    name: 'SaaS Dashboard',
    description: 'Admin dashboard for SaaS application',
    updatedAt: '2023-05-12T11:20:00Z',
    type: 'Business',
    coverImage: '/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png'
  }
];

export default function ProjectsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">All Projects</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {projects.length} projects in total
          </p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-1" />
          New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <Link to={`/dashboard/projects/${project.id}`} className="block">
              <div 
                className="h-36 bg-cover bg-center border-b border-gray-200 dark:border-gray-800" 
                style={{ backgroundImage: `url(${project.coverImage || ''})` }}
              ></div>
            </Link>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <Link to={`/dashboard/projects/${project.id}`} className="block">
                  <h3 className="font-semibold hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    {project.name}
                  </h3>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  {project.type}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
