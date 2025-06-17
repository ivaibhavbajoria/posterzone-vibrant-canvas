import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingCart, Tag, Gift } from "lucide-react";
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
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice } from "@/utils/currency";

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

interface BundleOffer {
  id: string;
  title: string;
  description: string;
  applicable: boolean;
  savings: number;
}

interface Coupon {
  id: string;
  code: string;
  value: number;
  type: string;
  is_active: boolean;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
}

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedBundleOffer, setSelectedBundleOffer] = useState<string | null>(null);
  const [adminCoupons, setAdminCoupons] = useState<Coupon[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Fetch admin-created coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('is_active', true);
        
        if (!error && data) {
          setAdminCoupons(data);
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    
    fetchCoupons();
  }, []);

  // Bundle offers data - can be made dynamic later
  const bundleOffers: BundleOffer[] = [
    {
      id: "buy3get1",
      title: "Buy 3 Get 1 Free",
      description: "Add 4 posters to your cart and get the cheapest one free",
      applicable: cartItems.length >= 3,
      savings: cartItems.length >= 4 ? Math.min(...cartItems.map(item => item.price)) : 0
    },
    {
      id: "spend2000",
      title: "Spend ₹2000+ Get 15% Off",
      description: "Get 15% discount on orders above ₹2000",
      applicable: getCartTotal() >= 2000,
      savings: getCartTotal() >= 2000 ? getCartTotal() * 0.15 : 0
    },
    {
      id: "spend1500",
      title: "Spend ₹1500+ Get 10% Off", 
      description: "Get 10% discount on orders above ₹1500",
      applicable: getCartTotal() >= 1500,
      savings: getCartTotal() >= 1500 ? getCartTotal() * 0.10 : 0
    }
  ];

  // Filter applicable bundle offers
  const applicableBundleOffers = bundleOffers.filter(offer => offer.applicable && offer.savings > 0);

  useEffect(() => {
    if (profile) {
      // Pre-fill form with profile data if available
      const nameParts = profile.full_name?.split(' ') || [];
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || "",
        email: user?.email || "",
        phone: profile.phone || "",
      });
      setIsLoadingProfile(false);
    } else if (user) {
      // If no profile but user exists, set basic info
      setFormData({
        firstName: user.user_metadata?.full_name?.split(' ')[0] || "",
        lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "",
        email: user.email || "",
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

  const applyCoupon = () => {
    const subtotal = getCartTotal();
    
    // Check admin-created coupons first
    const adminCoupon = adminCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    
    if (adminCoupon) {
      // Check minimum order amount
      if (subtotal < adminCoupon.min_order_amount) {
        toast({
          title: "Coupon not applicable",
          description: `Minimum order amount of ₹${adminCoupon.min_order_amount} required`,
          variant: "destructive",
        });
        return;
      }

      // Check usage limits
      if (adminCoupon.max_uses && adminCoupon.current_uses >= adminCoupon.max_uses) {
        toast({
          title: "Coupon expired",
          description: "This coupon has reached its usage limit",
          variant: "destructive",
        });
        return;
      }

      // Check expiry date
      if (adminCoupon.expires_at && new Date(adminCoupon.expires_at) < new Date()) {
        toast({
          title: "Coupon expired",
          description: "This coupon has expired",
          variant: "destructive",
        });
        return;
      }

      // Calculate discount value
      let discountValue = 0;
      if (adminCoupon.type === 'percentage') {
        discountValue = subtotal * (adminCoupon.value / 100);
      } else {
        discountValue = adminCoupon.value;
      }
      
      setDiscount(discountValue);
      setAppliedCoupon(adminCoupon);
      toast({
        title: "Coupon applied!",
        description: `You saved ${adminCoupon.type === 'percentage' ? adminCoupon.value + '%' : '₹' + adminCoupon.value} on your order`,
      });
      return;
    }

    // Fallback to hardcoded coupons
    const coupons = {
      'SAVE10': 0.10,
      'WELCOME20': 0.20,
      'FIRST15': 0.15,
      'POSTER25': 0.25
    };

    const couponDiscount = coupons[couponCode.toUpperCase() as keyof typeof coupons];
    
    if (couponDiscount) {
      const discountValue = subtotal * couponDiscount;
      setDiscount(discountValue);
      setAppliedCoupon({
        id: 'hardcoded',
        code: couponCode.toUpperCase(),
        value: couponDiscount * 100,
        type: 'percentage',
        is_active: true,
        min_order_amount: 0,
        max_uses: null,
        current_uses: 0,
        expires_at: null
      });
      toast({
        title: "Coupon applied!",
        description: `You saved ${(couponDiscount * 100)}% on your order`,
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "Please check your coupon code and try again",
        variant: "destructive",
      });
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    toast({
      title: "Coupon removed",
      description: "Coupon discount has been removed from your order",
    });
  };

  const handleProceedToShiprocket = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to proceed with payment.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: "Information required",
        description: "Please fill in all required fields including shipping address.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order data for Shiprocket
      const orderData = {
        order_id: `ORD-${Date.now()}`,
        order_date: new Date().toISOString(),
        pickup_location: "Primary",
        billing_customer_name: `${formData.firstName} ${formData.lastName}`,
        billing_last_name: formData.lastName,
        billing_address: formData.address,
        billing_city: formData.city,
        billing_pincode: formData.pincode,
        billing_state: formData.state,
        billing_country: "India",
        billing_email: formData.email,
        billing_phone: formData.phone,
        shipping_is_billing: true,
        order_items: cartItems.map(item => ({
          name: item.title,
          sku: item.id,
          units: item.quantity,
          selling_price: item.price,
          discount: 0,
          tax: 0,
          hsn: 441122
        })),
        payment_method: "Prepaid",
        sub_total: subtotal,
        length: 10,
        breadth: 15,
        height: 5,
        weight: 0.5
      };

      // Store order in our database first
      const { data: orderRecord, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: cartItems,
          total: total,
          status: 'pending',
          shipping_address: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone
          }
        })
        .select()
        .single();

      if (orderError) {
        throw new Error('Failed to create order');
      }

      // For now, show success message and redirect to Shiprocket integration
      toast({
        title: "Redirecting to Shiprocket",
        description: "You will be redirected to complete your payment with Shiprocket.",
      });

      // In a real implementation, you would integrate with Shiprocket API here
      // For now, we'll simulate the redirect
      console.log('Order data for Shiprocket:', orderData);
      
      // Clear cart after successful order creation
      clearCart();
      setCheckoutComplete(true);
      setOrderNumber(orderData.order_id);

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate totals
  const subtotal = getCartTotal();
  const selectedBundle = applicableBundleOffers.find(offer => offer.id === selectedBundleOffer);
  const bundleDiscount = selectedBundle ? selectedBundle.savings : 0;
  const couponDiscount = discount;
  const discountedSubtotal = subtotal - bundleDiscount - couponDiscount;
  const shipping = discountedSubtotal > 1500 ? 0 : 50; // Updated shipping cost to rupees
  const tax = discountedSubtotal * 0.18; // GST 18%
  const total = discountedSubtotal + shipping + tax;

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
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <Check className="w-20 h-20 mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-posterzone-charcoal mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">Your order number is: <strong>{orderNumber}</strong></p>
            <p className="text-gray-600 mb-8">You will receive a confirmation email shortly.</p>
            <Link to="/collections">
              <Button className="bg-posterzone-orange hover:bg-posterzone-orange/90">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

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
              {/* Bundle Offers Selection */}
              {applicableBundleOffers.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Choose Your Bundle Offer
                    </CardTitle>
                    <CardDescription>Select one of the available offers for your order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedBundleOffer || ""} onValueChange={setSelectedBundleOffer}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="" id="no-bundle" />
                        <label htmlFor="no-bundle" className="flex-1 cursor-pointer">
                          <div>
                            <h4 className="font-medium">No Bundle Offer</h4>
                            <p className="text-sm text-gray-500">Continue without bundle discount</p>
                          </div>
                        </label>
                      </div>
                      {applicableBundleOffers.map((offer) => (
                        <div key={offer.id} className="flex items-center space-x-2 p-3 border rounded-lg bg-green-50 border-green-200">
                          <RadioGroupItem value={offer.id} id={offer.id} />
                          <label htmlFor={offer.id} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-green-800">{offer.title}</h4>
                                <p className="text-sm text-green-600">{offer.description}</p>
                              </div>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                Save {formatPrice(offer.savings)}
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {/* Coupon Code */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Coupon Code
                  </CardTitle>
                  <CardDescription>Have a coupon? Apply it here</CardDescription>
                </CardHeader>
                <CardContent>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <span className="font-medium text-green-800">Coupon Applied: {appliedCoupon.code}</span>
                        <p className="text-sm text-green-600">
                          You saved {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : formatPrice(appliedCoupon.value)} on your order
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={removeCoupon}>
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={applyCoupon} disabled={!couponCode}>
                        Apply
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>Please provide your contact details</CardDescription>
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

              {/* Shipping Address */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete address"
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
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input 
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      pattern="[0-9]{6}"
                      placeholder="6-digit pincode"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 mb-6">
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
                            <span className="text-sm">{formatPrice(item.price)} × {item.quantity}</span>
                            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    {bundleDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Bundle Discount</span>
                        <span>-{formatPrice(bundleDiscount)}</span>
                      </div>
                    )}
                    
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount ({appliedCoupon?.code})</span>
                        <span>-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    
                    {shipping === 0 && (
                      <p className="text-xs text-green-600">Free shipping on orders over ₹1500!</p>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (18%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    
                    {(bundleDiscount > 0 || couponDiscount > 0) && (
                      <div className="text-sm text-green-600 pt-2">
                        Total savings: {formatPrice(bundleDiscount + couponDiscount)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Proceed to Pay Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button 
                    type="button"
                    className="w-full bg-posterzone-orange hover:bg-posterzone-orange/90 text-white py-3 text-lg"
                    onClick={handleProceedToShiprocket}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Proceed to Pay ${formatPrice(total)}`}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Secure payment & shipping with Shiprocket
                  </p>
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
