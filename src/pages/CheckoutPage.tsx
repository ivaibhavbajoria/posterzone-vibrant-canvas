
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  is_admin: boolean;
}

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  useEffect(() => {
    if (profile) {
      // Pre-fill form with profile data if available
      const nameParts = profile.full_name?.split(' ') || [];
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || "",
        email: user?.email || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zip_code || "",
        phone: profile.phone || "",
      });
      setIsLoadingProfile(false);
    } else if (user) {
      // If no profile but user exists, set basic info
      setFormData({
        firstName: user.user_metadata?.full_name?.split(' ')[0] || "",
        lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "",
        email: user.email || "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
      });
      setIsLoadingProfile(false);
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to place an order.",
          variant: "destructive",
        });
        return;
      }

      // Create order in database
      const orderData = {
        user_id: user.id,
        total: getCartTotal(),
        status: 'pending',
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        }
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Debug: Log cart items
      console.log('Cart items:', cartItems);

      // For now, let's create dummy poster entries in the database if they don't exist
      // This is a temporary solution to make orders work
      const posterPromises = cartItems.map(async (item) => {
        // First, check if poster exists
        const { data: existingPoster } = await supabase
          .from('posters')
          .select('id')
          .eq('title', item.title)
          .single();

        if (existingPoster) {
          return existingPoster.id;
        }

        // If poster doesn't exist, create it
        const { data: newPoster, error: posterError } = await supabase
          .from('posters')
          .insert([{
            title: item.title,
            description: `Auto-generated poster: ${item.title}`,
            price: item.price,
            image_url: item.image,
            category: 'general',
            stock: 100
          }])
          .select('id')
          .single();

        if (posterError) {
          console.error('Error creating poster:', posterError);
          throw new Error(`Could not create poster: ${item.title}`);
        }

        return newPoster.id;
      });

      const posterIds = await Promise.all(posterPromises);

      // Create order items with the poster IDs
      const orderItems = cartItems.map((item, index) => ({
        order_id: order.id,
        poster_id: posterIds[index],
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setCheckoutComplete(true);
      setOrderNumber(order.id.slice(0, 8).toUpperCase());
      clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.slice(0, 8).toUpperCase()} has been confirmed.`,
      });

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = 4.99;
  const tax = subtotal * 0.08; // Assuming 8% tax
  const total = subtotal + shipping + tax;

  // Check if cart is empty
  const isCartEmpty = cartItems.length === 0 && !checkoutComplete;

  if (isCartEmpty) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-posterzone-charcoal mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/collections">
              <Button className="bg-posterzone-orange hover:bg-posterzone-orange/90">
                Browse Collections
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (checkoutComplete) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-posterzone-charcoal mb-2">Order Confirmed!</h1>
                  <p className="text-gray-600">Thank you for your purchase</p>
                </div>

                <div className="border-t border-b py-4 my-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Order Number:</span>
                    <span className="text-posterzone-blue">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Order Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-6 text-center">
                  A confirmation email has been sent to {formData.email}
                </p>

                <div className="flex justify-center space-x-4">
                  <Link to="/collections">
                    <Button variant="outline">Continue Shopping</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Check if user has complete profile information
  const hasCompleteProfile = profile && 
    formData.firstName && formData.lastName && formData.address && 
    formData.city && formData.state && formData.zipCode;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-posterzone-charcoal mb-6">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {hasCompleteProfile ? (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Shipping Information</CardTitle>
                      <CardDescription>Using saved profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Address:</strong> {formData.address}</p>
                        <p><strong>City:</strong> {formData.city}, {formData.state} {formData.zipCode}</p>
                        {formData.phone && <p><strong>Phone:</strong> {formData.phone}</p>}
                      </div>
                      <div className="mt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            // Allow editing by showing the form
                            setFormData(prev => ({ ...prev }));
                          }}
                        >
                          Edit Address
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Shipping Information</CardTitle>
                      <CardDescription>Please provide your shipping details</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input 
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Zip/Postal Code</Label>
                        <Input 
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-posterzone-orange hover:bg-posterzone-orange/90"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Place Order (₹{total.toFixed(2)})
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center py-3">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="ml-4 flex-grow">
                          <p className="font-medium">{item.title}</p>
                          {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                          <div className="flex justify-between mt-1">
                            <span className="text-sm">₹{item.price.toFixed(2)} × {item.quantity}</span>
                            <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (estimated)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
