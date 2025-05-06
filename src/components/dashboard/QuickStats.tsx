
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Users, Clock, Sparkles } from 'lucide-react';

export default function QuickStats() {
  // Mock data for stats
  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      change: '+3',
      icon: <Layers className="h-5 w-5 text-amber-600" />,
    },
    {
      title: 'Team Members',
      value: '8',
      change: '+2',
      icon: <Users className="h-5 w-5 text-blue-600" />,
    },
    {
      title: 'Hours Saved',
      value: '124',
      change: '+18',
      icon: <Clock className="h-5 w-5 text-green-600" />,
    },
    {
      title: 'AI Generations',
      value: '36',
      change: '+5',
      icon: <Sparkles className="h-5 w-5 text-purple-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                    {stat.change}
                  </p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
