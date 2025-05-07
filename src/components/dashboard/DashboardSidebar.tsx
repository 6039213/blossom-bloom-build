
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, Settings, LifeBuoy, Users, Sparkles, Code, LayoutDashboard } from 'lucide-react';

export default function DashboardSidebar() {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/ai-builder', icon: Code, label: 'AI Builder' },
    { path: '/dashboard/projects', icon: Home, label: 'Projects' },
    { path: '/dashboard/team', icon: Users, label: 'Team' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
    { path: '/dashboard/help', icon: LifeBuoy, label: 'Help' },
  ];

  return (
    <div className="bg-gray-900 w-64 h-full flex flex-col">
      <div className="p-4 flex items-center">
        <Sparkles className="h-6 w-6 text-amber-400 mr-2" />
        <h1 className="text-xl font-bold text-white">Blossom AI</h1>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center py-2 px-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-amber-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
              end={item.path === '/dashboard'}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-md p-3">
          <p className="text-sm text-gray-300 font-medium">Blossom AI Builder</p>
          <p className="text-xs text-gray-400 mt-1">Create beautiful web applications with AI</p>
        </div>
      </div>
    </div>
  );
}
