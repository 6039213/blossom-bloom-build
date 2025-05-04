
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Mail, MoreHorizontal, UserPlus, UserX, Settings, CheckIcon, Copy } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Sample team members data
const initialTeamMembers = [
  { 
    id: '1', 
    name: 'Alex Johnson', 
    email: 'alex@example.com', 
    role: 'Admin',
    avatar: null,
    status: 'active'
  },
  { 
    id: '2', 
    name: 'Jamie Smith', 
    email: 'jamie@example.com', 
    role: 'Developer',
    avatar: null,
    status: 'active'
  },
  { 
    id: '3', 
    name: 'Taylor Wong', 
    email: 'taylor@example.com', 
    role: 'Designer',
    avatar: null, 
    status: 'pending'
  }
];

export default function Team() {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({ email: '', role: 'Editor' });

  // Handle sending a new invitation
  const handleSendInvite = () => {
    if (!newInvite.email) {
      toast.error("Please enter an email address");
      return;
    }
    
    // Add new pending team member
    setTeamMembers([...teamMembers, {
      id: Date.now().toString(),
      name: newInvite.email.split('@')[0],
      email: newInvite.email,
      role: newInvite.role,
      avatar: null,
      status: 'pending'
    }]);
    
    // Reset form and close dialog
    setNewInvite({ email: '', role: 'Editor' });
    setIsInviteDialogOpen(false);
    
    toast.success(`Invitation sent to ${newInvite.email}`);
  };

  // Handle removing a team member
  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast.success("Team member removed");
  };

  // Copy invite link
  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText('https://blossom.ai/invite/team12345');
    toast.success("Invite link copied to clipboard");
  };

  return (
    <Layout>
      <motion.div 
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">Invite team members and manage access to your projects.</p>
          </div>
          
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Invite Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite team member</DialogTitle>
                <DialogDescription>
                  Send an invitation email to add someone to your team.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="colleague@example.com"
                    value={newInvite.email}
                    onChange={(e) => setNewInvite({...newInvite, email: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <select 
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newInvite.role}
                    onChange={(e) => setNewInvite({...newInvite, role: e.target.value})}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSendInvite}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Team members list */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage your team members and their roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || undefined} />
                      <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center">
                        {member.name}
                        {member.status === 'pending' && (
                          <Badge variant="outline" className="ml-2 text-xs text-amber-600 bg-amber-50 border-amber-200">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{member.role}</Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Change role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <p className="text-sm text-muted-foreground mb-2">Or share invite link</p>
              <div className="flex gap-2">
                <Input value="https://blossom.ai/invite/team12345" readOnly className="text-xs" />
                <Button variant="outline" size="icon" onClick={handleCopyInviteLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Layout>
  );
}
