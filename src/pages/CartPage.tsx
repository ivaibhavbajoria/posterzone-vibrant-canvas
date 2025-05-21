
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
};

const CartPage = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, title: "Mountain Sunset Poster", price: 24.99, quantity: 1, image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5" },
    { id: 2, title: "Abstract Art Poster", price: 29.99, quantity: 1, image: "https://images.unsplash.com/photo-1552083375-1447ce886485" },
    { id: 3, title: "Vintage Movie Poster", price: 34.99, quantity: 1, image: "https://images.unsplash.com/photo-1536440136630-a8c3a9f3aee7" },
  ]);

  // Calculate cart subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 4.99;
  const total = subtotal + shipping;

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  // Update item quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Check if cart is empty
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <ShoppingCart className="w-6 h-6 text-posterzone-orange mr-3" />
            <h1 className="text-4xl font-bold text-posterzone-charcoal">Your Cart</h1>
          </div>

          {isCartEmpty ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
              <Link to="/collections">
                <Button className="bg-posterzone-orange hover:bg-posterzone-orange/90">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg overflow-hidden shadow">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Product</th>
                        <th className="py-4 px-4 text-center text-sm font-medium text-gray-700 hidden sm:table-cell">Price</th>
                        <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Quantity</th>
                        <th className="py-4 px-4 text-right text-sm font-medium text-gray-700 hidden sm:table-cell">Subtotal</th>
                        <th className="py-4 px-2 text-right text-sm font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="ml-4">
                                <p className="font-medium text-posterzone-charcoal">{item.title}</p>
                                {item.size && (
                                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                                )}
                                <p className="text-sm text-gray-500 sm:hidden">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center text-gray-700 hidden sm:table-cell">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center items-center border rounded">
                              <button
                                className="px-3 py-1"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="px-3 py-1">{item.quantity}</span>
                              <button
                                className="px-3 py-1"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right text-gray-700 font-medium hidden sm:table-cell">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="py-4 px-2 text-right">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-posterzone-orange"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold text-posterzone-charcoal mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-posterzone-orange hover:bg-posterzone-orange/90 mb-2">
                    Proceed to Checkout
                  </Button>
                  <Link to="/collections">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
