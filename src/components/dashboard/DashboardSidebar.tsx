
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Users, 
  FileCode, 
  Layout, 
  Zap,
  BookOpen,
  HelpCircle
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const DashboardSidebar = () => {
  const location = useLocation();
  
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home size={18} /> },
    { name: 'Projects', href: '/dashboard/projects', icon: <FileCode size={18} /> },
    { name: 'AI Builder', href: '/dashboard/ai-builder', icon: <Zap size={18} /> },
    { name: 'Templates', href: '/dashboard/templates', icon: <Layout size={18} /> },
    { name: 'Documentation', href: '/dashboard/docs', icon: <BookOpen size={18} /> },
    { name: 'Team', href: '/dashboard/team', icon: <Users size={18} /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings size={18} /> },
    { name: 'Help', href: '/dashboard/help', icon: <HelpCircle size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen overflow-y-auto fixed left-0 top-0 pt-16 pb-4">
      <div className="px-4 py-6">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
