
import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BestSellers = () => {
  const { toast } = useToast();
  const [bestSellerPosters, setBestSellerPosters] = useState([
    {
      id: 1,
      title: "Abstract Geometry Lines",
      image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52a",
      price: 34.99,
      sales: 1283,
    },
    {
      id: 2,
      title: "Minimalist Nature",
      image: "https://images.unsplash.com/photo-1493382051629-7eb03ec93ea2",
      price: 29.99,
      sales: 956,
    },
    {
      id: 3,
      title: "Vintage Cinema Poster",
      image: "https://images.unsplash.com/photo-1536440136630-a8c3a9f3aee7",
      price: 39.99,
      sales: 892,
    },
    {
      id: 4,
      title: "Urban Cityscape",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      price: 32.99,
      sales: 845,
    },
    {
      id: 5,
      title: "Sunset Beach",
      image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236",
      price: 28.99,
      sales: 790,
    },
    {
      id: 6,
      title: "Mountain Landscape",
      image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
      price: 27.99,
      sales: 742,
    },
    {
      id: 7,
      title: "Modern Art Explosion",
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5",
      price: 36.99,
      sales: 703,
    },
    {
      id: 8,
      title: "Deep Forest",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
      price: 25.99,
      sales: 685,
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
            <Star className="w-6 h-6 text-posterzone-orange mr-3" />
            <h1 className="text-4xl font-bold text-posterzone-charcoal">Best Sellers</h1>
          </div>
          <p className="text-gray-600 mb-8">Our most popular posters of all time</p>

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
                  
                  {/* Best seller badge */}
                  <div className="absolute top-2 right-2 bg-posterzone-blue text-white text-xs px-2 py-1 rounded-md">
                    Best Seller
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2 hover:text-posterzone-orange cursor-pointer">
                    {poster.title}
                  </h3>
                  <p className="text-posterzone-blue font-semibold">${poster.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{poster.sales.toLocaleString()} sold</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BestSellers;
