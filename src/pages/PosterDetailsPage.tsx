import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

type PosterType = {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
  liked: boolean;
};

const PosterDetailsPage = () => {
  const { toast } = useToast();
  const { posterId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [poster, setPoster] = useState<PosterType | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("12×16″");
  const [quantity, setQuantity] = useState<number>(1);

  // Mock data for now - in a real app, you'd fetch this from an API
  useEffect(() => {
    // Simulating API fetch for poster details
    const mockPosters = [
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
      }
    ];
    
    const foundPoster = mockPosters.find(p => p.id === Number(posterId));
    
    if (foundPoster) {
      setPoster(foundPoster);
    } else {
      // Handle not found
      navigate('/not-found');
    }
  }, [posterId, navigate]);

  // Toggle liked status
  const toggleLike = () => {
    if (poster) {
      setPoster({...poster, liked: !poster.liked});
      toast({
        title: poster.liked ? "Removed from favorites" : "Added to favorites",
        description: poster.liked 
          ? `${poster.title} removed from your favorites`
          : `${poster.title} added to your favorites`,
      });
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    if (poster) {
      addToCart({
        id: poster.id,
        title: poster.title,
        price: poster.price,
        image: poster.image,
        size: selectedSize
      }, quantity);
      
      toast({
        title: "Added to cart!",
        description: `${quantity} × ${poster?.title} (${selectedSize}) added to your cart.`,
      });
    }
  };

  // Update quantity
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (!poster) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <Button 
              variant="outline"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Poster Image */}
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={poster.image} 
                alt={poster.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Poster Details */}
            <div>
              <h1 className="text-3xl font-bold text-posterzone-charcoal mb-2">{poster.title}</h1>
              <p className="text-2xl font-bold text-posterzone-blue mb-4">${poster.price.toFixed(2)}</p>
              
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
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                <div className="flex border rounded w-32">
                  <button
                    className="px-3 py-2"
                    onClick={() => updateQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <span className="flex-1 text-center py-2">{quantity}</span>
                  <button
                    className="px-3 py-2"
                    onClick={() => updateQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-posterzone-orange hover:bg-posterzone-orange/90"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2" size={18} />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="p-2"
                  onClick={toggleLike}
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
        </motion.div>
      </div>
    </div>
  );
};

export default PosterDetailsPage;
