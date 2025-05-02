
import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Settings() {
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile settings saved successfully");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification preferences saved");
  };

  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Appearance settings saved");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="h-full">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = '/settings/api'}
            >
              API Settings
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <Card className="max-w-4xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent">
                <TabsTrigger 
                  value="profile" 
                  className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications"
                  className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance"
                  className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Appearance
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="p-6">
                <form onSubmit={handleSaveProfile}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        defaultValue="Web developer and AI enthusiast."
                        rows={4}
                      />
                    </div>
                    
                    <Button type="submit">Save Profile</Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="notifications" className="p-6">
                <form onSubmit={handleSaveNotifications}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Project Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when your projects are updated.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Features</p>
                        <p className="text-sm text-muted-foreground">
                          Be notified when we release new features.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">
                          Receive marketing and promotional emails.
                        </p>
                      </div>
                      <Switch />
                    </div>
                    
                    <Button type="submit">Save Preferences</Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="appearance" className="p-6">
                <form onSubmit={handleSaveAppearance}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="flex gap-4">
                        <div className="border rounded-md p-2 flex flex-col items-center gap-2">
                          <div className="w-20 h-12 bg-white border rounded"></div>
                          <span className="text-sm">Light</span>
                        </div>
                        
                        <div className="border rounded-md p-2 flex flex-col items-center gap-2">
                          <div className="w-20 h-12 bg-gray-900 rounded"></div>
                          <span className="text-sm">Dark</span>
                        </div>
                        
                        <div className="border rounded-md p-2 flex flex-col items-center gap-2">
                          <div className="w-20 h-12 bg-gradient-to-b from-white to-gray-900 rounded"></div>
                          <span className="text-sm">System</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="font-size">Font Size</Label>
                      <select 
                        id="font-size" 
                        className="w-full p-2 border rounded-md"
                        defaultValue="medium"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    
                    <Button type="submit">Save Appearance</Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </main>
      </div>
    </div>
  );
}
