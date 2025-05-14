
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
  
  // Add a return statement to render the sidebar
  return (
    <div className="h-full w-64 bg-white dark:bg-gray-800 border-r border-amber-200 dark:border-amber-800 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-300 mb-4">Navigation</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-900 dark:hover:text-amber-300'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3 text-current" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
