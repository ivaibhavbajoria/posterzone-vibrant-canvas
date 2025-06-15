
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";

// Define the collage packs array here
const COLLAGE_PACKS = [
  {
    id: 1,
    title: "Urban Vibes Collection",
    image: "https://images.unsplash.com/photo-1579541591970-e5942951a2d5",
    price: 49.99,
    posterCount: 4,
    description: "Bring the energy of the city to your home with this urban-inspired collage pack!"
  },
  {
    id: 2,
    title: "Nature Escape Set",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
    price: 54.99,
    posterCount: 3,
    description: "A calming collection of nature-themed art for your personal oasis."
  },
  {
    id: 3,
    title: "Minimalist Home Bundle",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013",
    price: 59.99,
    posterCount: 5,
    description: "Clean lines and neutral tones for a modern minimalist look."
  },
  {
    id: 4,
    title: "Movie Classics Collection",
    image: "https://images.unsplash.com/photo-1536440136630-a8c3a9f3aee7",
    price: 64.99,
    posterCount: 6,
    description: "Celebrate timeless movies with these retro-style posters."
  },
  {
    id: 5,
    title: "Abstract Art Series",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52a",
    price: 45.99,
    posterCount: 3,
    description: "An energetic splash of color for bold interiors."
  },
  {
    id: 6,
    title: "Vintage Photography Set",
    image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd",
    price: 52.99,
    posterCount: 4,
    description: "Classic black and white photography prints for a timeless vibe."
  },
  {
    id: 7,
    title: "Ocean Views Bundle",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    price: 58.99,
    posterCount: 5,
    description: "Feel the breeze of the ocean with this relaxing poster pack."
  },
  {
    id: 8,
    title: "Dark Themes Collection",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
    price: 49.99,
    posterCount: 4,
    description: "Moody and atmospheric prints for dramatic spaces."
  }
];

const CollagePackDetailsPage = () => {
  const { packId } = useParams<{ packId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [pack, setPack] = useState<any>(null);

  useEffect(() => {
    // Robust handling: support both string and number, and fallback if not valid
    if (!packId) {
      // packId missing e.g. if user visits /collage-pack/ with no id
      navigate("/not-found", { replace: true });
      return;
    }
    const numericPackId = Number(packId);
    if (isNaN(numericPackId)) {
      navigate("/not-found", { replace: true });
      return;
    }
    const foundPack = COLLAGE_PACKS.find(p => p.id === numericPackId);
    if (foundPack) {
      setPack(foundPack);
    } else {
      navigate("/not-found", { replace: true });
    }
  }, [packId, navigate]);

  if (!pack) {
    return null; // or loading spinner
  }

  const handleAddToCart = () => {
    addToCart({
      id: pack.id,
      title: pack.title,
      price: pack.price,
      image: pack.image
    });
    toast({
      title: "Added to cart!",
      description: `${pack.title} has been added to your cart.`,
    });
  };

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
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={pack.image || '/placeholder.svg'}
                alt={pack.title}
                className="w-full h-full object-cover"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-posterzone-charcoal mb-2">{pack.title}</h1>
              <p className="text-2xl font-bold text-posterzone-blue mb-4">${pack.price.toFixed(2)}</p>
              <p className="mb-4 text-gray-600">{pack.description}</p>
              <div className="mb-4">
                <span className="inline-block bg-posterzone-yellow text-posterzone-charcoal text-xs px-3 py-1 rounded-full font-medium">
                  {pack.posterCount} Posters in Pack
                </span>
              </div>
              <Button 
                className="bg-posterzone-orange hover:bg-posterzone-orange/90 flex items-center"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CollagePackDetailsPage;
