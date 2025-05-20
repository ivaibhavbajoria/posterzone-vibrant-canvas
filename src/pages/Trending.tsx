
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Trending = () => {
  const { toast } = useToast();
  const [trendingPosters, setTrendingPosters] = useState([
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
    },
    {
      id: 5,
      title: "Urban Nightscape",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
      price: 26.99,
    },
    {
      id: 6,
      title: "Retro Wave Style",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
      price: 23.99,
    },
    {
      id: 7,
      title: "Tech Abstract",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      price: 25.99,
    },
    {
      id: 8,
      title: "Minimalist Nature",
      image: "https://images.unsplash.com/photo-1439853949127-fa647821eba0",
      price: 28.99,
    },
  ]);

  const addToCart = (posterTitle: string) => {
    toast({
      title: "Added to cart!",
      description: `${posterTitle} has been added to your cart.`,
    });
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
            <TrendingUp className="w-6 h-6 text-posterzone-orange mr-3" />
            <h1 className="text-4xl font-bold text-posterzone-charcoal">Trending Now</h1>
          </div>
          <p className="text-gray-600 mb-8">Discover the most popular posters that everyone's loving right now</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  
                  {/* Trending badge */}
                  <div className="absolute top-2 right-2 bg-posterzone-orange text-white text-xs px-2 py-1 rounded-md">
                    Trending
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2 hover:text-posterzone-orange cursor-pointer">
                    {poster.title}
                  </h3>
                  <p className="text-posterzone-blue font-semibold">${poster.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Trending;
