
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  User,
  Lock,
  Bell,
  UserPlus,
  CreditCard,
  Activity,
  Settings as SettingsIcon,
  Save,
  LogOut
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1 
    }
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

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    jobTitle: "UX Designer",
    bio: "UI/UX designer with over 5 years of experience in creating beautiful interfaces.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    theme: "system",
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    newsletterNotifications: true
  });
  
  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };
  
  const handleSaveChanges = () => {
    toast.success("Settings saved successfully");
  };
  
  const handleSignOut = () => {
    toast.info("Signing out...");
  };
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast.success("Password updated successfully");
  };
  
  return (
    <Layout>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Password</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Team</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span>Advanced</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your personal information and profile settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={formData.avatar || "https://via.placeholder.com/150"} 
                          alt="Profile" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                        >
                          <span className="sr-only">Change avatar</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={formData.name} 
                            onChange={(e) => handleInputChange('name', e.target.value)} 
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={(e) => handleInputChange('email', e.target.value)} 
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input 
                          id="jobTitle" 
                          value={formData.jobTitle} 
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Input 
                          id="bio" 
                          value={formData.bio} 
                          onChange={(e) => handleInputChange('bio', e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="font-medium">Preferences</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <p className="text-sm text-muted-foreground">Select your preferred color theme</p>
                      </div>
                      <Select 
                        value={formData.theme} 
                        onValueChange={(value) => handleInputChange('theme', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-border pt-6">
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    Save changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="current">Current Password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="new">New Password</Label>
                      <Input id="new" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirm">Confirm New Password</Label>
                      <Input id="confirm" type="password" />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive emails about your account activity</p>
                      </div>
                      <Switch 
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive push notifications in-app</p>
                      </div>
                      <Switch 
                        checked={formData.pushNotifications}
                        onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing Emails</h3>
                        <p className="text-sm text-muted-foreground">Receive emails about new features and offers</p>
                      </div>
                      <Switch 
                        checked={formData.marketingEmails}
                        onCheckedChange={(checked) => handleInputChange('marketingEmails', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Newsletter</h3>
                        <p className="text-sm text-muted-foreground">Receive our weekly newsletter</p>
                      </div>
                      <Switch 
                        checked={formData.newsletterNotifications}
                        onCheckedChange={(checked) => handleInputChange('newsletterNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-6">
                  <Button onClick={handleSaveChanges}>Save preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Settings</CardTitle>
                  <CardDescription>Manage your team and permissions</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="mx-auto max-w-md">
                    <h3 className="text-xl font-semibold mb-4">Manage your team members</h3>
                    <p className="mb-6 text-muted-foreground">
                      Add, remove, and manage team members from the Team page
                    </p>
                    <Button onClick={() => window.location.href = '/dashboard/team'}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Go to Team Management
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>Manage your subscription and payment methods</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="mx-auto max-w-md">
                    <h3 className="text-xl font-semibold mb-4">Free Plan</h3>
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Activity className="h-10 w-10 text-blue-600" />
                    </div>
                    <p className="mb-6 text-muted-foreground">
                      You're currently on the Free plan. Upgrade to access premium features and remove limitations.
                    </p>
                    <Button>Upgrade Plan</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure advanced settings for your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Account Activity</h3>
                      <p className="text-sm text-muted-foreground mb-2">See when this account is being used and from where</p>
                      <Button variant="outline" size="sm">View Login History</Button>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-medium">Default Language</h3>
                      <p className="text-sm text-muted-foreground mb-2">Select your preferred language for the interface</p>
                      <Select defaultValue="en">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-medium">Animation Speed</h3>
                      <p className="text-sm text-muted-foreground mb-4">Adjust the speed of animations throughout the app</p>
                      <div className="px-4">
                        <Slider defaultValue={[50]} max={100} step={1} />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>Slower</span>
                          <span>Faster</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-6">
                  <div className="space-x-4 w-full flex justify-between">
                    <Button variant="destructive">Delete Account</Button>
                    <Button onClick={handleSaveChanges}>Save changes</Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
