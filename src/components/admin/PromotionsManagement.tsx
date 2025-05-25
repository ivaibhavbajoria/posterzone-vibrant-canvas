
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, CalendarIcon, Percent, Gift, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
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

const PromotionsManagement = () => {
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage' as const,
    value: 0,
    min_order_amount: 0,
    max_uses: null as number | null,
    expires_at: null as Date | null,
    is_active: true
  });

  const [newBundle, setNewBundle] = useState({
    name: '',
    min_quantity: 0,
    discount_percentage: 0,
    is_active: true
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [isBundleDialogOpen, setIsBundleDialogOpen] = useState(false);
  const [isEditCouponDialogOpen, setIsEditCouponDialogOpen] = useState(false);
  const [isEditBundleDialogOpen, setIsEditBundleDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch coupons
  const { data: coupons = [], isLoading: isLoadingCoupons } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as Coupon[];
    }
  });

  // Fetch bundles
  const { data: bundles = [], isLoading: isLoadingBundles } = useQuery({
    queryKey: ['bundles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as Bundle[];
    }
  });

  // Create coupon mutation
  const createCouponMutation = useMutation({
    mutationFn: async (couponData: typeof newCoupon) => {
      const { data, error } = await supabase
        .from('coupons')
        .insert([{
          ...couponData,
          expires_at: couponData.expires_at?.toISOString() || null
        }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon created successfully!');
      setNewCoupon({
        code: '',
        type: 'percentage',
        value: 0,
        min_order_amount: 0,
        max_uses: null,
        expires_at: null,
        is_active: true
      });
      setIsCouponDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to create coupon: ${error.message}`);
    },
  });

  // Create bundle mutation
  const createBundleMutation = useMutation({
    mutationFn: async (bundleData: typeof newBundle) => {
      const { data, error } = await supabase
        .from('bundles')
        .insert([bundleData])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success('Bundle created successfully!');
      setNewBundle({
        name: '',
        min_quantity: 0,
        discount_percentage: 0,
        is_active: true
      });
      setIsBundleDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to create bundle: ${error.message}`);
    },
  });

  // Update coupon mutation
  const updateCouponMutation = useMutation({
    mutationFn: async (coupon: Coupon) => {
      const { data, error } = await supabase
        .from('coupons')
        .update(coupon)
        .eq('id', coupon.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon updated successfully!');
      setIsEditCouponDialogOpen(false);
      setSelectedCoupon(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to update coupon: ${error.message}`);
    },
  });

  // Update bundle mutation
  const updateBundleMutation = useMutation({
    mutationFn: async (bundle: Bundle) => {
      const { data, error } = await supabase
        .from('bundles')
        .update(bundle)
        .eq('id', bundle.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success('Bundle updated successfully!');
      setIsEditBundleDialogOpen(false);
      setSelectedBundle(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to update bundle: ${error.message}`);
    },
  });

  // Delete coupon mutation
  const deleteCouponMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete coupon: ${error.message}`);
    },
  });

  // Delete bundle mutation
  const deleteBundleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bundles')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success('Bundle deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete bundle: ${error.message}`);
    },
  });

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) {
      toast.error('Please fill in all required fields.');
      return;
    }
    createCouponMutation.mutate(newCoupon);
  };

  const handleCreateBundle = () => {
    if (!newBundle.name || !newBundle.min_quantity || !newBundle.discount_percentage) {
      toast.error('Please fill in all required fields.');
      return;
    }
    createBundleMutation.mutate(newBundle);
  };

  const activeCoupons = coupons.filter(coupon => coupon.is_active);
  const activeBundles = bundles.filter(bundle => bundle.is_active);

  if (isLoadingCoupons || isLoadingBundles) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Promotions Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCoupons.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bundles</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBundles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bundles</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bundles.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="coupons" className="w-full">
        <TabsList>
          <TabsTrigger value="coupons">Coupon Codes</TabsTrigger>
          <TabsTrigger value="bundles">Bundle Offers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coupons" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Coupon Management</h2>
            <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Coupon
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Coupon</DialogTitle>
                  <DialogDescription>
                    Create a new discount coupon for customers.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="coupon-code">Coupon Code *</Label>
                    <Input
                      id="coupon-code"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., SAVE20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discount-type">Discount Type</Label>
                      <Select value={newCoupon.type} onValueChange={(value: 'percentage' | 'fixed') => setNewCoupon({ ...newCoupon, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="discount-value">Discount Value *</Label>
                      <Input
                        type="number"
                        id="discount-value"
                        value={newCoupon.value}
                        onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                        placeholder={newCoupon.type === 'percentage' ? '20' : '100'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-order">Minimum Order Amount (₹)</Label>
                      <Input
                        type="number"
                        id="min-order"
                        value={newCoupon.min_order_amount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: Number(e.target.value) })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="max-uses">Maximum Uses</Label>
                      <Input
                        type="number"
                        id="max-uses"
                        value={newCoupon.max_uses || ''}
                        onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: e.target.value ? Number(e.target.value) : null })}
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Expiry Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newCoupon.expires_at ? format(newCoupon.expires_at, 'PPP') : "No expiry"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newCoupon.expires_at || undefined}
                          onSelect={(date) => setNewCoupon({ ...newCoupon, expires_at: date || null })}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newCoupon.is_active}
                      onCheckedChange={(checked) => setNewCoupon({ ...newCoupon, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                <Button onClick={handleCreateCoupon} disabled={createCouponMutation.isPending}>
                  {createCouponMutation.isPending ? 'Creating...' : 'Create Coupon'}
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Coupons Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {coupon.type === 'percentage' ? 'Percentage' : 'Fixed'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                    </TableCell>
                    <TableCell>₹{coupon.min_order_amount}</TableCell>
                    <TableCell>
                      {coupon.current_uses}/{coupon.max_uses || '∞'}
                    </TableCell>
                    <TableCell>
                      {coupon.expires_at 
                        ? format(new Date(coupon.expires_at), 'MMM dd, yyyy')
                        : 'No expiry'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setIsEditCouponDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCouponMutation.mutate(coupon.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="bundles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Bundle Management</h2>
            <Dialog open={isBundleDialogOpen} onOpenChange={setIsBundleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bundle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Bundle</DialogTitle>
                  <DialogDescription>
                    Create a quantity-based discount bundle.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="bundle-name">Bundle Name *</Label>
                    <Input
                      id="bundle-name"
                      value={newBundle.name}
                      onChange={(e) => setNewBundle({ ...newBundle, name: e.target.value })}
                      placeholder="e.g., Large Bundle Deal"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-quantity">Minimum Quantity *</Label>
                      <Input
                        type="number"
                        id="min-quantity"
                        value={newBundle.min_quantity}
                        onChange={(e) => setNewBundle({ ...newBundle, min_quantity: Number(e.target.value) })}
                        placeholder="20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="discount-percentage">Discount Percentage *</Label>
                      <Input
                        type="number"
                        id="discount-percentage"
                        value={newBundle.discount_percentage}
                        onChange={(e) => setNewBundle({ ...newBundle, discount_percentage: Number(e.target.value) })}
                        placeholder="20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newBundle.is_active}
                      onCheckedChange={(checked) => setNewBundle({ ...newBundle, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                <Button onClick={handleCreateBundle} disabled={createBundleMutation.isPending}>
                  {createBundleMutation.isPending ? 'Creating...' : 'Create Bundle'}
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Bundles Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bundle Name</TableHead>
                  <TableHead>Min Quantity</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bundles.map((bundle) => (
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
                      {format(new Date(bundle.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBundle(bundle);
                            setIsEditBundleDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteBundleMutation.mutate(bundle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Coupon Dialog */}
      <Dialog open={isEditCouponDialogOpen} onOpenChange={setIsEditCouponDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          {selectedCoupon && (
            <div className="grid gap-4 py-4">
              <div>
                <Label>Coupon Code</Label>
                <Input
                  value={selectedCoupon.code}
                  onChange={(e) => setSelectedCoupon({ ...selectedCoupon, code: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedCoupon.is_active}
                  onCheckedChange={(checked) => setSelectedCoupon({ ...selectedCoupon, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={() => updateCouponMutation.mutate(selectedCoupon)}>
                Update Coupon
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Bundle Dialog */}
      <Dialog open={isEditBundleDialogOpen} onOpenChange={setIsEditBundleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bundle</DialogTitle>
          </DialogHeader>
          {selectedBundle && (
            <div className="grid gap-4 py-4">
              <div>
                <Label>Bundle Name</Label>
                <Input
                  value={selectedBundle.name}
                  onChange={(e) => setSelectedBundle({ ...selectedBundle, name: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedBundle.is_active}
                  onCheckedChange={(checked) => setSelectedBundle({ ...selectedBundle, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={() => updateBundleMutation.mutate(selectedBundle)}>
                Update Bundle
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionsManagement;
