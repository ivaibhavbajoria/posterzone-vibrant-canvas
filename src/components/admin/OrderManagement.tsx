
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, Download } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  shipping_address: any;
  order_items: {
    poster_id: string;
    quantity: number;
    price: number;
    posters: {
      title: string;
      image_url: string;
    };
  }[];
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            poster_id,
            quantity,
            price,
            posters (
              title,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No address provided';
    return `${address.street}, ${address.city}, ${address.state} - ${address.zipCode}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  {order.order_items?.length || 0} item(s)
                </TableCell>
                <TableCell>₹{order.total}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                          <DialogDescription>
                            Order #{selectedOrder?.id.slice(0, 8)}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold">Order Information</h4>
                                <p>Date: {formatDate(selectedOrder.created_at)}</p>
                                <p>Total: ₹{selectedOrder.total}</p>
                                <p>Status: {selectedOrder.status}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Shipping Address</h4>
                                <p className="text-sm">{formatAddress(selectedOrder.shipping_address)}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {selectedOrder.order_items?.map((item, index) => (
                                  <div key={index} className="flex items-center gap-3 p-2 border rounded">
                                    <img
                                      src={item.posters.image_url || '/placeholder.svg'}
                                      alt={item.posters.title}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium">{item.posters.title}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Quantity: {item.quantity} × ₹{item.price}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Update Status</h4>
                              <Select
                                value={selectedOrder.status}
                                onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsOrderDetailsOpen(false)}>
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {orders.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            No orders found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
