
import { useState, useEffect } from 'react';
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
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function DashboardSidebar() {
  const location = useLocation();
  const supabase = getSupabaseClient();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  // Automatically collapse on mobile screens
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
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
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  // Actual sidebar state based on hover and expanded state
  const showExpanded = isExpanded || isHovering;
  
  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-white dark:bg-gray-900 border-r border-border transition-all duration-300",
        showExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {showExpanded ? (
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
        ) : (
          <Link to="/" className="mx-auto">
            <img 
              src="/lovable-uploads/bd80f93f-4a5e-4b8c-9f55-caa09f871d6b.png" 
              alt="Blossom Logo" 
              className="w-8 h-8 object-contain"
            />
          </Link>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn("flex-shrink-0", !showExpanded && "hidden")}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navigationItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              isActive(item.href)
                ? "bg-blossom-50 dark:bg-blossom-950/20 text-blossom-700 dark:text-blossom-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground",
              !showExpanded && "justify-center"
            )}
          >
            {item.icon}
            {showExpanded && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
      
      <div className="p-2 border-t border-border">
        <Button 
          variant="ghost" 
          className={cn(
            "text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800",
            showExpanded ? "w-full justify-start" : "w-full justify-center"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
          {showExpanded && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}
