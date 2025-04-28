
import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  User,
  CreditCard,
  Bell,
  Key,
  HelpCircle,
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification preferences updated");
  };
  
  const handleSaveAPI = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("API key generated");
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block md:w-64 h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-2">
                <TabsTrigger value="profile" className="flex items-center gap-1 h-10">
                  <User className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-1 h-10">
                  <CreditCard className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-1 h-10">
                  <Bell className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-1 h-10">
                  <Key className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">API Keys</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your account information and profile settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue="John Doe" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" defaultValue="john@example.com" disabled />
                          <p className="text-sm text-muted-foreground">
                            Contact support to change your email
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          placeholder="Tell us about yourself"
                          className="min-h-32" 
                        />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            Delete Account
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            This will permanently delete your account and all associated data.
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>Manage your subscription and payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">Standard Plan</h4>
                              <p className="text-sm text-muted-foreground">$20.00 per month</p>
                            </div>
                            <Button>
                              Manage Subscription
                            </Button>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="font-medium mb-2">Features</h5>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blossom-500"></span>
                                Unlimited projects
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blossom-500"></span>
                                AI content generation
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blossom-500"></span>
                                Custom domains
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blossom-500"></span>
                                Priority support
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blossom-500"></span>
                                Version history
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-medium">
                                VISA
                              </div>
                              <div>
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Update
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Billing History</h3>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                                <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="px-4 py-3 text-sm">Apr 1, 2025</td>
                                <td className="px-4 py-3 text-sm">Monthly subscription</td>
                                <td className="px-4 py-3 text-sm text-right">$20.00</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm">Mar 1, 2025</td>
                                <td className="px-4 py-3 text-sm">Monthly subscription</td>
                                <td className="px-4 py-3 text-sm text-right">$20.00</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm">Feb 1, 2025</td>
                                <td className="px-4 py-3 text-sm">Monthly subscription</td>
                                <td className="px-4 py-3 text-sm text-right">$20.00</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how and when you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveNotifications} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                        
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <Label htmlFor="new-comments" className="font-normal">Project comments</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when someone comments on your project
                            </p>
                          </div>
                          <Switch id="new-comments" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-t">
                          <div>
                            <Label htmlFor="project-updates" className="font-normal">Project updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when your projects are updated
                            </p>
                          </div>
                          <Switch id="project-updates" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-t">
                          <div>
                            <Label htmlFor="marketing" className="font-normal">Marketing emails</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive emails about new features and updates
                            </p>
                          </div>
                          <Switch id="marketing" />
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-t">
                          <div>
                            <Label htmlFor="security" className="font-normal">Security alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified about security incidents and alerts
                            </p>
                          </div>
                          <Switch id="security" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Save Preferences
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage API keys for accessing our services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveAPI} className="space-y-6">
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Public API Key</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Use this key in client-side applications
                              </p>
                            </div>
                            <Button variant="outline" size="sm" type="button">
                              Copy
                            </Button>
                          </div>
                          <div className="mt-2">
                            <Input value="pk_test_abc123def456ghi789" readOnly className="font-mono" />
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Secret API Key</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Keep this secret! Use only in server-side applications
                              </p>
                            </div>
                            <Button variant="outline" size="sm" type="button">
                              Copy
                            </Button>
                          </div>
                          <div className="mt-2">
                            <Input value="sk_test_xyz987wvu654tsr321" readOnly className="font-mono" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button type="submit">
                          <Key className="mr-2 h-4 w-4" />
                          Generate New Keys
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
