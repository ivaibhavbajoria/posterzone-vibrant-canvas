
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, History, ShoppingBag } from 'lucide-react';
import { useAuth0Context } from '@/contexts/Auth0Context';
import { useNavigate } from 'react-router-dom';

// Mock order data for demonstration
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    total: 599.99,
    status: "delivered",
    items: [
      { title: "Vintage Car Poster", quantity: 1, price: 299.99 },
      { title: "Movie Collection Pack", quantity: 1, price: 299.99 }
    ]
  },
  {
    id: "ORD-002", 
    date: "2024-01-10",
    total: 199.99,
    status: "processing",
    items: [
      { title: "Gym Motivation Poster", quantity: 1, price: 199.99 }
    ]
  }
];

const OrderHistoryPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0Context();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('OrderHistoryPage - Auth state:', { user, isAuthenticated, isLoading });
    
    if (isAuthenticated && user) {
      // In a real app, you would fetch orders from your backend
      // For now, we'll use mock data
      setLoading(false);
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [user, isAuthenticated, isLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-posterzone-orange mx-auto mb-4"></div>
            <div className="text-lg">Loading your orders...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Order History</h1>
          <p className="text-gray-600">Please log in to view your order history.</p>
          <Button onClick={() => navigate('/auth')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <History className="w-8 h-8 text-posterzone-orange" />
        <h1 className="text-3xl font-bold">Order History</h1>
      </div>
      
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-gray-600">{formatDate(order.date)}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <p className="text-lg font-semibold mt-2">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        <span>{item.title}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-600">{item.quantity} × ₹{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm">
                      Reorder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <Button onClick={() => navigate('/collections')}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderHistoryPage;
