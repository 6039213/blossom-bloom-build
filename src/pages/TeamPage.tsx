
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  UserPlus,
  Mail,
  MoreHorizontal,
  ShieldCheck,
  Shield,
  UserX,
  Check,
  X,
  Send
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor';
  avatar?: string;
  status: 'active' | 'pending';
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100
    }
  }
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('editor');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
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
    if (!inviteEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Add new member with 'pending' status
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending'
    };
    
    setMembers([...members, newMember]);
    setInviteEmail('');
    setInviteDialogOpen(false);
    toast.success("Invitation sent successfully!");
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
  
  const handleResendInvite = (email: string) => {
    toast.success(`Invitation resent to ${email}`);
  };
  
  const handleRevokeInvite = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    toast.success("Invitation revoked");
  };
  
  return (
    <Layout>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-between items-center" 
          variants={itemVariants}
        >
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-muted-foreground mt-1">Manage your team members and their access levels</p>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation email to add someone to your team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <div className="col-span-3 flex gap-4">
                    <Button 
                      type="button" 
                      variant={inviteRole === 'admin' ? 'default' : 'outline'} 
                      onClick={() => setInviteRole('admin')}
                      className="flex-1"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                    <Button 
                      type="button" 
                      variant={inviteRole === 'editor' ? 'default' : 'outline'} 
                      onClick={() => setInviteRole('editor')}
                      className="flex-1"
                    >
                      Editor
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleInvite} disabled={!inviteEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
        
        {/* Active Members */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Active Members</CardTitle>
              <CardDescription>Team members who have access to your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.filter(m => m.status === 'active').map((member) => (
                <motion.div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-gradient-to-r from-transparent to-background hover:border-border transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{member.name}</h3>
                        <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                          <div className="flex items-center gap-1">
                            {roleIcons[member.role]}
                            {roleLabels[member.role]}
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm">{member.email}</span>
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
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Pending Invitations */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>People who have been invited but haven't joined yet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.filter(m => m.status === 'pending').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No pending invitations</p>
                </div>
              ) : (
                members.filter(m => m.status === 'pending').map((member) => (
                  <motion.div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-amber-100 bg-amber-50/40"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-amber-100 text-amber-800">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{member.email}</h3>
                          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                            Pending
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {roleLabels[member.role]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Invited 1 day ago
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleResendInvite(member.email)}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Resend
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRevokeInvite(member.id)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border pt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Invite New Member
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Roles Information */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Understand the different access levels for your team</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50/40 to-blue-50/10 border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Owner</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Full access to all features. Can manage team members, billing, and application settings.
                </p>
              </div>
              
              <div className="p-4 rounded-lg border bg-gradient-to-r from-purple-50/40 to-purple-50/10 border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium">Admin</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Can manage team members and create/edit all projects, but cannot access billing.
                </p>
              </div>
              
              <div className="p-4 rounded-lg border bg-gradient-to-r from-gray-50/40 to-gray-50/10 border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">Editor</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Can create and edit projects, but cannot manage team members or access settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
