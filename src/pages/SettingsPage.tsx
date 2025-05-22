import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    projectUpdates: false,
    teamMessages: false,
    securityAlerts: false
  });

  const [themeSettings, setThemeSettings] = useState({
    darkMode: false,
    reducedMotion: false,
    highContrast: false
  });

  // Load user settings from localStorage
  useEffect(() => {
    const savedDisplayName = localStorage.getItem('user_display_name');
    const savedEmail = localStorage.getItem('user_email');
    const savedNotifications = localStorage.getItem('notification_settings');
    const savedTheme = localStorage.getItem('theme_settings');

    if (savedDisplayName) setDisplayName(savedDisplayName);
    if (savedEmail) setEmail(savedEmail);
    if (savedNotifications) {
      try {
        setNotificationSettings(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Error parsing notification settings:', e);
      }
    }
    if (savedTheme) {
      try {
        setThemeSettings(JSON.parse(savedTheme));
      } catch (e) {
        console.error('Error parsing theme settings:', e);
      }
    }
  }, []);

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('user_display_name', displayName);
      localStorage.setItem('user_email', email);
      toast.success('Profile settings saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile settings');
    }
  };

  const handleToggleNotification = (setting: string) => {
    const newSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    };
    setNotificationSettings(newSettings);
    try {
      localStorage.setItem('notification_settings', JSON.stringify(newSettings));
      toast.success(`${setting} setting updated`);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification settings');
    }
  };

  const handleToggleTheme = (setting: string) => {
    const newSettings = {
      ...themeSettings,
      [setting]: !themeSettings[setting]
    };
    setThemeSettings(newSettings);
    try {
      localStorage.setItem('theme_settings', JSON.stringify(newSettings));
      toast.success(`${setting} setting updated`);
    } catch (error) {
      console.error('Error saving theme settings:', error);
      toast.error('Failed to save theme settings');
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
                Manage your account preferences and settings
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Profile Settings</h3>
                  <p className="text-sm text-muted-foreground">Update your profile information</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName || 'User'}`} />
                      <AvatarFallback>{displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="display-name" className="text-sm font-medium">
                      Display Name
                    </label>
                    <Input
                      id="display-name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                  <p className="text-sm text-muted-foreground">Choose how you receive notifications</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications} 
                      onCheckedChange={() => handleToggleNotification('emailNotifications')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Project Updates</h4>
                      <p className="text-xs text-muted-foreground">Get notified about project changes</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.projectUpdates} 
                      onCheckedChange={() => handleToggleNotification('projectUpdates')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Team Messages</h4>
                      <p className="text-xs text-muted-foreground">Get notified about new team messages</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.teamMessages} 
                      onCheckedChange={() => handleToggleNotification('teamMessages')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Security Alerts</h4>
                      <p className="text-xs text-muted-foreground">Get notified about security events</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.securityAlerts} 
                      onCheckedChange={() => handleToggleNotification('securityAlerts')}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Appearance Settings</h3>
                  <p className="text-sm text-muted-foreground">Customize how the application looks</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Dark Mode</h4>
                      <p className="text-xs text-muted-foreground">Enable dark mode theme</p>
                    </div>
                    <Switch 
                      checked={themeSettings.darkMode} 
                      onCheckedChange={() => handleToggleTheme('darkMode')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Reduced Motion</h4>
                      <p className="text-xs text-muted-foreground">Reduce animation and motion effects</p>
                    </div>
                    <Switch 
                      checked={themeSettings.reducedMotion} 
                      onCheckedChange={() => handleToggleTheme('reducedMotion')}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">High Contrast</h4>
                      <p className="text-xs text-muted-foreground">Enable high contrast mode</p>
                    </div>
                    <Switch 
                      checked={themeSettings.highContrast} 
                      onCheckedChange={() => handleToggleTheme('highContrast')}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your account security</p>
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    Delete Account
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
