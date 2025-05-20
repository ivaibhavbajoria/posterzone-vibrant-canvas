
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-posterzone-lightgray to-white py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div 
            className="z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-posterzone-charcoal">Transform Your Space With </span>
              <span className="text-gradient">Stunning Art</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover unique posters that reflect your style and personality. 
              From minimalist designs to vibrant artwork.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-posterzone-orange hover:bg-posterzone-orange/90 text-white px-6 py-2"
              >
                Shop Now <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button variant="outline">
                View Collections
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg transform translate-y-6">
                  <img 
                    src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
                    alt="Digital Art Poster" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                    alt="Abstract Poster" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 transform translate-y-10">
                <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                    alt="Tech Poster" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb" 
                    alt="Night Sky Poster" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-posterzone-yellow rounded-full opacity-50"></div>
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-posterzone-blue rounded-full opacity-50"></div>
          </motion.div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-posterzone-blue rounded-full opacity-10"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-posterzone-orange rounded-full opacity-10"></div>
    </section>
  );
};

export default HeroSection;
