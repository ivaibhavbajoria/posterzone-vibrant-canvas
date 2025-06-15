import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type CollagePacksSectionProps = {
  onAddToCart: (poster: any) => void;
};

const CollagePacksSection = ({ onAddToCart }: CollagePacksSectionProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const collagePacks = [
    {
      id: 1,
      title: "Urban Vibes Collection",
      image: "https://images.unsplash.com/photo-1579541591970-e5942951a2d5",
      price: 49.99,
      posterCount: 4,
    },
    {
      id: 2,
      title: "Nature Escape Set",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
      price: 54.99,
      posterCount: 3,
    },
    {
      id: 3,
      title: "Minimalist Home Bundle",
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013",
      price: 59.99,
      posterCount: 5,
    },
    {
      id: 4,
      title: "Movie Classics Collection",
      image: "https://images.unsplash.com/photo-1536440136630-a8c3a9f3aee7",
      price: 64.99,
      posterCount: 6,
    }
  ];

  const addToCart = (collageTitle: string) => {
    onAddToCart({
      id: collagePacks.find(p => p.title === collageTitle)?.id,
      title: collageTitle,
      price: collagePacks.find(p => p.title === collageTitle)?.price,
      image: collagePacks.find(p => p.title === collageTitle)?.image
    });
    toast({
      title: "Added to cart!",
      description: `${collageTitle} has been added to your cart.`,
    });
  };

  const goToDetails = (id: number) => {
    navigate(`/collage-pack/${id}`);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Image className="w-6 h-6 text-posterzone-orange mr-3" />
              <h2 className="text-3xl font-bold text-posterzone-charcoal">Collage Packs</h2>
            </div>
            <Link to="/collage-packs">
              <Button variant="outline">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collagePacks.map((collage, index) => (
              <motion.div
                key={collage.id}
                className="poster-card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="relative overflow-hidden group">
                  <img 
                    src={collage.image} 
                    alt={collage.title} 
                    className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => goToDetails(collage.id)}
                  />
                  
                  {/* Quick action overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      className="bg-posterzone-orange text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
                      onClick={() => addToCart(collage.title)}
                    >
                      Add to Cart
                    </button>
                  </div>
                  
                  {/* Poster count badge */}
                  <div className="absolute top-2 right-2 bg-posterzone-yellow text-posterzone-charcoal text-xs px-2 py-1 rounded-md">
                    {collage.posterCount} Posters
                  </div>
                </div>
                <div className="p-4">
                  <h3 
                    className="text-lg font-medium mb-2 hover:text-posterzone-orange cursor-pointer"
                    onClick={() => goToDetails(collage.id)}
                  >
                    {collage.title}
                  </h3>
                  <p className="text-posterzone-blue font-semibold">${collage.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Collage Pack • {collage.posterCount} Posters</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollagePacksSection;
