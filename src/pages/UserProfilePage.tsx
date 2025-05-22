
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Edit, User, ShoppingCart, Package, Settings, 
  AlertCircle, CheckCircle, Truck, Clock,
  UserCheck, LogOut 
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const UserProfilePage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock authentication state
  
  // Mock user data - in a real app, this would come from Auth0 or your auth provider
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250",
  });
  
  // Mock order history with tracking information
  const orders = [
    { 
      id: "PZ123456", 
      date: "2025-05-15", 
      status: "delivered", 
      total: 87.95,
      items: [
        { id: "ITEM001", title: "Abstract Art Poster", price: 29.99, quantity: 2 },
        { id: "ITEM002", title: "Mountain Landscape Print", price: 27.97, quantity: 1 }
      ],
      tracking: {
        number: "TRK123456789",
        carrier: "FedEx",
        estimatedDelivery: "2025-05-18",
        currentLocation: "Delivered",
        updates: [
          { date: "2025-05-15", time: "14:30", status: "Delivered to recipient", location: "New York, NY" },
          { date: "2025-05-14", time: "09:15", status: "Out for delivery", location: "Local distribution center" },
          { date: "2025-05-13", time: "18:42", status: "Arrived at distribution center", location: "New York, NY" },
          { date: "2025-05-12", time: "08:30", status: "Shipped", location: "Warehouse" },
          { date: "2025-05-11", time: "16:20", status: "Order processed", location: "Warehouse" }
        ]
      }
    },
    { 
      id: "PZ789012", 
      date: "2025-04-22", 
      status: "shipped", 
      total: 64.50,
      items: [
        { id: "ITEM003", title: "Minimalist Design Poster", price: 34.50, quantity: 1 },
        { id: "ITEM004", title: "Cityscape Art Print", price: 30.00, quantity: 1 }
      ],
      tracking: {
        number: "TRK987654321",
        carrier: "UPS",
        estimatedDelivery: "2025-04-28",
        currentLocation: "In Transit",
        updates: [
          { date: "2025-04-25", time: "10:22", status: "In transit", location: "Distribution center" },
          { date: "2025-04-23", time: "14:15", status: "Shipped", location: "Warehouse" },
          { date: "2025-04-22", time: "09:30", status: "Order processed", location: "Warehouse" }
        ]
      }
    },
    { 
      id: "PZ345678", 
      date: "2025-03-19", 
      status: "processing", 
      total: 129.99,
      items: [
        { id: "ITEM005", title: "3-Piece Art Collection", price: 129.99, quantity: 1 }
      ],
      tracking: null
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleLogout = () => {
    // In a real app, this would call Auth0 logout
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setIsAuthenticated(false);
  };

  // Get status badge properties
  const getStatusInfo = (status) => {
    const statusProps = {
      delivered: { 
        color: "bg-green-100 text-green-800", 
        icon: CheckCircle, 
        label: "Delivered",
        progress: 100
      },
      shipped: { 
        color: "bg-blue-100 text-blue-800", 
        icon: Truck, 
        label: "Shipped",
        progress: 65
      },
      processing: { 
        color: "bg-yellow-100 text-yellow-800", 
        icon: Clock, 
        label: "Processing",
        progress: 30
      },
      cancelled: { 
        color: "bg-red-100 text-red-800", 
        icon: AlertCircle, 
        label: "Cancelled",
        progress: 0
      }
    };

    return statusProps[status] || statusProps.processing;
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In Required</CardTitle>
                  <CardDescription>
                    You need to sign in to view your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication required</AlertTitle>
                    <AlertDescription>
                      Please log in to access your account and view your profile information.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <UserCheck className="mr-2 h-4 w-4" /> Sign In
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Sidebar */}
              <div className="md:w-1/3 lg:w-1/4">
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-bold mt-4">{userData.name}</h2>
                      <p className="text-gray-500">{userData.email}</p>
                      
                      <div className="mt-4 w-full space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-red-600 hover:text-red-600"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-0">
                    <TabsList className="grid grid-cols-1 w-full rounded-none">
                      <TabsTrigger 
                        value="profile" 
                        className={`justify-start px-4 py-3 ${activeTab === "profile" ? "bg-gray-100" : ""}`}
                        onClick={() => setActiveTab("profile")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile Information
                      </TabsTrigger>
                      <TabsTrigger 
                        value="orders" 
                        className={`justify-start px-4 py-3 ${activeTab === "orders" ? "bg-gray-100" : ""}`}
                        onClick={() => setActiveTab("orders")}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Order History
                      </TabsTrigger>
                      <TabsTrigger 
                        value="addresses" 
                        className={`justify-start px-4 py-3 ${activeTab === "addresses" ? "bg-gray-100" : ""}`}
                        onClick={() => setActiveTab("addresses")}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Saved Addresses
                      </TabsTrigger>
                      <TabsTrigger 
                        value="settings" 
                        className={`justify-start px-4 py-3 ${activeTab === "settings" ? "bg-gray-100" : ""}`}
                        onClick={() => setActiveTab("settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Account Settings
                      </TabsTrigger>
                    </TabsList>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <div className="md:w-2/3 lg:w-3/4">
                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="profile" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Manage your personal information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Full Name</Label>
                              <Input 
                                id="name" 
                                value={userData.name} 
                                onChange={(e) => setUserData({...userData, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input 
                                id="email" 
                                type="email" 
                                value={userData.email}
                                onChange={(e) => setUserData({...userData, email: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input 
                                id="phone" 
                                value={userData.phone}
                                onChange={(e) => setUserData({...userData, phone: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="address">Address</Label>
                              <Input 
                                id="address" 
                                value={userData.address}
                                onChange={(e) => setUserData({...userData, address: e.target.value})}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleSave}>Save Changes</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500">Full Name</p>
                                <p>{userData.name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p>{userData.email}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                <p>{userData.phone}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Address</p>
                                <p>{userData.address}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="orders" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>
                          View and track your orders
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {orders.length > 0 ? (
                          <div className="space-y-6">
                            {orders.map((order) => {
                              const statusInfo = getStatusInfo(order.status);
                              
                              return (
                                <Card key={order.id} className="overflow-hidden">
                                  <CardHeader className="bg-gray-50 py-4">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                      <div className="space-y-1">
                                        <CardTitle className="text-base">{order.id}</CardTitle>
                                        <CardDescription>{order.date}</CardDescription>
                                      </div>
                                      <div className="mt-2 md:mt-0 flex items-center">
                                        <span className={`px-3 py-1 rounded-full text-xs flex items-center ${statusInfo.color}`}>
                                          <statusInfo.icon className="mr-1 h-3 w-3" />
                                          {statusInfo.label}
                                        </span>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pt-4">
                                    {/* Order Items */}
                                    <div className="space-y-3">
                                      {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                          <span>{item.quantity}x {item.title}</span>
                                          <span className="font-medium">${item.price.toFixed(2)}</span>
                                        </div>
                                      ))}
                                      <div className="pt-2 border-t flex justify-between font-medium">
                                        <span>Total</span>
                                        <span>${order.total.toFixed(2)}</span>
                                      </div>
                                    </div>
                                    
                                    {/* Tracking Information */}
                                    {order.tracking && (
                                      <div className="mt-6">
                                        <h4 className="font-medium mb-3">Tracking Information</h4>
                                        <div className="space-y-2 mb-3">
                                          <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Carrier</span>
                                            <span>{order.tracking.carrier}</span>
                                          </div>
                                          <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Tracking Number</span>
                                            <span>{order.tracking.number}</span>
                                          </div>
                                          <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Estimated Delivery</span>
                                            <span>{order.tracking.estimatedDelivery}</span>
                                          </div>
                                        </div>
                                        
                                        {/* Tracking Progress */}
                                        <div className="mb-4">
                                          <div className="flex justify-between text-xs mb-1">
                                            <span>Order Placed</span>
                                            <span>Shipped</span>
                                            <span>Delivered</span>
                                          </div>
                                          <Progress value={statusInfo.progress} className="h-2" />
                                        </div>
                                        
                                        {/* Tracking Timeline */}
                                        <div className="border rounded-md p-3">
                                          <h5 className="font-medium text-sm mb-3">Shipping Updates</h5>
                                          <div className="space-y-4">
                                            {order.tracking.updates.map((update, idx) => (
                                              <div key={idx} className="relative pl-5">
                                                {idx !== order.tracking.updates.length - 1 && (
                                                  <div className="absolute top-1.5 left-1.5 w-0.5 h-full bg-gray-200"></div>
                                                )}
                                                <div className="absolute top-1.5 left-0 h-3 w-3 rounded-full bg-blue-500"></div>
                                                <div>
                                                  <p className="text-sm font-medium">{update.status}</p>
                                                  <p className="text-xs text-gray-500">{update.date} at {update.time}</p>
                                                  <p className="text-xs text-gray-500">{update.location}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Order Actions */}
                                    <div className="mt-6 flex justify-end space-x-2">
                                      <Button variant="outline" size="sm">View Details</Button>
                                      {order.tracking && (
                                        <Button size="sm">Track Order</Button>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No orders found</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="addresses" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Saved Addresses</CardTitle>
                        <CardDescription>
                          Manage your delivery addresses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Home</p>
                                  <p className="text-sm text-gray-500">{userData.address}</p>
                                </div>
                                <div>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Button variant="outline">
                            Add New Address
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>
                          Update your account preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
                            <div className="space-y-2">
                              {/* We'd include checkboxes for different notification settings here */}
                              <p className="text-gray-500">Notification preferences will be available soon.</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-3">Password</h3>
                            <Button>Change Password</Button>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-3 text-red-600">Danger Zone</h3>
                            <Button variant="destructive">Delete Account</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;
