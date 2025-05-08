
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
    <div className="flex flex-col space-y-1 py-2">
      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`
          }
        >
          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
