'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Bell, 
  Shield, 
  CreditCard,
  Settings,
  AlertCircle,
  Check,
  Trash2
} from 'lucide-react';
import { authApi, User as UserType, UserProfile, UserWithProfile } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function ProfileSettings() {
  const { user: currentUser, login } = useAuth();
  const [userProfile, setUserProfile] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();

  // Form states
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    profile_picture: '',
  });

  const [profileForm, setProfileForm] = useState({
    bio: '',
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'en',
    currency: 'USD',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_deals: true,
    email_price_drops: true,
    email_newsletters: false,
    push_deals: true,
    push_price_drops: true,
    sms_alerts: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'private',
    share_wishlist: false,
    share_purchase_history: false,
    marketing_emails: false,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await authApi.getCurrentUserWithProfile();
      if (profile) {
        setUserProfile(profile);
        
        // Populate user form
        setUserForm({
          username: profile.user.username || '',
          email: profile.user.email || '',
          first_name: profile.user.first_name || '',
          last_name: profile.user.last_name || '',
          phone: profile.user.phone || '',
          profile_picture: profile.user.profile_picture || '',
        });

        // Populate profile form
        if (profile.profile) {
          setProfileForm({
            bio: profile.profile.bio || '',
            location: profile.profile.location || '',
            timezone: profile.profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: profile.profile.language || 'en',
            currency: profile.profile.currency || 'USD',
          });

          // Parse notification preferences
          if (profile.profile.notification_preferences) {
            setNotificationSettings({
              ...notificationSettings,
              ...profile.profile.notification_preferences,
            });
          }

          // Parse privacy settings
          if (profile.profile.privacy_settings) {
            setPrivacySettings({
              ...privacySettings,
              ...profile.profile.privacy_settings,
            });
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    setSaving(true);
    try {
      const updatedUser = await authApi.updateUser(userForm);
      
      // Update auth context
      if (currentUser) {
        const token = authApi.getToken();
        if (token) {
          await login(token);
        } else {
          toast({
            title: 'Error',
            description: 'Authentication token missing. Please log in again.',
            variant: 'destructive',
          });
          setSaving(false);
          return;
        }
      }
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const profileData = {
        ...profileForm,
        notification_preferences: notificationSettings,
        privacy_settings: privacySettings,
      };
      
      await authApi.updateProfile(profileData);
      await loadUserProfile(); // Reload to get updated data
      
      toast({
        title: 'Success',
        description: 'Settings updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    try {
      await authApi.deleteAccount();
      authApi.clearToken();
      window.location.href = '/';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          {userProfile?.user.subscription_tier || 'Free'}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userForm.profile_picture} />
                  <AvatarFallback>
                    {(userForm.first_name?.[0] || '') + (userForm.last_name?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="profile_picture">Profile Picture URL</Label>
                  <Input
                    id="profile_picture"
                    value={userForm.profile_picture}
                    onChange={(e) => setUserForm({ ...userForm, profile_picture: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={userForm.first_name}
                    onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={userForm.last_name}
                    onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <Button onClick={handleUpdateUser} disabled={saving}>
                {saving ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                App Preferences
              </CardTitle>
              <CardDescription>
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={profileForm.timezone} 
                    onValueChange={(value) => setProfileForm({ ...profileForm, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      <SelectItem value="Asia/Kolkata">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={profileForm.language} 
                    onValueChange={(value) => setProfileForm({ ...profileForm, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={profileForm.currency} 
                    onValueChange={(value) => setProfileForm({ ...profileForm, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleUpdateProfile} disabled={saving}>
                {saving ? 'Updating...' : 'Update Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email_deals">Deal alerts</Label>
                    <Switch
                      id="email_deals"
                      checked={notificationSettings.email_deals}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, email_deals: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email_price_drops">Price drop alerts</Label>
                    <Switch
                      id="email_price_drops"
                      checked={notificationSettings.email_price_drops}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, email_price_drops: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email_newsletters">Newsletters</Label>
                    <Switch
                      id="email_newsletters"
                      checked={notificationSettings.email_newsletters}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, email_newsletters: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push_deals">Deal alerts</Label>
                    <Switch
                      id="push_deals"
                      checked={notificationSettings.push_deals}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, push_deals: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push_price_drops">Price drop alerts</Label>
                    <Switch
                      id="push_price_drops"
                      checked={notificationSettings.push_price_drops}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, push_price_drops: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleUpdateProfile} disabled={saving}>
                {saving ? 'Updating...' : 'Update Notifications'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your privacy and data sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile_visibility">Profile Visibility</Label>
                  <Select 
                    value={privacySettings.profile_visibility} 
                    onValueChange={(value) => setPrivacySettings({ ...privacySettings, profile_visibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="share_wishlist">Share wishlist publicly</Label>
                    <Switch
                      id="share_wishlist"
                      checked={privacySettings.share_wishlist}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({ ...privacySettings, share_wishlist: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="share_purchase_history">Share purchase history</Label>
                    <Switch
                      id="share_purchase_history"
                      checked={privacySettings.share_purchase_history}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({ ...privacySettings, share_purchase_history: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing_emails">Receive marketing emails</Label>
                    <Switch
                      id="marketing_emails"
                      checked={privacySettings.marketing_emails}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({ ...privacySettings, marketing_emails: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleUpdateProfile} disabled={saving}>
                {saving ? 'Updating...' : 'Update Privacy Settings'}
              </Button>

              <Separator />

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Permanently delete your account and all data.</p>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleDeleteAccount}
                      className="mt-2"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
