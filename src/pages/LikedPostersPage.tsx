
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PosterModal from "@/components/PosterModal";

type PosterType = {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
  liked: boolean;
};

const LikedPostersPage = () => {
  const { toast } = useToast();
  const [likedPosters, setLikedPosters] = useState<PosterType[]>([
    {
      id: 1,
      title: "Digital Neon Cityscape",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      price: 24.99,
      category: "abstract",
      liked: true,
    },
    {
      id: 4,
      title: "Starry Night Forest",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
      price: 22.99,
      category: "nature",
      liked: true,
    },
    {
      id: 6,
      title: "Minimalist Wave Structure",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544",
      price: 19.99,
      category: "minimalist",
      liked: true,
    },
  ]);
  
  const [selectedPoster, setSelectedPoster] = useState<PosterType | null>(null);

  // Toggle liked status for a poster
  const toggleLike = (id: number) => {
    setLikedPosters(likedPosters.filter(poster => poster.id !== id));
    
    toast({
      title: "Removed from favorites",
      description: "Poster has been removed from your favorites",
    });
  };

  // Open poster details modal
  const openPosterDetails = (poster: PosterType) => {
    setSelectedPoster(poster);
  };

  // Close poster details modal
  const closePosterDetails = () => {
    setSelectedPoster(null);
  };

  // Add to cart
  const addToCart = () => {
    toast({
      title: "Added to cart!",
      description: "Item has been added to your cart.",
    });
  };

  const isLikedEmpty = likedPosters.length === 0;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <Heart className="w-6 h-6 text-posterzone-orange mr-3" fill="#FF5733" />
            <h1 className="text-4xl font-bold text-posterzone-charcoal">My Favorites</h1>
          </div>

          {isLikedEmpty ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-6">You don't have any favorite posters yet</p>
              <Link to="/collections">
                <Button className="bg-posterzone-orange hover:bg-posterzone-orange/90">
                  Browse Collections
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {likedPosters.map((poster, index) => (
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
                      onClick={() => openPosterDetails(poster)}
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
                            fill="#FF5733"
                            className="text-posterzone-orange"
                          />
                        </button>
                        <button 
                          className="bg-white p-3 rounded-full hover:bg-posterzone-orange hover:text-white transition-colors"
                          onClick={addToCart}
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 
                      className="text-lg font-medium mb-2 hover:text-posterzone-orange cursor-pointer"
                      onClick={() => openPosterDetails(poster)}
                    >
                      {poster.title}
                    </h3>
                    <p className="text-posterzone-blue font-semibold">${poster.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Poster details modal */}
      {selectedPoster && (
        <PosterModal 
          poster={selectedPoster} 
          onClose={closePosterDetails} 
          onAddToCart={addToCart}
          onToggleLike={() => toggleLike(selectedPoster.id)}
        />
      )}
    </div>
  );
};

export default LikedPostersPage;
