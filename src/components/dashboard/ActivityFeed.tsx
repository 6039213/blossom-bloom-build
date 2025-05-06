
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileEdit, Trash, Plus, Eye } from 'lucide-react';

// Mock data for activity feed
const activities = [
  {
    id: '1',
    type: 'edit',
    description: 'Updated homepage hero section',
    project: 'E-commerce Website',
    timestamp: '2023-05-20T10:30:00Z',
  },
  {
    id: '2',
    type: 'create',
    description: 'Created new contact form',
    project: 'Portfolio Site',
    timestamp: '2023-05-18T14:15:00Z',
  },
  {
    id: '3',
    type: 'delete',
    description: 'Removed unused components',
    project: 'Blog Platform',
    timestamp: '2023-05-15T09:45:00Z',
  },
  {
    id: '4',
    type: 'view',
    description: 'Previewed project',
    project: 'E-commerce Website',
    timestamp: '2023-05-14T16:20:00Z',
  },
];

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'edit':
      return <FileEdit className="h-4 w-4 text-blue-500" />;
    case 'create':
      return <Plus className="h-4 w-4 text-green-500" />;
    case 'delete':
      return <Trash className="h-4 w-4 text-red-500" />;
    case 'view':
      return <Eye className="h-4 w-4 text-purple-500" />;
    default:
      return null;
  }
};

export default function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                <ActivityIcon type={activity.type} />
              </div>
              <div>
                <p className="text-sm">{activity.description}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300 mr-2">
                    {activity.project}
                  </span>
                  <span>•</span>
                  <span className="ml-2">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
