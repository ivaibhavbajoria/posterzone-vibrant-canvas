
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Package, User, Settings, MoreVertical, Search, Filter, Calendar, Download, Printer, Eye, CheckCircle, XCircle } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      status: 'processing'
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
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={`${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
              variant={activeTab === 'orders' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveTab('orders')}
            >
              <Package className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button 
              variant={activeTab === 'customers' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveTab('customers')}
            >
              <User className="mr-2 h-4 w-4" />
              Customers
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
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
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
                                      <DropdownMenuItem>
                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
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
                </motion.div>
              </TabsContent>
              
              <TabsContent value="customers">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
                  <p>Customer management functionality will be added here.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
                  <p>Settings configuration will be added here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
