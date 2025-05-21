
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, User, ShoppingCart, Package, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const UserProfilePage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - in a real app, this would come from Auth0 or your auth provider
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250",
  });
  
  // Mock order history
  const orders = [
    { id: "PZ123456", date: "2025-05-15", status: "Delivered", total: 87.95 },
    { id: "PZ789012", date: "2025-04-22", status: "Shipped", total: 64.50 },
    { id: "PZ345678", date: "2025-03-19", status: "Processing", total: 129.99 },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
                    
                    <div className="mt-4 w-full">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
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
                        View and manage your past orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {orders.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4">Order ID</th>
                                <th className="text-left py-3 px-4">Date</th>
                                <th className="text-left py-3 px-4">Status</th>
                                <th className="text-left py-3 px-4">Total</th>
                                <th className="text-left py-3 px-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order) => (
                                <tr key={order.id} className="border-b">
                                  <td className="py-3 px-4">{order.id}</td>
                                  <td className="py-3 px-4">{order.date}</td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                                  <td className="py-3 px-4">
                                    <Button variant="outline" size="sm">View</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;
