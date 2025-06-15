
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { localStorageService, LocalPoster } from "@/services/localStorageService";

const BestSellers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [bestSellerPosters, setBestSellerPosters] = useState<LocalPoster[]>([]);

  useEffect(() => {
    // Load bestseller posters from localStorage
    localStorageService.initializeData();
    const allPosters = localStorageService.getPosters();
    const bestsellers = allPosters.filter(poster => poster.is_best_seller);
    setBestSellerPosters(bestsellers);
  }, []);

  const handleAddToCart = (poster: LocalPoster) => {
    addToCart({
      id: poster.id,
      title: poster.title,
      price: poster.price,
      image: poster.image_url
    });
    
    toast({
      title: "Added to cart!",
      description: `${poster.title} has been added to your cart.`,
    });
  };
  
  const viewPosterDetails = (id: string) => {
    navigate(`/poster/${id}`);
  };

  return (
    <div className="min-h-screen bg-posterzone-lightgray py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <Star className="w-6 h-6 text-posterzone-orange mr-3" />
            <h1 className="text-4xl font-bold text-posterzone-charcoal">Best Sellers</h1>
          </div>
          <p className="text-gray-600 mb-8">Our most popular posters of all time</p>

          {bestSellerPosters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellerPosters.map((poster, index) => (
                <motion.div
                  key={poster.id}
                  className="poster-card overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="relative overflow-hidden group">
                    <img 
                      src={poster.image_url || '/placeholder.svg'} 
                      alt={poster.title} 
                      className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                      onClick={() => viewPosterDetails(poster.id)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    
                    {/* Quick action overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        className="bg-posterzone-orange text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
                        onClick={() => handleAddToCart(poster)}
                      >
                        Add to Cart
                      </button>
                    </div>
                    
                    {/* Best seller badge */}
                    <div className="absolute top-2 right-2 bg-posterzone-blue text-white text-xs px-2 py-1 rounded-md">
                      Best Seller
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 
                      className="text-lg font-medium mb-2 hover:text-posterzone-orange cursor-pointer"
                      onClick={() => viewPosterDetails(poster.id)}
                    >
                      {poster.title}
                    </h3>
                    <p className="text-posterzone-blue font-semibold">₹{poster.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 capitalize">{poster.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Best Sellers Yet</h3>
              <p className="text-gray-500">Add posters and mark them as bestsellers through the admin panel!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BestSellers;
