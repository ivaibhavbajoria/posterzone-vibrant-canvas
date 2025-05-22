
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type BestSellersSectionProps = {
  onAddToCart: (poster: any) => void;
};

const BestSellersSection = ({ onAddToCart }: BestSellersSectionProps) => {
  const { toast } = useToast();

  const bestSellers = [
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
    }
  ];

  const addToCart = (posterTitle: string) => {
    onAddToCart({
      id: bestSellers.find(p => p.title === posterTitle)?.id,
      title: posterTitle,
      price: bestSellers.find(p => p.title === posterTitle)?.price,
      image: bestSellers.find(p => p.title === posterTitle)?.image
    });
    toast({
      title: "Added to cart!",
      description: `${posterTitle} has been added to your cart.`,
    });
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
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
