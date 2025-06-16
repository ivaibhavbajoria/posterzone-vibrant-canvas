
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { localStorageService, LocalPoster } from "@/services/localStorageService";
import { formatPrice, getPriceForSize } from "@/utils/currency";

const PosterDetailsPage = () => {
  const { toast } = useToast();
  const { posterId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [poster, setPoster] = useState<LocalPoster | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("A6");
  const [quantity, setQuantity] = useState<number>(1);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load poster from localStorage
    localStorageService.initializeData();
    const allPosters = localStorageService.getPosters();
    const foundPoster = allPosters.find(p => p.id === posterId);
    
    if (foundPoster) {
      setPoster(foundPoster);
      
      // Check if poster is liked
      const savedLikes = localStorage.getItem('likedPosters');
      if (savedLikes) {
        const likedPosters = new Set(JSON.parse(savedLikes));
        setLiked(likedPosters.has(foundPoster.id));
      }
    } else {
      // Navigate to 404 if poster not found
      navigate('/not-found', { replace: true });
      return;
    }
    
    setLoading(false);
  }, [posterId, navigate]);

  // Toggle liked status
  const toggleLike = () => {
    if (poster) {
      const newLikedStatus = !liked;
      setLiked(newLikedStatus);
      
      const savedLikes = localStorage.getItem('likedPosters');
      const likedPosters = savedLikes ? new Set(JSON.parse(savedLikes)) : new Set();
      
      if (newLikedStatus) {
        likedPosters.add(poster.id);
      } else {
        likedPosters.delete(poster.id);
      }
      
      localStorage.setItem('likedPosters', JSON.stringify(Array.from(likedPosters)));
      
      toast({
        title: newLikedStatus ? "Added to favorites" : "Removed from favorites",
        description: newLikedStatus 
          ? `${poster.title} added to your favorites`
          : `${poster.title} removed from your favorites`,
      });
    }
  };

  // Get price for selected size
  const getCurrentPrice = () => {
    if (!poster) return 0;
    return getPriceForSize(poster.price, selectedSize);
  };

  // Add to cart
  const handleAddToCart = () => {
    if (poster) {
      const currentPrice = getCurrentPrice();
      addToCart({
        id: parseInt(poster.id),
        title: poster.title,
        price: currentPrice,
        image: poster.image_url,
        size: selectedSize
      }, quantity);
      
      toast({
        title: "Added to cart!",
        description: `${quantity} × ${poster?.title} (${selectedSize}) added to your cart.`,
      });
    }
  };

  // Update quantity
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-posterzone-orange mx-auto mb-4"></div>
          <p>Loading poster details...</p>
        </div>
      </div>
    );
  }

  if (!poster) {
    return null; // This shouldn't happen since we navigate away, but just in case
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <Button 
              variant="outline"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Poster Image */}
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={poster.image_url || '/placeholder.svg'} 
                alt={poster.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>

            {/* Poster Details */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-posterzone-charcoal mb-2">{poster.title}</h1>
                  <p className="text-sm text-gray-500 capitalize mb-2">{poster.category}</p>
                </div>
                <div className="flex gap-2">
                  {poster.is_trending && (
                    <div className="bg-posterzone-orange text-white text-xs px-2 py-1 rounded-md">
                      Trending
                    </div>
                  )}
                  {poster.is_best_seller && (
                    <div className="bg-posterzone-blue text-white text-xs px-2 py-1 rounded-md">
                      Best Seller
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-2xl font-bold text-posterzone-blue mb-4">
                {formatPrice(getCurrentPrice())}
              </p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 mb-4">
                  {poster.description || "A beautiful high-quality art print that will add character and style to any room. Printed on premium matte paper with vibrant, fade-resistant inks."}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium">Features:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                    <li>Museum-quality print</li>
                    <li>Premium matte finish</li>
                    <li>Multiple size options available</li>
                    <li>Fade-resistant ink</li>
                  </ul>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Size Options</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["A6", "A4", "A3"].map(size => (
                    <button 
                      key={size}
                      className={`border rounded py-3 px-4 transition-colors ${
                        selectedSize === size 
                          ? "border-posterzone-orange bg-posterzone-orange/10 text-posterzone-orange" 
                          : "border-gray-300 hover:border-posterzone-orange hover:bg-posterzone-lightgray"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      <div className="text-center">
                        <div className="font-medium">{size}</div>
                        <div className="text-sm text-gray-500">
                          {formatPrice(getPriceForSize(poster.price, size))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>• A6: {formatPrice(poster.price)} (Base price)</p>
                  <p>• A4: {formatPrice(poster.price + 15)} (+₹15)</p>
                  <p>• A3: {formatPrice(poster.price + 25)} (+₹25)</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                <div className="flex border rounded w-32">
                  <button
                    className="px-3 py-2 hover:bg-gray-100"
                    onClick={() => updateQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <span className="flex-1 text-center py-2 border-x">{quantity}</span>
                  <button
                    className="px-3 py-2 hover:bg-gray-100"
                    onClick={() => updateQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-posterzone-orange hover:bg-posterzone-orange/90"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2" size={18} />
                  Add to Cart - {formatPrice(getCurrentPrice() * quantity)}
                </Button>
                <Button 
                  variant="outline" 
                  className="p-2"
                  onClick={toggleLike}
                >
                  <Heart 
                    size={20} 
                    fill={liked ? "#FF5733" : "none"} 
                    className={liked ? "text-posterzone-orange" : ""}
                  />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PosterDetailsPage;
