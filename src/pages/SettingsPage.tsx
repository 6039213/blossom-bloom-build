import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Mail, Lock, CreditCard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import { SUBSCRIPTION_PLANS, createCheckoutSession, getSubscriptionStatus, cancelSubscription } from '@/lib/services/stripeService';

interface UserProfile {
  displayName: string;
  email: string;
  avatar?: string;
  userId: string;
}

interface Subscription {
  id: string;
  status: string;
  planId: string;
  currentPeriodEnd: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    userId: 'user_' + Math.random().toString(36).substr(2, 9), // Generate a temporary user ID
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Load user profile and subscription status
  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Error parsing user profile:', e);
      }
    }

    // Load subscription status
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const status = await getSubscriptionStatus(profile.userId);
      setSubscription(status);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
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
      localStorage.setItem('user_profile', JSON.stringify(profile));
      toast.success('Email updated successfully');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      await createCheckoutSession(planId, profile.userId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start subscription process');
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      await cancelSubscription(subscription.id);
      await loadSubscriptionStatus();
      toast.success('Subscription cancelled successfully');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
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
                Manage your account information and subscription
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
              <TabsTrigger value="subscription" className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Subscription
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

            <TabsContent value="subscription" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Subscription Plans</h3>
                  <p className="text-sm text-muted-foreground">Choose a plan that fits your needs</p>
                </div>

                {subscription && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium">Current Subscription</h4>
                    <p className="text-sm text-muted-foreground">
                      Plan: {SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId)?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {subscription.status}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 text-red-600"
                      onClick={handleCancelSubscription}
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      className="border rounded-lg p-6 space-y-4"
                    >
                      <div>
                        <h4 className="text-lg font-medium">{plan.name}</h4>
                        <p className="text-2xl font-bold">€{plan.price}/month</p>
                      </div>

                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <svg
                              className="h-4 w-4 text-green-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full"
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={subscription?.planId === plan.id}
                      >
                        {subscription?.planId === plan.id ? 'Current Plan' : 'Subscribe'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
