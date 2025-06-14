import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, Gift, Package } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

// Type definitions
type CouponType = 'percentage' | 'fixed';

interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

interface Bundle {
  id: string;
  name: string;
  min_quantity: number;
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
}

interface CouponFormData {
  code: string;
  type: CouponType;
  value: string;
  min_order_amount: string;
  max_uses: string;
  expires_at: string;
  is_active: boolean;
}

interface BundleFormData {
  name: string;
  min_quantity: string;
  discount_percentage: string;
  is_active: boolean;
}

const PromotionsManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [isBundleDialogOpen, setIsBundleDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingCoupons, setFetchingCoupons] = useState(true);
  const [fetchingBundles, setFetchingBundles] = useState(true);
  
  const [couponFormData, setCouponFormData] = useState<CouponFormData>({
    code: '',
    type: 'percentage',
    value: '',
    min_order_amount: '0',
    max_uses: '',
    expires_at: '',
    is_active: true
  });

  const [bundleFormData, setBundleFormData] = useState<BundleFormData>({
    name: '',
    min_quantity: '',
    discount_percentage: '',
    is_active: true
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user for promotions management:', user);
      if (!user) {
        toast.error("Authentication error: You are not logged in.");
      } else {
        console.log('Authenticated user email:', user.email);
        if (user.email !== 'vaibhavbajoria03@gmail.com') {
          toast.warning("You are not authorized as an admin. Please log in with the admin account.");
        }
      }
    };
    checkUser();

    console.log('PromotionsManagement: Initializing...');
    fetchCoupons();
    fetchBundles();

    // Set up real-time subscriptions
    const couponsChannel = supabase
      .channel('coupons_realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'coupons' }, 
        (payload) => {
          console.log('Coupons realtime update:', payload);
          fetchCoupons();
        }
      )
      .subscribe((status) => {
        console.log('Coupons channel status:', status);
      });

    const bundlesChannel = supabase
      .channel('bundles_realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bundles' }, 
        (payload) => {
          console.log('Bundles realtime update:', payload);
          fetchBundles();
        }
      )
      .subscribe((status) => {
        console.log('Bundles channel status:', status);
      });

    return () => {
      console.log('PromotionsManagement: Cleaning up channels...');
      supabase.removeChannel(couponsChannel);
      supabase.removeChannel(bundlesChannel);
    };
  }, []);

  const fetchCoupons = async () => {
    try {
      setFetchingCoupons(true);
      console.log('Fetching coupons...');
      
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching coupons:', error);
        toast.error(`Failed to fetch coupons: ${error.message}`);
        return;
      }
      
      console.log('Coupons fetched successfully:', data);
      
      // Type assertion to ensure proper typing
      const typedCoupons = (data || []).map(coupon => ({
        ...coupon,
        type: coupon.type as CouponType
      }));
      
      setCoupons(typedCoupons);
    } catch (error: any) {
      console.error('Unexpected error fetching coupons:', error);
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setFetchingCoupons(false);
    }
  };

  const fetchBundles = async () => {
    try {
      setFetchingBundles(true);
      console.log('Fetching bundles...');
      
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bundles:', error);
        toast.error(`Failed to fetch bundles: ${error.message}`);
        return;
      }
      
      console.log('Bundles fetched successfully:', data);
      setBundles(data || []);
    } catch (error: any) {
      console.error('Unexpected error fetching bundles:', error);
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setFetchingBundles(false);
    }
  };

  const handleCouponInputChange = (field: keyof CouponFormData, value: any) => {
    setCouponFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBundleInputChange = (field: keyof BundleFormData, value: any) => {
    setBundleFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCouponSubmit = async () => {
    if (!couponFormData.code || !couponFormData.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const couponData = {
        code: couponFormData.code.toUpperCase(),
        type: couponFormData.type,
        value: parseFloat(couponFormData.value),
        min_order_amount: parseFloat(couponFormData.min_order_amount) || 0,
        max_uses: couponFormData.max_uses ? parseInt(couponFormData.max_uses) : null,
        expires_at: couponFormData.expires_at || null,
        is_active: couponFormData.is_active,
        current_uses: 0
      };

      console.log('Submitting coupon data:', couponData);

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);
        
        if (error) {
          console.error('Coupon update error:', error);
          throw error;
        }
        toast.success('Coupon updated successfully');
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([couponData]);
        
        if (error) {
          console.error('Coupon creation error:', error);
          throw error;
        }
        toast.success('Coupon created successfully');
      }

      resetCouponForm();
      setIsCouponDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast.error(`Failed to save coupon: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBundleSubmit = async () => {
    if (!bundleFormData.name || !bundleFormData.min_quantity || !bundleFormData.discount_percentage) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const bundleData = {
        name: bundleFormData.name,
        min_quantity: parseInt(bundleFormData.min_quantity),
        discount_percentage: parseFloat(bundleFormData.discount_percentage),
        is_active: bundleFormData.is_active
      };

      console.log('Submitting bundle data:', bundleData);

      if (editingBundle) {
        const { error } = await supabase
          .from('bundles')
          .update(bundleData)
          .eq('id', editingBundle.id);
        
        if (error) {
          console.error('Bundle update error:', error);
          throw error;
        }
        toast.success('Bundle updated successfully');
      } else {
        const { error } = await supabase
          .from('bundles')
          .insert([bundleData]);
        
        if (error) {
          console.error('Bundle creation error:', error);
          throw error;
        }
        toast.success('Bundle created successfully');
      }

      resetBundleForm();
      setIsBundleDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving bundle:', error);
      toast.error(`Failed to save bundle: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      min_order_amount: coupon.min_order_amount.toString(),
      max_uses: coupon.max_uses?.toString() || '',
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
      is_active: coupon.is_active
    });
    setIsCouponDialogOpen(true);
  };

  const handleEditBundle = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setBundleFormData({
      name: bundle.name,
      min_quantity: bundle.min_quantity.toString(),
      discount_percentage: bundle.discount_percentage.toString(),
      is_active: bundle.is_active
    });
    setIsBundleDialogOpen(true);
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Coupon deleted successfully');
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast.error(`Failed to delete coupon: ${error.message}`);
    }
  };

  const handleDeleteBundle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;

    try {
      const { error } = await supabase
        .from('bundles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Bundle deleted successfully');
    } catch (error: any) {
      console.error('Error deleting bundle:', error);
      toast.error(`Failed to delete bundle: ${error.message}`);
    }
  };

  const resetCouponForm = () => {
    setCouponFormData({
      code: '',
      type: 'percentage',
      value: '',
      min_order_amount: '0',
      max_uses: '',
      expires_at: '',
      is_active: true
    });
    setEditingCoupon(null);
  };

  const resetBundleForm = () => {
    setBundleFormData({
      name: '',
      min_quantity: '',
      discount_percentage: '',
      is_active: true
    });
    setEditingBundle(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Promotions Management</CardTitle>
          <CardDescription>Manage discount coupons and bundle offers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="coupons" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="coupons" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Coupon Codes
              </TabsTrigger>
              <TabsTrigger value="bundles" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Bundle Offers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="coupons" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Coupon Codes</h3>
                <Dialog open={isCouponDialogOpen} onOpenChange={(open) => {
                  setIsCouponDialogOpen(open);
                  if (!open) resetCouponForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Coupon
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingCoupon ? 'Update coupon details' : 'Create a new discount coupon code'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="coupon-code">Coupon Code *</Label>
                          <Input
                            id="coupon-code"
                            value={couponFormData.code}
                            onChange={(e) => handleCouponInputChange('code', e.target.value.toUpperCase())}
                            placeholder="e.g., SAVE20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="coupon-type">Discount Type</Label>
                          <Select 
                            value={couponFormData.type} 
                            onValueChange={(value: CouponType) => handleCouponInputChange('type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage (%)</SelectItem>
                              <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="coupon-value">
                            Discount Value * {couponFormData.type === 'percentage' ? '(%)' : '(₹)'}
                          </Label>
                          <Input
                            id="coupon-value"
                            type="number"
                            value={couponFormData.value}
                            onChange={(e) => handleCouponInputChange('value', e.target.value)}
                            placeholder={couponFormData.type === 'percentage' ? '20' : '100'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="min-order">Minimum Order Amount (₹)</Label>
                          <Input
                            id="min-order"
                            type="number"
                            value={couponFormData.min_order_amount}
                            onChange={(e) => handleCouponInputChange('min_order_amount', e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="max-uses">Max Uses (optional)</Label>
                          <Input
                            id="max-uses"
                            type="number"
                            value={couponFormData.max_uses}
                            onChange={(e) => handleCouponInputChange('max_uses', e.target.value)}
                            placeholder="Leave empty for unlimited"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expires-at">Expiry Date (optional)</Label>
                          <Input
                            id="expires-at"
                            type="date"
                            value={couponFormData.expires_at}
                            onChange={(e) => handleCouponInputChange('expires_at', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="coupon-active"
                          checked={couponFormData.is_active}
                          onCheckedChange={(checked) => handleCouponInputChange('is_active', checked)}
                        />
                        <Label htmlFor="coupon-active">Active</Label>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCouponDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCouponSubmit} disabled={isLoading}>
                        {isLoading ? 'Saving...' : editingCoupon ? 'Update' : 'Create'} Coupon
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {fetchingCoupons ? (
                <div className="text-center py-8">
                  <p>Loading coupons...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Min Order</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No coupons found. Create your first coupon!
                        </TableCell>
                      </TableRow>
                    ) : (
                      coupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                          <TableCell>
                            {coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                          </TableCell>
                          <TableCell>
                            {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                          </TableCell>
                          <TableCell>₹{coupon.min_order_amount}</TableCell>
                          <TableCell>
                            {coupon.current_uses}/{coupon.max_uses || '∞'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                              {coupon.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCoupon(coupon)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCoupon(coupon.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="bundles" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Bundle Offers</h3>
                <Dialog open={isBundleDialogOpen} onOpenChange={(open) => {
                  setIsBundleDialogOpen(open);
                  if (!open) resetBundleForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bundle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingBundle ? 'Edit Bundle' : 'Create New Bundle'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingBundle ? 'Update bundle details' : 'Create a new quantity-based discount bundle'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="bundle-name">Bundle Name *</Label>
                        <Input
                          id="bundle-name"
                          value={bundleFormData.name}
                          onChange={(e) => handleBundleInputChange('name', e.target.value)}
                          placeholder="e.g., Small Bundle"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="min-quantity">Minimum Quantity *</Label>
                          <Input
                            id="min-quantity"
                            type="number"
                            value={bundleFormData.min_quantity}
                            onChange={(e) => handleBundleInputChange('min_quantity', e.target.value)}
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="discount-percentage">Discount Percentage (%) *</Label>
                          <Input
                            id="discount-percentage"
                            type="number"
                            value={bundleFormData.discount_percentage}
                            onChange={(e) => handleBundleInputChange('discount_percentage', e.target.value)}
                            placeholder="10"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="bundle-active"
                          checked={bundleFormData.is_active}
                          onCheckedChange={(checked) => handleBundleInputChange('is_active', checked)}
                        />
                        <Label htmlFor="bundle-active">Active</Label>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsBundleDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBundleSubmit} disabled={isLoading}>
                        {isLoading ? 'Saving...' : editingBundle ? 'Update' : 'Create'} Bundle
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {fetchingBundles ? (
                <div className="text-center py-8">
                  <p>Loading bundles...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bundle Name</TableHead>
                      <TableHead>Min Quantity</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bundles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No bundles found. Create your first bundle!
                        </TableCell>
                      </TableRow>
                    ) : (
                      bundles.map((bundle) => (
                        <TableRow key={bundle.id}>
                          <TableCell className="font-medium">{bundle.name}</TableCell>
                          <TableCell>{bundle.min_quantity} items</TableCell>
                          <TableCell>{bundle.discount_percentage}% off</TableCell>
                          <TableCell>
                            <Badge variant={bundle.is_active ? 'default' : 'secondary'}>
                              {bundle.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditBundle(bundle)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteBundle(bundle.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionsManagement;
