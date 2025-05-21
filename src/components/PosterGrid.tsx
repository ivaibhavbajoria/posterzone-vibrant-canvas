import { useState } from "react";
import { Heart, ShoppingCart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import PosterModal from "./PosterModal";
import { Link, useNavigate } from "react-router-dom";

type PosterGridProps = {
  category: string;
  onAddToCart: () => void;
};

type PosterType = {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
  liked: boolean;
};

const PosterGrid = ({ category, onAddToCart }: PosterGridProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posters, setPosters] = useState<PosterType[]>([
    {
      id: 1,
      title: "Digital Neon Cityscape",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      price: 24.99,
      category: "abstract",
      liked: false,
    },
    {
      id: 2,
      title: "Minimal Code Pattern",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      price: 19.99,
      category: "minimalist",
      liked: false,
    },
    {
      id: 3,
      title: "Tech Perspective",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      price: 29.99,
      category: "abstract",
      liked: false,
    },
    {
      id: 4,
      title: "Starry Night Forest",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
      price: 22.99,
      category: "nature",
      liked: false,
    },
    {
      id: 5,
      title: "Yellow Light Pathways",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      price: 24.99,
      category: "abstract",
      liked: false,
    },
    {
      id: 6,
      title: "Minimalist Wave Structure",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544",
      price: 19.99,
      category: "minimalist",
      liked: false,
    },
  ]);

  const [selectedPoster, setSelectedPoster] = useState<PosterType | null>(null);

  // Filter posters by category
  const filteredPosters = category === "all" 
    ? posters 
    : posters.filter(poster => poster.category === category);

  // Toggle liked status for a poster
  const toggleLike = (id: number) => {
    setPosters(posters.map(poster => 
      poster.id === id 
        ? { ...poster, liked: !poster.liked } 
        : poster
    ));

    const poster = posters.find(p => p.id === id);
    if (poster) {
      toast({
        title: poster.liked ? "Removed from favorites" : "Added to favorites",
        description: poster.liked 
          ? `${poster.title} removed from your favorites`
          : `${poster.title} added to your favorites`,
      });
    }
  };

  // Open poster details modal
  const openPosterDetails = (poster: PosterType) => {
    // Navigate to the poster details page instead of opening the modal
    navigate(`/poster/${poster.id}`);
  };

  // Close poster details modal (keep this for backward compatibility)
  const closePosterDetails = () => {
    setSelectedPoster(null);
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
                      fill={poster.liked ? "#FF5733" : "none"} 
                      className={poster.liked ? "text-posterzone-orange" : ""}
                    />
                  </button>
                  <button 
                    className="bg-white p-3 rounded-full hover:bg-posterzone-orange hover:text-white transition-colors"
                    onClick={onAddToCart}
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

      {/* Show "No posters found" message if filtered list is empty */}
      {filteredPosters.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-500">No posters found in this category.</p>
        </div>
      )}
    </>
  );
};

export default PosterGrid;
