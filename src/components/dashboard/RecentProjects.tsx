
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

// Mock data for recent projects
const recentProjects = [
  {
    id: '1',
    name: 'E-commerce Website',
    description: 'Online store with product catalog and shopping cart',
    updatedAt: '2023-05-20T10:30:00Z',
    progress: 85
  },
  {
    id: '2',
    name: 'Portfolio Site',
    description: 'Personal portfolio showcasing creative work',
    updatedAt: '2023-05-18T14:15:00Z',
    progress: 65
  },
  {
    id: '3',
    name: 'Blog Platform',
    description: 'Content management system for publishing articles',
    updatedAt: '2023-05-15T09:45:00Z',
    progress: 40
  }
];

export default function RecentProjects() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Recent Projects</CardTitle>
        <Link 
          to="/dashboard/projects" 
          className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center"
        >
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <Link 
              key={project.id} 
              to={`/dashboard/projects/${project.id}`}
              className="block"
            >
              <div className="flex items-start p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                <div className="h-10 w-10 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                  <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{project.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {project.description}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-amber-500 h-1.5 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
                      {project.progress}% complete
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
