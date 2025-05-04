
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, UserPlus, Mail, X, Check, UserX, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Project Manager',
    email: 'sarah.j@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'active'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Frontend Developer',
    email: 'michael.c@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'active'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'UI Designer',
    email: 'emily.r@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'active'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Backend Developer',
    email: 'david.k@example.com',
    avatar: 'https://i.pravatar.cc/150?img=7',
    status: 'away'
  }
];

export default function TeamPage() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [role, setRole] = useState('');
  
  const handleInvite = () => {
    if (!inviteEmail || !role) {
      toast.error('Please provide both email and role');
      return;
    }
    
    toast.success(`Invitation sent to ${inviteEmail}`);
    setIsInviteDialogOpen(false);
    setInviteEmail('');
    setRole('');
  };
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your team members and their access permissions
            </p>
          </div>
          <Button 
            onClick={() => setIsInviteDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
          <div className="p-5 border-b bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium">Team Members</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {teamMembers.map(member => (
              <div key={member.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{member.role}</span>
                      <span className="text-gray-400">•</span>
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {member.status === 'active' ? 'Active' : 'Away'}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600"
                    onClick={() => toast.success(`${member.name} removed from team`)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-5"
          >
            <h2 className="text-lg font-medium mb-4">Pending Invitations</h2>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Mail className="mx-auto h-10 w-10 opacity-30 mb-3" />
              <p>No pending invitations</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-5"
          >
            <h2 className="text-lg font-medium mb-4">Team Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-300">Sarah joined the project "Website Redesign"</span>
                <span className="ml-auto text-gray-400 text-xs">2h ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-300">Michael uploaded new design assets</span>
                <span className="ml-auto text-gray-400 text-xs">5h ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-gray-600 dark:text-gray-300">Emily commented on the latest prototype</span>
                <span className="ml-auto text-gray-400 text-xs">1d ago</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Invite Dialog */}
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to collaborate on this project.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Input
                  id="role"
                  placeholder="e.g., Designer, Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleInvite}>
                <Check className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </Layout>
  );
}
