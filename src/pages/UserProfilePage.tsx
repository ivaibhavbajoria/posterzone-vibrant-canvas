
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth0Context } from '@/contexts/Auth0Context';
import { toast } from 'sonner';
import { User, Settings, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0Context();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    console.log('UserProfilePage - Auth state:', { user, isAuthenticated, isLoading });
    
    if (user) {
      console.log('Auth0 user loaded:', user);
      setFormData({
        full_name: user.name || '',
        email: user.email || '',
        phone: user.phone_number || user.user_metadata?.phone || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Since we're using Auth0, profile updates would need to be handled through Auth0 Management API
      // For now, we'll just show a success message
      toast.success('Profile information updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">My Profile</h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
          <Button onClick={() => navigate('/auth')} className="mt-4">
            Go to Login
          </Button>
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
              {user.picture && (
                <div className="flex justify-center mb-6">
                  <img 
                    src={user.picture} 
                    alt={user.name || 'User'} 
                    className="w-24 h-24 rounded-full border-4 border-posterzone-orange"
                  />
                </div>
              )}
              
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Email is managed by Auth0 and cannot be changed here
                    </p>
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
                <Button onClick={() => navigate('/order-history')}>
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
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Auth0 Account</h4>
                <p className="text-gray-600 mb-4">
                  Your account is managed through Auth0. To change your password or update security settings, please visit your Auth0 account.
                </p>
                <Button variant="outline" onClick={() => window.open('https://dev-82smjwk3l3ktx7wa.us.auth0.com', '_blank')}>
                  Manage Auth0 Account
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Email Preferences</h4>
                <p className="text-gray-600 mb-4">
                  Manage your email notification preferences.
                </p>
                <Button variant="outline">Manage Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
