
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Lock, Bell, Moon, Sun, Laptop, Cloud, Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [profileForm, setProfileForm] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    username: 'alexj'
  });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    projects: true,
    team: true
  });
  
  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.id]: e.target.value
    });
  };
  
  // Handle security form changes
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityForm({
      ...securityForm,
      [e.target.id]: e.target.value
    });
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };
  
  // Handle profile save
  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };
  
  // Handle password change
  const handleChangePassword = () => {
    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    toast.success("Password changed successfully");
    setSecurityForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  // Handle notification save
  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  return (
    <Layout>
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1.5">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1.5">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1.5">
              <Moon className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">AJ</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-medium">{profileForm.name}</h3>
                    <p className="text-sm text-muted-foreground">{profileForm.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Avatar
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileForm.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileForm.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={profileForm.username}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleChangePassword}>
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive email notifications</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationToggle('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-muted-foreground">Receive marketing emails</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing}
                    onCheckedChange={() => handleNotificationToggle('marketing')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Project Updates</h3>
                    <p className="text-sm text-muted-foreground">Get notified about project changes</p>
                  </div>
                  <Switch 
                    checked={notifications.projects}
                    onCheckedChange={() => handleNotificationToggle('projects')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Team Activity</h3>
                    <p className="text-sm text-muted-foreground">Get notified about team actions</p>
                  </div>
                  <Switch 
                    checked={notifications.team}
                    onCheckedChange={() => handleNotificationToggle('team')}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications}>
                  <Bell className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the appearance of the app.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Theme</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-4 w-4" />
                      Light
                      {theme === "light" && <Check className="h-4 w-4 ml-1" />}
                    </Button>
                    
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                      {theme === "dark" && <Check className="h-4 w-4 ml-1" />}
                    </Button>
                    
                    <Button 
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className="flex items-center gap-2"
                    >
                      <Laptop className="h-4 w-4" />
                      System
                      {theme === "system" && <Check className="h-4 w-4 ml-1" />}
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Sync Settings</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sync settings to cloud</h4>
                      <p className="text-sm text-muted-foreground">Sync your settings across devices</p>
                    </div>
                    <Switch id="sync" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => toast.success("Settings saved to cloud")}>
                  <Cloud className="h-4 w-4 mr-2" />
                  Sync Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
}
