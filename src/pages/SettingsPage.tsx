
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette, Star, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@example.com');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    teamMessages: true,
    securityAlerts: true,
    marketingEmails: false
  });

  const [themeSettings, setThemeSettings] = useState({
    darkMode: true,
    reducedMotion: false,
    highContrast: false
  });

  const handleSaveProfile = () => {
    toast.success('Profile settings saved successfully');
  };

  const handleToggleNotification = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success(`${setting} setting updated`);
  };

  const handleToggleTheme = (setting: string) => {
    setThemeSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success(`${setting} setting updated`);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="flex flex-col sm:flex-row">
              <TabsList className="sm:flex-col h-auto justify-start sm:w-56 sm:space-y-1 sm:p-2 sm:bg-muted/20 sm:rounded-none sm:border-r overflow-auto">
                <TabsTrigger value="profile" className="justify-start w-full">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance" className="justify-start w-full">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="subscription" className="justify-start w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Subscription
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1 p-6">
                <TabsContent value="profile" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Profile Information</h3>
                      <p className="text-sm text-muted-foreground">Update your account's profile information</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-24 w-24 border-2 border-primary/10">
                        <AvatarImage src="https://i.pravatar.cc/192" alt="User" />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button size="sm">Change Image</Button>
                        <p className="mt-2 text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="displayName" className="text-sm font-medium">
                            Display Name
                          </label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label htmlFor="title" className="text-sm font-medium">
                            Job Title
                          </label>
                          <Input
                            id="title"
                            defaultValue="Product Designer"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="text-sm font-medium">
                            Company
                          </label>
                          <Input
                            id="company"
                            defaultValue="Lovable Inc."
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="text-sm font-medium">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={3}
                          defaultValue="I'm a product designer based in New York City. I specialize in UI/UX design, brand strategy, and web development."
                          className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-transparent text-sm shadow-sm resize-none"
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
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
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Marketing Emails</h4>
                          <p className="text-xs text-muted-foreground">Receive marketing emails and offers</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.marketingEmails} 
                          onCheckedChange={() => handleToggleNotification('marketingEmails')}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Appearance Settings</h3>
                      <p className="text-sm text-muted-foreground">Customize the application appearance</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Dark Mode</h4>
                          <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
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
                          <p className="text-xs text-muted-foreground">Minimize animations throughout the application</p>
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
                          <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
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
                      <p className="text-sm text-muted-foreground">Manage your account security preferences</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Change Password</h4>
                        <div className="mt-2 space-y-2">
                          <Input type="password" placeholder="Current Password" />
                          <Input type="password" placeholder="New Password" />
                          <Input type="password" placeholder="Confirm New Password" />
                          <Button size="sm">Update Password</Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                        <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account</p>
                        <Button size="sm" variant="outline" className="mt-2">Enable 2FA</Button>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium">Active Sessions</h4>
                        <div className="mt-3 space-y-3">
                          <div className="flex justify-between items-center p-3 bg-muted/40 rounded-md">
                            <div>
                              <p className="text-sm font-medium">Current Session</p>
                              <p className="text-xs text-muted-foreground">New York, USA • Chrome on macOS</p>
                            </div>
                            <Badge>Active</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/40 rounded-md">
                            <div>
                              <p className="text-sm font-medium">Mobile App</p>
                              <p className="text-xs text-muted-foreground">New York, USA • iOS 16</p>
                            </div>
                            <Button size="sm" variant="outline" className="text-xs h-7">Logout</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="subscription" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Subscription</h3>
                      <p className="text-sm text-muted-foreground">Manage your subscription plan</p>
                    </div>
                    
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Current Plan</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xl font-bold">Professional</span>
                            <Badge className="bg-primary">Active</Badge>
                          </div>
                        </div>
                        <Button variant="outline">Change Plan</Button>
                      </div>
                      
                      <div className="mt-4 text-sm">
                        <p>Your plan renews on <span className="font-medium">October 15, 2023</span></p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium">Free</h4>
                        <p className="text-3xl font-bold mt-2">$0</p>
                        <p className="text-muted-foreground text-sm">per month</p>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Basic features</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>5 projects</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Community support</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border border-blue-200 rounded-lg p-4 relative bg-blue-50/30 dark:bg-blue-900/10 shadow-md">
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                        <h4 className="font-medium">Professional</h4>
                        <p className="text-3xl font-bold mt-2">$19</p>
                        <p className="text-muted-foreground text-sm">per month</p>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>All Free features</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Unlimited projects</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Priority support</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Advanced analytics</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium">Enterprise</h4>
                        <p className="text-3xl font-bold mt-2">$49</p>
                        <p className="text-muted-foreground text-sm">per month</p>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>All Pro features</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Dedicated support</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Custom integrations</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>SSO & advanced security</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </motion.div>
    </Layout>
  );
}
