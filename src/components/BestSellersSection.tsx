
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { localStorageService, LocalPoster } from "@/services/localStorageService";

type BestSellersSectionProps = {
  onAddToCart: (poster: any) => void;
};

const BestSellersSection = ({ onAddToCart }: BestSellersSectionProps) => {
  const { toast } = useToast();
  const [bestSellers, setBestSellers] = useState<LocalPoster[]>([]);

  useEffect(() => {
    // Load bestseller posters from localStorage
    localStorageService.initializeData();
    const allPosters = localStorageService.getPosters();
    const bestsellers = allPosters.filter(poster => poster.is_best_seller).slice(0, 4);
    setBestSellers(bestsellers);
  }, []);

  const addToCart = (posterTitle: string) => {
    const poster = bestSellers.find(p => p.title === posterTitle);
    if (poster) {
      onAddToCart({
        id: poster.id,
        title: poster.title,
        price: poster.price,
        image: poster.image_url
      });
      toast({
        title: "Added to cart!",
        description: `${posterTitle} has been added to your cart.`,
      });
    }
  };

  return (
    <section className="py-12 bg-posterzone-lightgray">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Star className="w-6 h-6 text-posterzone-orange mr-3" />
              <h2 className="text-3xl font-bold text-posterzone-charcoal">Best Sellers</h2>
            </div>
            <Link to="/best-sellers">
              <Button variant="outline">
                View All
              </Button>
            </Link>
          </div>
          
          {bestSellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((poster, index) => (
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
                      className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    
                    {/* Quick action overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        className="bg-posterzone-orange text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
                        onClick={() => addToCart(poster.title)}
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
                    <h3 className="text-lg font-medium mb-2 hover:text-posterzone-orange cursor-pointer">
                      {poster.title}
                    </h3>
                    <p className="text-posterzone-blue font-semibold">₹{poster.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No bestseller posters available. Add some through the admin panel!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
