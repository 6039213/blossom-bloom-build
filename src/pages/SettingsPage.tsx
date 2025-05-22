import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Mail, Lock, Key } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';

interface UserProfile {
  displayName: string;
  email: string;
  avatar?: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load user profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Error parsing user profile:', e);
      }
    }
  }, []);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to update the profile
      // For now, we'll just update localStorage
      localStorage.setItem('user_profile', JSON.stringify(profile));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically make an API call to change the password
      // For now, we'll just simulate a successful change
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to update the email
      // For now, we'll just update localStorage
      localStorage.setItem('user_profile', JSON.stringify(profile));
      toast.success('Email updated successfully');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <Settings className="h-8 w-8 text-blue-500 mr-2" />
                Account Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account information and security
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Password
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">Update your profile details</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.displayName || 'User'}`} />
                      <AvatarFallback>{profile.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="display-name" className="text-sm font-medium">
                      Display Name
                    </label>
                    <Input
                      id="display-name"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      placeholder="Enter your display name"
                    />
                  </div>

                  <Button 
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Email Settings</h3>
                  <p className="text-sm text-muted-foreground">Update your email address</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>

                  <Button 
                    onClick={handleUpdateEmail}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Email'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="password" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your password</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="text-sm font-medium">
                      Current Password
                    </label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button 
                    onClick={handleChangePassword}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
