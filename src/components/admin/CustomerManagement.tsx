
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { Eye, Search, Mail, User, Calendar, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

interface Customer {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  created_at: string | null;
}

interface CustomerOrder {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Fetch customers
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as Customer[];
    }
  });

  // Fetch customer orders when a customer is selected
  const { data: customerOrders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['customer-orders', selectedCustomer?.id],
    queryFn: async () => {
      if (!selectedCustomer?.id) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('id, total, status, created_at')
        .eq('user_id', selectedCustomer.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as CustomerOrder[];
    },
    enabled: !!selectedCustomer?.id
  });

  const filteredCustomers = customers.filter(customer =>
    customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = customerOrders.filter(order => order.status === 'completed').length;

  if (isLoadingCustomers) return <div>Loading customers...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search customers by name, username, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => 
                c.created_at && 
                new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Today</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => 
                c.created_at && 
                new Date(c.created_at).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">All Customers</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    {customer.avatar_url ? (
                      <img 
                        src={customer.avatar_url} 
                        alt={customer.full_name || 'Customer'} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {customer.full_name || 'N/A'}
                  </TableCell>
                  <TableCell>{customer.username || 'N/A'}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {customer.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {customer.created_at 
                      ? format(new Date(customer.created_at), 'MMM dd, yyyy')
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Detailed information and order history for this customer.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      {selectedCustomer.avatar_url ? (
                        <img 
                          src={selectedCustomer.avatar_url} 
                          alt={selectedCustomer.full_name || 'Customer'} 
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{selectedCustomer.full_name || 'No name provided'}</p>
                        <p className="text-sm text-gray-500">@{selectedCustomer.username || 'No username'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer ID</p>
                      <p className="font-mono text-sm">{selectedCustomer.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Join Date</p>
                      <p className="text-sm">
                        {selectedCustomer.created_at 
                          ? format(new Date(selectedCustomer.created_at), 'MMMM dd, yyyy')
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total Orders</span>
                      <span className="font-medium">{customerOrders.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Completed Orders</span>
                      <span className="font-medium">{completedOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total Spent</span>
                      <span className="font-medium">₹{totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Average Order</span>
                      <span className="font-medium">
                        ₹{customerOrders.length > 0 ? (totalSpent / customerOrders.length).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <p>Loading orders...</p>
                  ) : customerOrders.length === 0 ? (
                    <p className="text-gray-500">No orders found for this customer.</p>
                  ) : (
                    <div className="space-y-3">
                      {customerOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{order.total.toFixed(2)}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
