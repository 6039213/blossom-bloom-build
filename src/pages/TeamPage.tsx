
import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  UserPlus,
  Mail,
  MoreHorizontal,
  ShieldCheck,
  Shield,
  UserX
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor';
  avatar?: string;
  status: 'active' | 'pending';
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      avatar: '',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      avatar: '',
      status: 'active'
    },
    {
      id: '3',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'editor',
      status: 'pending'
    }
  ]);
  
  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    toast.success("Team member removed");
  };
  
  const handleChangeRole = (id: string, role: TeamMember['role']) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, role } : m
    ));
    toast.success("Role updated successfully");
  };
  
  const handleInvite = () => {
    toast.info("Invitation feature coming soon");
  };
  
  const roleIcons = {
    owner: <ShieldCheck className="h-4 w-4 text-blue-500" />,
    admin: <Shield className="h-4 w-4 text-purple-500" />,
    editor: <></>,
  };
  
  const roleLabels = {
    owner: "Owner",
    admin: "Admin",
    editor: "Editor",
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Team Members</h1>
            <Button 
              className="flex items-center gap-2"
              onClick={handleInvite}
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Manage Team</CardTitle>
              <CardDescription>Invite and manage your team members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{member.name}</h3>
                          {member.status === 'pending' && (
                            <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                              Pending
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            {roleIcons[member.role]}
                            {roleLabels[member.role]}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{member.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem 
                          disabled={member.role === 'admin'} 
                          onClick={() => handleChangeRole(member.id, 'admin')}
                        >
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          disabled={member.role === 'editor'} 
                          onClick={() => handleChangeRole(member.id, 'editor')}
                        >
                          Make Editor
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          disabled={member.role === 'owner'} 
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>Learn about the different roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Owner</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Full access to all features. Can manage team members, billing, and application settings.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Admin</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Can manage team members and create/edit all projects, but cannot access billing.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Editor</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Can create and edit projects, but cannot manage team members or access settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
