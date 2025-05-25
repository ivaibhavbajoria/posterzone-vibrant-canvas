
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Package, ShoppingCart, TrendingUp, BarChart3, Gift } from 'lucide-react';
import DashboardCharts from '@/components/DashboardCharts';
import PosterManagement from '@/components/admin/PosterManagement';
import CustomerManagement from '@/components/admin/CustomerManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import PromotionsManagement from '@/components/admin/PromotionsManagement';
import { initializeRealtime } from '@/integrations/supabase/setup-realtime';
import { supabase } from '@/integrations/supabase/client';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statsData, setStatsData] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    posters: 0
  });

  useEffect(() => {
    // Initialize realtime subscriptions
    initializeRealtime();
    
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);
  
  const fetchDashboardStats = async () => {
    try {
      // Fetch revenue data
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('total');
      
      // Fetch customer count
      const { count: customerCount, error: customerError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
        
      // Fetch poster count
      const { count: posterCount, error: posterError } = await supabase
        .from('posters')
        .select('id', { count: 'exact', head: true });
      
      if (!orderError && !customerError && !posterError) {
        const totalRevenue = orderData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
        
        setStatsData({
          revenue: totalRevenue,
          orders: orderData?.length || 0,
          customers: customerCount || 0,
          posters: posterCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your poster store from here</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="posters" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Posters
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Promotions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{statsData.revenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">From {statsData.orders} orders</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsData.orders}</div>
                    <p className="text-xs text-muted-foreground">Total orders placed</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsData.customers}</div>
                    <p className="text-xs text-muted-foreground">Registered users</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Posters</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsData.posters}</div>
                    <p className="text-xs text-muted-foreground">Total posters available</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>A comprehensive view of your store's performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <DashboardCharts />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="posters">
              <PosterManagement />
            </TabsContent>

            <TabsContent value="orders">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="customers">
              <CustomerManagement />
            </TabsContent>

            <TabsContent value="promotions">
              <PromotionsManagement />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reports</CardTitle>
                  <CardDescription>Detailed analytics and reporting tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <DashboardCharts />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
