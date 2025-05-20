
import { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CollagePacks = () => {
  const { toast } = useToast();
  const [collagePacks, setCollagePacks] = useState([
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
    },
    {
      id: 5,
      title: "Abstract Art Series",
      image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52a",
      price: 45.99,
      posterCount: 3,
    },
    {
      id: 6,
      title: "Vintage Photography Set",
      image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd",
      price: 52.99,
      posterCount: 4,
    },
    {
      id: 7,
      title: "Ocean Views Bundle",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      price: 58.99,
      posterCount: 5,
    },
    {
      id: 8,
      title: "Dark Themes Collection",
      image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
      price: 49.99,
      posterCount: 4,
    },
  ]);

  const addToCart = (collageTitle: string) => {
    toast({
      title: "Added to cart!",
      description: `${collageTitle} has been added to your cart.`,
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
            <Image className="w-6 h-6 text-posterzone-orange mr-3" />
            <h1 className="text-4xl font-bold text-posterzone-charcoal">Collage Packs</h1>
          </div>
          <p className="text-gray-600 mb-8">Multiple posters in one pack for the perfect wall arrangement</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
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
                  <h3 className="text-lg font-medium mb-2 hover:text-posterzone-orange cursor-pointer">
                    {collage.title}
                  </h3>
                  <p className="text-posterzone-blue font-semibold">${collage.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Collage Pack • {collage.posterCount} Posters</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CollagePacks;
