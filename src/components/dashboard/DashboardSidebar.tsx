
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Settings, 
  Users, 
  HelpCircle,
  LogOut,
  Sparkles
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function DashboardSidebar() {
  const location = useLocation();
  const supabase = getSupabaseClient();
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error(error);
    }
  };
  
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: <FolderOpen className="w-5 h-5" />
    },
    {
      name: "AI Builder",
      href: "/dashboard/ai-builder",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      name: "Team",
      href: "/dashboard/team",
      icon: <Users className="w-5 h-5" />
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />
    },
    {
      name: "Help",
      href: "/dashboard/help",
      icon: <HelpCircle className="w-5 h-5" />
    }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
  };
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-border">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png" 
            alt="Blossom Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-xl bg-gradient-to-r from-blossom-700 to-blossom-500 inline-block text-transparent bg-clip-text">
            {APP_NAME}
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigationItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-blossom-50 dark:bg-blossom-950/20 text-blossom-700 dark:text-blossom-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
