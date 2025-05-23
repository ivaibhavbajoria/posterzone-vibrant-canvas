
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, User, Settings, MoreVertical, Search, Filter, Calendar, Download, 
  Printer, Eye, CheckCircle, XCircle, Users, ShoppingBag, BarChart as BarChartIcon, Bell,
  FileText, Gift, Heart, Star, Tag, PieChart as PieChartIcon, TrendingUp, UserPlus, Truck,
  Edit, Plus, Layers
} from 'lucide-react';

// Import our charts component
import { SalesBarChart, SalesLineChart, CategoryPieChart } from '@/components/DashboardCharts';
import PosterManagement from '@/components/admin/PosterManagement';
import OrderInvoice from '@/components/admin/OrderInvoice';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUpdateOrderStatusOpen, setIsUpdateOrderStatusOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [storeSettings, setStoreSettings] = useState({
    name: 'PosterZone',
    email: 'contact@posterzone.com',
    currency: 'usd'
  });
  const [newStatus, setNewStatus] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);

  // Analytics mock data
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];

  const categoryData = [
    { name: 'Abstract', value: 35 },
    { name: 'Nature', value: 25 },
    { name: 'Urban', value: 20 },
    { name: 'Vintage', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Mock data for orders
  const mockOrders = [
    {
      id: 'ORD-2023-001',
      customer: 'John Doe',
      email: 'john.doe@example.com',
      date: '2023-05-15',
      items: 3,
      total: 84.97,
      status: 'completed'
    },
    {
      id: 'ORD-2023-002',
      customer: 'Jane Smith',
      email: 'jane.smith@example.com',
      date: '2023-05-16',
      items: 2,
      total: 59.98,
      status: 'processing'
    },
    {
      id: 'ORD-2023-003',
      customer: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      date: '2023-05-17',
      items: 1,
      total: 29.99,
      status: 'shipped'
    },
    {
      id: 'ORD-2023-004',
      customer: 'Alice Williams',
      email: 'alice.williams@example.com',
      date: '2023-05-18',
      items: 4,
      total: 119.96,
      status: 'in_transit'
    },
    {
      id: 'ORD-2023-005',
      customer: 'Michael Brown',
      email: 'michael.brown@example.com',
      date: '2023-05-19',
      items: 2,
      total: 54.98,
      status: 'cancelled'
    },
    {
      id: 'ORD-2023-006',
      customer: 'Emily Davis',
      email: 'emily.davis@example.com',
      date: '2023-05-20',
      items: 3,
      total: 74.97,
      status: 'completed'
    }
  ];

  // Mock data for customers
  const mockCustomers = [
    {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      orders: 8,
      totalSpent: 547.92,
      joined: '2022-11-15',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150',
      isAdmin: false
    },
    {
      id: 'USR-002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      orders: 5,
      totalSpent: 329.85,
      joined: '2023-01-20',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isAdmin: false
    },
    {
      id: 'USR-003',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      orders: 3,
      totalSpent: 148.97,
      joined: '2023-02-05',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
      isAdmin: false
    },
    {
      id: 'USR-004',
      name: 'Admin User',
      email: 'admin@posterzone.com',
      orders: 0,
      totalSpent: 0,
      joined: '2022-10-01',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      isAdmin: true
    }
  ];

  // Mock data for promotions
  const mockPromotions = [
    {
      id: 'PROMO-001',
      name: 'Summer Sale',
      discount: '20%',
      startDate: '2023-06-01',
      endDate: '2023-06-30',
      status: 'active'
    },
    {
      id: 'PROMO-002',
      name: 'Welcome Discount',
      discount: '10%',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      status: 'active'
    },
    {
      id: 'PROMO-003',
      name: 'Black Friday',
      discount: '30%',
      startDate: '2023-11-24',
      endDate: '2023-11-27',
      status: 'scheduled'
    }
  ];

  // Mock user wishlist data
  const mockUserWishlists = {
    'USR-001': [
      { id: 'PST-001', title: 'Abstract Art Print', price: 39.99, addedDate: '2023-05-10' },
      { id: 'PST-003', title: 'Mountain Landscape', price: 49.99, addedDate: '2023-05-12' }
    ],
    'USR-002': [
      { id: 'PST-002', title: 'Minimalist City Skyline', price: 44.99, addedDate: '2023-05-15' }
    ]
  };

  // Activity feed data
  const activityFeed = [
    {
      id: 1,
      type: 'order',
      message: 'New order received',
      details: 'Order #ORD-2023-007',
      timestamp: '10 minutes ago'
    },
    {
      id: 2,
      type: 'user',
      message: 'New user registered',
      details: 'Sarah Connor',
      timestamp: '45 minutes ago'
    },
    {
      id: 3,
      type: 'stock',
      message: 'Low stock alert',
      details: 'Mountain Ranges poster is running low',
      timestamp: '2 hours ago'
    },
    {
      id: 4,
      type: 'comment',
      message: 'New review posted',
      details: '5-star review on Abstract Geometry Lines',
      timestamp: '3 hours ago'
    },
    {
      id: 5,
      type: 'order',
      message: 'Order shipped',
      details: 'Order #ORD-2023-002 has been shipped',
      timestamp: '5 hours ago'
    }
  ];

  // Tasks data
  const tasksList = [
    {
      id: 1,
      task: 'Process pending orders',
      count: 4,
      priority: 'high'
    },
    {
      id: 2,
      task: 'Respond to customer inquiries',
      count: 7,
      priority: 'medium'
    },
    {
      id: 3,
      task: 'Update product inventory',
      count: 1,
      priority: 'low'
    }
  ];

  // Filter orders based on search term and status filter
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Status badge color mapping
  const getStatusBadge = (status) => {
    const statusColors = {
      completed: "bg-green-100 text-green-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-yellow-100 text-yellow-800",
      in_transit: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    const statusLabels = {
      completed: "Completed",
      processing: "Processing",
      shipped: "Shipped",
      in_transit: "In Transit",
      cancelled: "Cancelled"
    };
    
    return (
      <Badge className={`${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {statusLabels[status] || status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Handle order status update
  const handleUpdateStatus = () => {
    console.log(`Updating order ${selectedOrder?.id} status to ${newStatus}`);
    console.log(`Additional notes: ${orderNotes}`);
    // In a real app, this would update the database
    setIsUpdateOrderStatusOpen(false);
    setNewStatus('');
    setOrderNotes('');
    // Here we would refresh data
  };

  // Handle making a user an admin
  const handleToggleAdminStatus = (user) => {
    console.log(`Toggling admin status for user ${user.id}`);
    // In a real app, this would update the user's role in the database
  };

  const handleSettingsChange = (field, value) => {
    setStoreSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 h-screen fixed">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-posterzone-charcoal">
              Poster<span className="text-posterzone-orange">Zone</span>
              <span className="ml-1 text-sm text-gray-500">Admin</span>
            </h2>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            <Button 
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveTab('dashboard')}
            >
              <PieChartIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === 'orders' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveTab('orders')}
            >
              <Package className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button 
              variant={activeTab === 'posters' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveTab('posters')}
            >
              <Layers className="mr-2 h-4 w-4" />
              Posters
            </Button>
            <Button 
              variant={activeTab === 'customers' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveTab('customers')}
            >
              <Users className="mr-2 h-4 w-4" />
              Customers
            </Button>
            <Button 
              variant={activeTab === 'promotions' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveTab('promotions')}
            >
              <Tag className="mr-2 h-4 w-4" />
              Promotions
            </Button>
            <Button 
              variant={activeTab === 'insights' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveTab('insights')}
            >
              <BarChartIcon className="mr-2 h-4 w-4" />
              Insights
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="font-medium">Admin User</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          <header className="bg-white shadow px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-posterzone-charcoal">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Welcome, Admin</span>
              </div>
            </div>
          </header>

          <main className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 md:hidden">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="posters">Posters</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              {/* Dashboard Tab */}
              <TabsContent value="dashboard">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <h3 className="text-2xl font-bold">1,284</h3>
                          </div>
                          <div className="bg-blue-100 p-3 rounded-full">
                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-500">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>+12.5% from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold">$24,389</h3>
                          </div>
                          <div className="bg-green-100 p-3 rounded-full">
                            <BarChartIcon className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-500">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>+8.2% from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Total Customers</p>
                            <h3 className="text-2xl font-bold">3,875</h3>
                          </div>
                          <div className="bg-purple-100 p-3 rounded-full">
                            <Users className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-500">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>+5.3% from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Avg. Order Value</p>
                            <h3 className="text-2xl font-bold">$42.50</h3>
                          </div>
                          <div className="bg-orange-100 p-3 rounded-full">
                            <Star className="h-6 w-6 text-orange-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-500">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>+2.1% from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts and Activity */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Sales Chart */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                          Sales Overview
                        </CardTitle>
                        <CardDescription>Monthly sales performance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <SalesLineChart data={salesData} />
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Bell className="mr-2 h-5 w-5 text-blue-500" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 max-h-80 overflow-auto">
                        {activityFeed.map(activity => (
                          <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                            <div className={`p-1.5 rounded-full ${
                              activity.type === 'order' ? 'bg-green-100 text-green-600' : 
                              activity.type === 'user' ? 'bg-blue-100 text-blue-600' : 
                              activity.type === 'stock' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {activity.type === 'order' ? <Package className="h-4 w-4" /> :
                               activity.type === 'user' ? <User className="h-4 w-4" /> :
                               activity.type === 'stock' ? <Layers className="h-4 w-4" /> :
                               <FileText className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.message}</p>
                              <p className="text-xs text-gray-500">{activity.details}</p>
                              <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bottom Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Top selling products */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Star className="mr-2 h-5 w-5 text-yellow-500" />
                          Top Selling Posters
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Poster</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Sold</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 mr-2">
                                      <img 
                                        src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52a" 
                                        alt="Abstract Geometry Lines"
                                        className="h-full w-full object-cover rounded"
                                      />
                                    </div>
                                    <span>Abstract Geometry Lines</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">$34.99</TableCell>
                                <TableCell className="text-right">1,283</TableCell>
                                <TableCell className="text-right">$44,892.17</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 mr-2">
                                      <img 
                                        src="https://images.unsplash.com/photo-1493382051629-7eb03ec93ea2" 
                                        alt="Minimalist Nature"
                                        className="h-full w-full object-cover rounded"
                                      />
                                    </div>
                                    <span>Minimalist Nature</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">$29.99</TableCell>
                                <TableCell className="text-right">956</TableCell>
                                <TableCell className="text-right">$28,670.44</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 mr-2">
                                      <img 
                                        src="https://images.unsplash.com/photo-1536440136630-a8c3a9f3aee7" 
                                        alt="Vintage Cinema Poster"
                                        className="h-full w-full object-cover rounded"
                                      />
                                    </div>
                                    <span>Vintage Cinema Poster</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">$39.99</TableCell>
                                <TableCell className="text-right">892</TableCell>
                                <TableCell className="text-right">$35,671.08</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Category Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PieChartIcon className="mr-2 h-5 w-5 text-indigo-500" />
                          Category Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-60">
                          <CategoryPieChart data={categoryData} colors={COLORS} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tasks and Notifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                          Pending Tasks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {tasksList.map(task => (
                            <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                              <div className="flex items-center">
                                <div className={`h-2 w-2 rounded-full mr-3 ${
                                  task.priority === 'high' ? 'bg-red-500' : 
                                  task.priority === 'medium' ? 'bg-yellow-500' : 
                                  'bg-green-500'
                                }`}></div>
                                <span>{task.task}</span>
                              </div>
                              <Badge variant="outline">
                                {task.count} {task.count === 1 ? 'item' : 'items'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Package className="mr-2 h-5 w-5 text-amber-500" />
                          Low Stock Alert
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                            <div className="flex items-center">
                              <div className="h-10 w-10 mr-3">
                                <img 
                                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba" 
                                  alt="Mountain Ranges"
                                  className="h-full w-full object-cover rounded"
                                />
                              </div>
                              <div>
                                <p className="font-medium">Mountain Ranges</p>
                                <p className="text-xs text-gray-500">5 items remaining</p>
                              </div>
                            </div>
                            <Button size="sm">Restock</Button>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                            <div className="flex items-center">
                              <div className="h-10 w-10 mr-3">
                                <img 
                                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f" 
                                  alt="Retro Gaming"
                                  className="h-full w-full object-cover rounded"
                                />
                              </div>
                              <div>
                                <p className="font-medium">Retro Gaming</p>
                                <p className="text-xs text-red-500">Out of stock!</p>
                              </div>
                            </div>
                            <Button size="sm">Restock</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {showInvoice ? (
                    <>
                      <div className="mb-4">
                        <Button variant="outline" onClick={() => setShowInvoice(false)}>
                          Back to Orders
                        </Button>
                      </div>
                      <OrderInvoice order={selectedOrder} />
                    </>
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                        <h2 className="text-xl font-semibold">Order Management</h2>
                        <div className="flex space-x-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="text"
                              placeholder="Search orders..."
                              className="pl-9 w-full md:w-64"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatusFilter('processing')}>Processing</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatusFilter('shipped')}>Shipped</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatusFilter('in_transit')}>In Transit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatusFilter('completed')}>Completed</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>Cancelled</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">
                                Export <Download className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" /> Print Orders
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <Table>
                          <TableCaption>A list of recent orders.</TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredOrders.length > 0 ? (
                              filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                  <TableCell className="font-medium">{order.id}</TableCell>
                                  <TableCell>
                                    <div>
                                      <p>{order.customer}</p>
                                      <p className="text-sm text-gray-500">{order.email}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>{order.date}</TableCell>
                                  <TableCell>{order.items}</TableCell>
                                  <TableCell>${order.total.toFixed(2)}</TableCell>
                                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedOrder(order);
                                          setShowInvoice(true);
                                        }}>
                                          <FileText className="mr-2 h-4 w-4" /> View Invoice
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedOrder(order);
                                          setIsUpdateOrderStatusOpen(true);
                                        }}>
                                          <Truck className="mr-2 h-4 w-4" /> Update Status
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                          <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                                  No orders found matching your criteria
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Posters Tab */}
              <TabsContent value="posters">
                <PosterManagement />
              </TabsContent>
              
              {/* Customers Tab */}
              <TabsContent value="customers">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                      <h2 className="text-xl font-semibold">Customer Management</h2>
                      <div className="flex space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            placeholder="Search customers..."
                            className="pl-9 w-full md:w-64"
                          />
                        </div>
                        <Button variant="outline">
                          Export <Download className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableCaption>A list of customers.</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Total Spent</TableHead>
                            <TableHead>Admin Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockCustomers.map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={customer.avatar} />
                                    <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  {customer.name}
                                </div>
                              </TableCell>
                              <TableCell>{customer.email}</TableCell>
                              <TableCell>{customer.joined}</TableCell>
                              <TableCell>{customer.orders}</TableCell>
                              <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Switch 
                                    checked={customer.isAdmin} 
                                    onCheckedChange={() => handleToggleAdminStatus(customer)}
                                    id={`admin-switch-${customer.id}`}
                                  />
                                  <Label htmlFor={`admin-switch-${customer.id}`} className="ml-2">
                                    {customer.isAdmin ? 'Admin' : 'User'}
                                  </Label>
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Heart className="mr-2 h-4 w-4" /> View Wishlist
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <XCircle className="mr-2 h-4 w-4" /> Disable Account
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Customer Insights Section */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Wishlists Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Wishlists</CardTitle>
                        <CardDescription>Items that customers have saved to their wishlists</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {Object.entries(mockUserWishlists).map(([userId, items]) => {
                          const user = mockCustomers.find(c => c.id === userId);
                          if (!user || items.length === 0) return null;
                          
                          return (
                            <div key={userId} className="mb-4 last:mb-0">
                              <div className="flex items-center mb-2">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                              </div>
                              <ul className="space-y-1 pl-8">
                                {items.map(item => (
                                  <li key={item.id} className="text-sm flex justify-between">
                                    <span>{item.title}</span>
                                    <span className="text-gray-500">${item.price}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                    
                    {/* Add Admin Access */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Add Admin Access</CardTitle>
                        <CardDescription>Grant admin privileges to a user</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="admin-email">Email Address</Label>
                            <Input id="admin-email" placeholder="user@example.com" />
                          </div>
                          <div>
                            <Label htmlFor="admin-role">Role</Label>
                            <Select>
                              <SelectTrigger id="admin-role">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Roles</SelectLabel>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full">
                            <UserPlus className="mr-2 h-4 w-4" /> Add Admin User
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
              
              {/* Promotions Tab */}
              <TabsContent value="promotions">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Promotions & Offers</h2>
                      <Button>
                        <Tag className="mr-2 h-4 w-4" /> Create New Promotion
                      </Button>
                    </div>
                    
                    {/* Promotions Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableCaption>Current and scheduled promotions</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPromotions.map(promo => (
                            <TableRow key={promo.id}>
                              <TableCell>{promo.id}</TableCell>
                              <TableCell className="font-medium">{promo.name}</TableCell>
                              <TableCell>{promo.discount}</TableCell>
                              <TableCell>{promo.startDate}</TableCell>
                              <TableCell>{promo.endDate}</TableCell>
                              <TableCell>
                                <Badge className={promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                                  {promo.status === 'active' ? 'Active' : 'Scheduled'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" /> Edit Promotion
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <XCircle className="mr-2 h-4 w-4" /> Cancel Promotion
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  {/* Bundle Offers and Banner Management */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bundle Offers */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Create Bundle Offer</CardTitle>
                        <CardDescription>
                          Combine multiple products into a discounted bundle
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="bundle-name">Bundle Name</Label>
                          <Input id="bundle-name" placeholder="Summer Collection Bundle" />
                        </div>
                        <div>
                          <Label htmlFor="bundle-discount">Discount Percentage</Label>
                          <Input id="bundle-discount" type="number" placeholder="15" />
                        </div>
                        <div>
                          <Label>Select Products</Label>
                          <div className="border rounded-md p-2 mt-1 max-h-32 overflow-y-auto">
                            <div className="flex items-center space-x-2 mb-2">
                              <input type="checkbox" id="product1" />
                              <Label htmlFor="product1" className="text-sm">Abstract Art Poster</Label>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <input type="checkbox" id="product2" />
                              <Label htmlFor="product2" className="text-sm">Minimalist Landscape</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="product3" />
                              <Label htmlFor="product3" className="text-sm">Urban Photography</Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          <Gift className="mr-2 h-4 w-4" /> Create Bundle
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    {/* Banner Management */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Banner Promotions</CardTitle>
                        <CardDescription>
                          Create promotional banners for your store
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="banner-title">Banner Title</Label>
                          <Input id="banner-title" placeholder="Limited Time Offer" />
                        </div>
                        <div>
                          <Label htmlFor="banner-message">Banner Message</Label>
                          <Textarea id="banner-message" placeholder="Get 20% off on all abstract art posters until June 30th!" />
                        </div>
                        <div>
                          <Label htmlFor="banner-location">Banner Location</Label>
                          <Select>
                            <SelectTrigger id="banner-location">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="homepage">Homepage</SelectItem>
                              <SelectItem value="collections">Collections Page</SelectItem>
                              <SelectItem value="checkout">Checkout Page</SelectItem>
                              <SelectItem value="all">All Pages</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          <Bell className="mr-2 h-4 w-4" /> Publish Banner
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
              
              {/* Insights Tab - Enhanced with charts */}
              <TabsContent value="insights">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Sales Overview Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                          Sales Overview
                        </CardTitle>
                        <CardDescription>Monthly sales performance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <SalesLineChart data={salesData} />
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Product Category Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PieChartIcon className="mr-2 h-5 w-5 text-blue-500" />
                          Product Category Distribution
                        </CardTitle>
                        <CardDescription>Sales by poster category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <CategoryPieChart data={categoryData} colors={COLORS} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Analytics Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <h3 className="text-2xl font-bold">1,284</h3>
                          </div>
                          <div className="bg-blue-100 p-3 rounded-full">
                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-500">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>+12.5% from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold">$24,389</h3>
                          </div>
                          <div className="bg-green-100 p-3 rounded-full">
                            <BarChartIcon className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-500">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>+8.2% from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Total Customers</p>
                            <h3 className="text-2xl font-bold">3,875</h3>
                          </div>
                          <div className="bg-purple-100 p-3 rounded-full">
                            <Users className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-500">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>+5.3% from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Avg. Order Value</p>
                            <h3 className="text-2xl font-bold">$42.50</h3>
                          </div>
                          <div className="bg-orange-100 p-3 rounded-full">
                            <Star className="h-6 w-6 text-orange-600" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-500">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>+2.1% from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Best Selling Products */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ShoppingBag className="mr-2 h-5 w-5 text-orange-500" />
                        Best Selling Products
                      </CardTitle>
                      <CardDescription>Top performing posters by sales</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Sold</TableHead>
                            <TableHead>Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Abstract Geometry Lines</TableCell>
                            <TableCell>$34.99</TableCell>
                            <TableCell>1,283</TableCell>
                            <TableCell>$44,892.17</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Minimalist Nature</TableCell>
                            <TableCell>$29.99</TableCell>
                            <TableCell>956</TableCell>
                            <TableCell>$28,670.44</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Vintage Cinema Poster</TableCell>
                            <TableCell>$39.99</TableCell>
                            <TableCell>892</TableCell>
                            <TableCell>$35,671.08</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Urban Cityscape</TableCell>
                            <TableCell>$32.99</TableCell>
                            <TableCell>845</TableCell>
                            <TableCell>$27,876.55</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  {/* Customer Engagement */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="mr-2 h-5 w-5 text-red-500" />
                        Customer Engagement
                      </CardTitle>
                      <CardDescription>Wishlist and cart activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <SalesBarChart data={[
                          { name: 'Added to Cart', count: 1250 },
                          { name: 'Added to Wishlist', count: 860 },
                          { name: 'Purchased', count: 620 },
                          { name: 'Returned', count: 45 }
                        ]} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>
                          Configure your store settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="store-name">Store Name</Label>
                          <Input 
                            id="store-name" 
                            value={storeSettings.name} 
                            onChange={(e) => handleSettingsChange('name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="store-email">Contact Email</Label>
                          <Input 
                            id="store-email" 
                            value={storeSettings.email}
                            onChange={(e) => handleSettingsChange('email', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="store-currency">Default Currency</Label>
                          <Select 
                            value={storeSettings.currency}
                            onValueChange={(value) => handleSettingsChange('currency', value)}
                          >
                            <SelectTrigger id="store-currency">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="usd">USD ($)</SelectItem>
                              <SelectItem value="eur">EUR (€)</SelectItem>
                              <SelectItem value="gbp">GBP (£)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Save Settings</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>
                          Manage security and access controls
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Two-factor Authentication</p>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Login Notifications</p>
                            <p className="text-sm text-gray-500">Receive email alerts for new logins</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Anti-Screenshot Protection</p>
                            <p className="text-sm text-gray-500">Prevent screenshots of sensitive content</p>
                          </div>
                          <Switch />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Save Security Settings</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Admin Users</CardTitle>
                        <CardDescription>
                          Manage users with admin access to your store
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Last Login</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Admin User</TableCell>
                              <TableCell>admin@posterzone.com</TableCell>
                              <TableCell>Owner</TableCell>
                              <TableCell>2023-05-22 10:30 AM</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">Edit</Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                      <CardFooter>
                        <Button>
                          <UserPlus className="mr-2 h-4 w-4" /> Add Admin User
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Product Management Settings */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Product Management</CardTitle>
                        <CardDescription>
                          Configure poster product management settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Low Stock Alerts</p>
                            <p className="text-sm text-gray-500">Receive notifications when stock is low</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Automatic Restock Emails</p>
                            <p className="text-sm text-gray-500">Notify customers when out-of-stock items are back</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
                          <div className="flex items-center mt-1">
                            <Input id="low-stock-threshold" type="number" defaultValue="5" className="w-24" />
                            <span className="ml-2 text-sm text-gray-500">items remaining</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Alert when product stock falls below this number</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Save Product Settings</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      
      {/* Order Status Update Dialog */}
      <Dialog open={isUpdateOrderStatusOpen} onOpenChange={setIsUpdateOrderStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Add notes about this status change" 
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateOrderStatusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
