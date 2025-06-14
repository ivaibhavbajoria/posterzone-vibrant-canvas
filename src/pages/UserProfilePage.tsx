
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Settings, History } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  is_admin: boolean;
}

const UserProfilePage = () => {
  const { user, profile, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: ''
  });

  useEffect(() => {
    if (profile) {
      console.log('Profile loaded:', profile);
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zip_code: profile.zip_code || '',
        phone: profile.phone || ''
      });
      setIsLoading(false);
    } else if (user) {
      console.log('User exists but no profile, creating default form data');
      setFormData({
        full_name: user.user_metadata?.full_name || '',
        username: user.email?.split('@')[0] || '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        phone: ''
      });
      setIsLoading(false);
    }
  }, [profile, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    console.log('Updating profile with data:', formData);
    setIsUpdating(true);
    
    try {
      const updateData = {
        full_name: formData.full_name || null,
        username: formData.username || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        zip_code: formData.zip_code || null,
        phone: formData.phone || null,
        updated_at: new Date().toISOString()
      };

      console.log('Sending update to Supabase:', updateData);

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Check if it's a profile not found error and try to create one
      if (error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile...');
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: formData.full_name || null,
              username: formData.username || null,
              address: formData.address || null,
              city: formData.city || null,
              state: formData.state || null,
              zip_code: formData.zip_code || null,
              phone: formData.phone || null
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            throw createError;
          }

          console.log('Profile created successfully:', newProfile);
          toast.success('Profile created successfully!');
        } catch (createError: any) {
          console.error('Failed to create profile:', createError);
          toast.error(`Failed to create profile: ${createError.message}`);
        }
      } else {
        toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-posterzone-orange mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Order History
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Email cannot be changed from here
                  </p>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter your state"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                      placeholder="Enter your ZIP code"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Order History</h3>
                <p className="text-gray-600 mb-4">
                  View your complete order history and track current orders.
                </p>
                <Button onClick={() => window.location.href = '/order-history'}>
                  View Order History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAdmin && (
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-semibold mb-2 text-blue-800">Admin Access</h4>
                  <p className="text-blue-600 mb-4">
                    You have administrator privileges. Access the admin panel to manage the store.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/admin'}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Go to Admin Panel
                  </Button>
                </div>
              )}

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Change Password</h4>
                <p className="text-gray-600 mb-4">
                  Update your password to keep your account secure.
                </p>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Email Preferences</h4>
                <p className="text-gray-600 mb-4">
                  Manage your email notification preferences.
                </p>
                <Button variant="outline">Manage Preferences</Button>
              </div>

              <div className="border rounded-lg p-4 border-red-200 bg-red-50">
                <h4 className="font-semibold mb-2 text-red-800">Delete Account</h4>
                <p className="text-red-600 mb-4">
                  Permanently delete your account and all associated data.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
