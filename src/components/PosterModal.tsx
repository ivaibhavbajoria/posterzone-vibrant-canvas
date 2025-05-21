
import { X, Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type PosterType = {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
  liked: boolean;
};

type PosterModalProps = {
  poster: PosterType;
  onClose: () => void;
  onAddToCart: () => void;
  onToggleLike: () => void;
};

const PosterModal = ({ poster, onClose, onAddToCart, onToggleLike }: PosterModalProps) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("12×16″");

  // Handle view details click
  const handleViewDetails = () => {
    navigate(`/poster/${poster.id}`);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <motion.div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Poster Image */}
          <div className="relative w-full md:w-1/2">
            <img 
              src={poster.image} 
              alt={poster.title}
              className="w-full h-full object-cover object-center min-h-[300px]"
            />
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-posterzone-orange hover:text-white transition-colors"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Poster Details */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2">{poster.title}</h2>
            <p className="text-posterzone-blue text-2xl font-bold mb-4">${poster.price.toFixed(2)}</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 mb-4">
                A beautiful high-quality art print that will add character and style to any room. 
                Printed on premium matte paper with vibrant, fade-resistant inks.
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
                {["8×10″", "12×16″", "18×24″"].map(size => (
                  <button 
                    key={size}
                    className={`border rounded py-2 transition-colors ${
                      selectedSize === size 
                        ? "border-posterzone-orange bg-posterzone-orange/10 text-posterzone-orange" 
                        : "border-gray-300 hover:border-posterzone-orange hover:bg-posterzone-lightgray"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                className="flex-1 bg-posterzone-orange hover:bg-posterzone-orange/90"
                onClick={onAddToCart}
              >
                <ShoppingCart className="mr-2" size={18} />
                Add to Cart
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleViewDetails}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  className="p-2"
                  onClick={onToggleLike}
                >
                  <Heart 
                    size={20} 
                    fill={poster.liked ? "#FF5733" : "none"} 
                    className={poster.liked ? "text-posterzone-orange" : ""}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PosterModal;
