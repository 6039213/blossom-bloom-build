
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
    <aside className="w-64 bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 border-r border-amber-200 dark:border-amber-700 h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png" 
            alt="Blossom Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-300 inline-block text-transparent bg-clip-text ml-2">
            Blossom
          </span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? "bg-amber-300/40 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200" 
                    : "hover:bg-amber-200/30 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-auto">
          <div className="p-3 bg-gradient-to-r from-amber-200/50 to-amber-300/50 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">Blossom AI</p>
            <p className="text-xs text-amber-700/70 dark:text-amber-400/70">Build beautiful websites with AI</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
