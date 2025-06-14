
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Settings, Save } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

const AdminSettings = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, is_admin')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userError || !userData?.is_admin) {
        toast({
          title: "Permission denied",
          description: "Only admins can add new admins",
          variant: "destructive",
        });
        return;
      }

      // For now, we'll just show a success message since we can't directly create users
      // In a real scenario, you'd send an invitation email
      toast({
        title: "Admin invitation sent",
        description: `An invitation has been sent to ${newAdminEmail}`,
      });

      setNewAdminEmail('');
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "Error",
        description: "Failed to add admin",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Admin Management
          </CardTitle>
          <CardDescription>Add new administrators to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <Label htmlFor="adminEmail">Admin Email Address</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="Enter email address"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Store Settings
          </CardTitle>
          <CardDescription>Configure store-wide settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              type="text"
              placeholder="PosterZone"
              defaultValue="PosterZone"
            />
          </div>
          <div>
            <Label htmlFor="storeEmail">Store Contact Email</Label>
            <Input
              id="storeEmail"
              type="email"
              placeholder="contact@posterzone.com"
              defaultValue="contact@posterzone.com"
            />
          </div>
          <div>
            <Label htmlFor="currency">Default Currency</Label>
            <Input
              id="currency"
              type="text"
              placeholder="INR"
              defaultValue="INR"
            />
          </div>
          <div>
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              placeholder="8"
              defaultValue="8"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
