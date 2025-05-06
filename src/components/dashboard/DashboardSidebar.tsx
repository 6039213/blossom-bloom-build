
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, Settings, LifeBuoy, Users, Sparkles } from 'lucide-react';

export default function DashboardSidebar() {
  return (
    <aside className="w-64 border-r border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900 hidden md:flex flex-col">
      <div className="p-4 border-b border-amber-200 dark:border-amber-800">
        <NavLink to="/" className="flex items-center">
          <img src="/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png" alt="Blossom AI" className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">Blossom AI</span>
        </NavLink>
      </div>
      
      <nav className="flex-1 py-4 px-2">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg ${
                  isActive 
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`
              }
              end
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/projects" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg ${
                  isActive 
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`
              }
            >
              <Layers className="h-5 w-5 mr-3" />
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/ai-builder" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg ${
                  isActive 
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`
              }
            >
              <Sparkles className="h-5 w-5 mr-3" />
              AI Builder
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/team" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg ${
                  isActive 
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`
              }
            >
              <Users className="h-5 w-5 mr-3" />
              Team
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/help" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg ${
                  isActive 
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`
              }
            >
              <LifeBuoy className="h-5 w-5 mr-3" />
              Help & Support
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-amber-200 dark:border-amber-800">
        <NavLink 
          to="/dashboard/settings" 
          className={({ isActive }) => 
            `flex items-center px-4 py-2 rounded-lg ${
              isActive 
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
            }`
          }
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
