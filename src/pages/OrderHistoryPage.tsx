
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, History } from 'lucide-react';
import { useAuth0Context } from '@/contexts/Auth0Context';

const OrderHistoryPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0Context();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      // For now, we'll just set empty orders since we don't have a backend yet
      setOrders([]);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading your orders...</div>
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
          <Button onClick={() => window.location.href = '/auth'} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      
      <Card>
        <CardContent className="text-center py-16">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Button onClick={() => window.location.href = '/collections'}>
            Start Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistoryPage;
