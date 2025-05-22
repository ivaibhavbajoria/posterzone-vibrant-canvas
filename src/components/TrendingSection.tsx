
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const TrendingSection = ({ onAddToCart }) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const trendingPosters = [
    {
      id: 1,
      title: "Neon Sunset Beach",
      image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
      price: 29.99,
    },
    {
      id: 2,
      title: "Abstract Geometry",
      image: "https://images.unsplash.com/photo-1552083375-1447ce886485",
      price: 24.99,
    },
    {
      id: 3,
      title: "Galaxy Exploration",
      image: "https://images.unsplash.com/photo-1539593395743-7da5ee10ff07",
      price: 27.99,
    },
    {
      id: 4,
      title: "Mountain Sunrise",
      image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
      price: 22.99,
    }
  ];

  const handleAddToCart = (poster) => {
    if (onAddToCart) {
      onAddToCart(poster);
    } else {
      addToCart({
        id: poster.id,
        title: poster.title,
        price: poster.price,
        image: poster.image
      });
      
      toast({
        title: "Added to cart!",
        description: `${poster.title} has been added to your cart.`,
      });
    }
  };

  const viewPosterDetails = (id) => {
    navigate(`/poster/${id}`);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-posterzone-orange mr-3" />
              <h2 className="text-3xl font-bold text-posterzone-charcoal">Trending Now</h2>
            </div>
            <Link to="/trending">
              <Button variant="outline">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPosters.map((poster, index) => (
              <motion.div
                key={poster.id}
                className="poster-card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="relative overflow-hidden group">
                  <img 
                    src={poster.image} 
                    alt={poster.title} 
                    className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => viewPosterDetails(poster.id)}
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
                  
                  {/* Trending badge */}
                  <div className="absolute top-2 right-2 bg-posterzone-orange text-white text-xs px-2 py-1 rounded-md">
                    Trending
                  </div>
                </div>
                <div className="p-4">
                  <h3 
                    className="text-lg font-medium mb-2 hover:text-posterzone-orange cursor-pointer"
                    onClick={() => viewPosterDetails(poster.id)}
                  >
                    {poster.title}
                  </h3>
                  <p className="text-posterzone-blue font-semibold">${poster.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
