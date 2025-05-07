
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, Settings, LifeBuoy, Users, Sparkles, Code, LayoutDashboard } from 'lucide-react';

export default function DashboardSidebar() {
  const menuItems = [{
    path: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard'
  }, {
    path: '/dashboard/ai-builder',
    icon: Code,
    label: 'AI Builder'
  }, {
    path: '/dashboard/projects',
    icon: Home,
    label: 'Projects'
  }, {
    path: '/dashboard/team',
    icon: Users,
    label: 'Team'
  }, {
    path: '/dashboard/settings',
    icon: Settings,
    label: 'Settings'
  }, {
    path: '/dashboard/help',
    icon: LifeBuoy,
    label: 'Help'
  }];
  
  return (
    <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-border overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png" 
            alt="Blossom Logo" 
            className="w-8 h-8" 
          />
          <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-300 inline-block text-transparent bg-clip-text">
            Blossom
          </span>
        </div>
      </div>
      
      <nav className="px-3 py-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-amber-200/50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 hover:text-amber-800 dark:hover:text-amber-300'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="px-3 py-4 mt-8">
        <div className="p-3 bg-gradient-to-r from-amber-100/50 to-amber-200/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
          <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">Blossom AI</p>
          <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-1">Build beautiful websites with AI</p>
        </div>
      </div>
    </div>
  );
}
