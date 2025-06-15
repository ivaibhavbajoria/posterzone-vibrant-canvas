
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { localStorageService, LocalPoster } from "@/services/localStorageService";

type PosterGridProps = {
  category: string;
};

const PosterGrid = ({ category }: PosterGridProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [posters, setPosters] = useState<LocalPoster[]>([]);
  const [likedPosters, setLikedPosters] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load posters from localStorage
    localStorageService.initializeData();
    const allPosters = localStorageService.getPosters();
    setPosters(allPosters);
    
    // Load liked posters from localStorage
    const savedLikes = localStorage.getItem('likedPosters');
    if (savedLikes) {
      setLikedPosters(new Set(JSON.parse(savedLikes)));
    }
  }, []);

  // Filter posters by category
  const filteredPosters = category === "all" 
    ? posters 
    : posters.filter(poster => poster.category.toLowerCase() === category.toLowerCase());

  // Toggle liked status for a poster
  const toggleLike = (id: string) => {
    const newLikedPosters = new Set(likedPosters);
    const isLiked = likedPosters.has(id);
    
    if (isLiked) {
      newLikedPosters.delete(id);
    } else {
      newLikedPosters.add(id);
    }
    
    setLikedPosters(newLikedPosters);
    localStorage.setItem('likedPosters', JSON.stringify(Array.from(newLikedPosters)));

    const poster = posters.find(p => p.id === id);
    if (poster) {
      toast({
        title: isLiked ? "Removed from favorites" : "Added to favorites",
        description: isLiked 
          ? `${poster.title} removed from your favorites`
          : `${poster.title} added to your favorites`,
      });
    }
  };

  // Handle add to cart
  const handleAddToCart = (poster: LocalPoster) => {
    addToCart({
      id: parseInt(poster.id),
      title: poster.title,
      price: poster.price,
      image: poster.image_url
    });
    
    toast({
      title: "Added to cart!",
      description: `${poster.title} has been added to your cart.`,
    });
  };

  // Open poster details page
  const openPosterDetails = (poster: LocalPoster) => {
    navigate(`/poster/${poster.id}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosters.map((poster, index) => (
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
                onClick={() => openPosterDetails(poster)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              
              {/* Quick action buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                <button 
                  className="bg-white p-3 rounded-full hover:bg-posterzone-orange hover:text-white transition-colors"
                  onClick={() => openPosterDetails(poster)}
                >
                  <Plus size={18} />
                </button>
                <div className="flex gap-2">
                  <button 
                    className="bg-white p-3 rounded-full hover:bg-posterzone-orange hover:text-white transition-colors"
                    onClick={() => toggleLike(poster.id)}
                  >
                    <Heart 
                      size={18} 
                      fill={likedPosters.has(poster.id) ? "#FF5733" : "none"} 
                      className={likedPosters.has(poster.id) ? "text-posterzone-orange" : ""}
                    />
                  </button>
                  <button 
                    className="bg-white p-3 rounded-full hover:bg-posterzone-orange hover:text-white transition-colors"
                    onClick={() => handleAddToCart(poster)}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
              
              {/* Status badges */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
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
            <div className="p-4">
              <h3 
                className="text-lg font-medium mb-2 hover:text-posterzone-orange cursor-pointer"
                onClick={() => openPosterDetails(poster)}
              >
                {poster.title}
              </h3>
              <p className="text-posterzone-blue font-semibold">₹{poster.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 capitalize">{poster.category}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show "No posters found" message if filtered list is empty */}
      {filteredPosters.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-500">
            {category === "all" 
              ? "No posters found. Add some through the admin panel!"
              : `No posters found in the "${category}" category.`
            }
          </p>
        </div>
      )}
    </>
  );
};

export default PosterGrid;
