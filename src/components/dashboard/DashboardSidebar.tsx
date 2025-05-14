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
  return;
}