import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Settings, Save, Trash2, Eye, EyeOff, Shield, Store, Mail, Phone, MapPin, DollarSign, Percent, Truck, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminCredential {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

interface StoreSettings {
  id: string;
  store_name: string;
  store_email: string;
  store_phone: string | null;
  store_address: string | null;
  currency: string;
  tax_rate: number;
  shipping_cost: number;
  free_shipping_threshold: number;
  email_notifications: boolean;
  sms_notifications: boolean;
  maintenance_mode: boolean;
}

const AdminSettings = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminFullName, setNewAdminFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredential[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    fetchAdminCredentials();
    fetchStoreSettings();
  }, []);

  const fetchAdminCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_credentials')
        .select('id, email, full_name, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin credentials:', error);
        toast.error('Failed to load admin credentials');
        return;
      }

      setAdminCredentials(data || []);
    } catch (error) {
      console.error('Error fetching admin credentials:', error);
      toast.error('Failed to load admin credentials');
    }
  };

  const fetchStoreSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching store settings:', error);
        toast.error('Failed to load store settings');
        return;
      }

      setStoreSettings(data);
    } catch (error) {
      console.error('Error fetching store settings:', error);
      toast.error('Failed to load store settings');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!newAdminEmail || !newAdminPassword) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Hash the password using the database function
      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_password', { password: newAdminPassword });

      if (hashError) {
        console.error('Error hashing password:', hashError);
        toast.error('Failed to secure password');
        return;
      }

      // Insert new admin credentials
      const { error: insertError } = await supabase
        .from('admin_credentials')
        .insert({
          email: newAdminEmail,
          password_hash: hashedPassword,
          full_name: newAdminFullName || null,
        });

      if (insertError) {
        console.error('Error adding admin:', insertError);
        if (insertError.code === '23505') {
          toast.error('An admin with this email already exists');
        } else {
          toast.error('Failed to add admin');
        }
        return;
      }

      toast.success(`Admin ${newAdminEmail} has been added successfully`);
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminFullName('');
      fetchAdminCredentials();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Failed to add admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_credentials')
        .update({ is_active: !currentStatus })
        .eq('id', adminId);

      if (error) {
        console.error('Error updating admin status:', error);
        toast.error('Failed to update admin status');
        return;
      }

      toast.success(`Admin ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchAdminCredentials();
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error('Failed to update admin status');
    }
  };

  const handleDeleteAdmin = async (adminId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete admin: ${email}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_credentials')
        .delete()
        .eq('id', adminId);

      if (error) {
        console.error('Error deleting admin:', error);
        toast.error('Failed to delete admin');
        return;
      }

      toast.success(`Admin ${email} has been deleted successfully`);
      fetchAdminCredentials();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error('Failed to delete admin');
    }
  };

  const handleSaveStoreSettings = async () => {
    if (!storeSettings) return;
    
    setSettingsLoading(true);

    try {
      const { error } = await supabase
        .from('store_settings')
        .update({
          store_name: storeSettings.store_name,
          store_email: storeSettings.store_email,
          store_phone: storeSettings.store_phone,
          store_address: storeSettings.store_address,
          currency: storeSettings.currency,
          tax_rate: storeSettings.tax_rate,
          shipping_cost: storeSettings.shipping_cost,
          free_shipping_threshold: storeSettings.free_shipping_threshold,
          email_notifications: storeSettings.email_notifications,
          sms_notifications: storeSettings.sms_notifications,
          maintenance_mode: storeSettings.maintenance_mode,
        })
        .eq('id', storeSettings.id);

      if (error) {
        console.error('Error saving store settings:', error);
        toast.error('Failed to save store settings');
        return;
      }

      toast.success('Store settings saved successfully!');
    } catch (error) {
      console.error('Error saving store settings:', error);
      toast.error('Failed to save store settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Admin Management
          </CardTitle>
          <CardDescription>Add new administrators and manage existing ones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Admin Form */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Add New Admin
            </h3>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminEmail">Email Address *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@example.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="adminFullName">Full Name</Label>
                  <Input
                    id="adminFullName"
                    type="text"
                    placeholder="John Doe"
                    value={newAdminFullName}
                    onChange={(e) => setNewAdminFullName(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="adminPassword">Password *</Label>
                <div className="relative">
                  <Input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter secure password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? 'Adding Admin...' : 'Add Admin'}
              </Button>
            </form>
          </div>

          {/* Existing Admins List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Existing Admins</h3>
            <div className="space-y-3">
              {adminCredentials.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex-1">
                    <div className="font-medium">{admin.email}</div>
                    {admin.full_name && (
                      <div className="text-sm text-gray-600">{admin.full_name}</div>
                    )}
                    <div className="text-xs text-gray-500">
                      Added: {new Date(admin.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      admin.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAdminStatus(admin.id, admin.is_active)}
                    >
                      {admin.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {adminCredentials.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No admin credentials found
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Store Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Configuration
          </CardTitle>
          <CardDescription>Configure your store settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {storeSettings ? (
            <>
              {/* Basic Store Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={storeSettings.store_name}
                      onChange={(e) => setStoreSettings({...storeSettings, store_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeEmail">Store Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={storeSettings.store_email}
                      onChange={(e) => setStoreSettings({...storeSettings, store_email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="storePhone">Store Phone</Label>
                    <Input
                      id="storePhone"
                      value={storeSettings.store_phone || ''}
                      onChange={(e) => setStoreSettings({...storeSettings, store_phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={storeSettings.currency} 
                      onValueChange={(value) => setStoreSettings({...storeSettings, currency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    value={storeSettings.store_address || ''}
                    onChange={(e) => setStoreSettings({...storeSettings, store_address: e.target.value})}
                    placeholder="Enter your store's physical address"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Financial Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={storeSettings.tax_rate}
                      onChange={(e) => setStoreSettings({...storeSettings, tax_rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingCost">Shipping Cost</Label>
                    <Input
                      id="shippingCost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={storeSettings.shipping_cost}
                      onChange={(e) => setStoreSettings({...storeSettings, shipping_cost: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      step="0.01"
                      min="0"
                      value={storeSettings.free_shipping_threshold}
                      onChange={(e) => setStoreSettings({...storeSettings, free_shipping_threshold: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notification Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notification Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive order and customer notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={storeSettings.email_notifications}
                      onCheckedChange={(checked) => setStoreSettings({...storeSettings, email_notifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Receive urgent notifications via SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={storeSettings.sms_notifications}
                      onCheckedChange={(checked) => setStoreSettings({...storeSettings, sms_notifications: checked})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* System Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  System Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Enable this to put your store in maintenance mode</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={storeSettings.maintenance_mode}
                      onCheckedChange={(checked) => setStoreSettings({...storeSettings, maintenance_mode: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSaveStoreSettings} 
                  disabled={settingsLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {settingsLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading store settings...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
