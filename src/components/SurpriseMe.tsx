import { useState } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type SurpriseMeProps = {
  onAddToCart: () => void;
};

const SurpriseMe = ({ onAddToCart }: SurpriseMeProps) => {
  const { toast } = useToast();
  const [category, setCategory] = useState("");
  const [posterCount, setPosterCount] = useState("3");
  const [generatedPosters, setGeneratedPosters] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { value: "movies", label: "Movies" },
    { value: "nature", label: "Nature" },
    { value: "abstract", label: "Abstract Art" },
    { value: "minimalist", label: "Minimalist" },
    { value: "vintage", label: "Vintage" },
    { value: "music", label: "Music" },
    { value: "sports", label: "Sports" },
    { value: "travel", label: "Travel" },
  ];

  // Sample poster data for demonstration
  const samplePosters = {
    movies: [
      { id: 1, title: "Classic Film Noir", image: "https://images.unsplash.com/photo-1539655730630-7aabf9de5e8b", price: 24.99 },
      { id: 2, title: "Sci-Fi Adventure", image: "https://images.unsplash.com/photo-1536440136630-a8c3a9f3aee7", price: 29.99 },
      { id: 3, title: "Cinema Masterpiece", image: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891", price: 27.99 },
      { id: 4, title: "Action Movie", image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8", price: 32.99 },
      { id: 5, title: "Drama Series", image: "https://images.unsplash.com/photo-1581905764498-f1b60bae941a", price: 26.99 },
    ],
    nature: [
      { id: 6, title: "Forest Dawn", image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb", price: 24.99 },
      { id: 7, title: "Serene Lake", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef", price: 29.99 },
      { id: 8, title: "Mountain Range", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5", price: 27.99 },
      { id: 9, title: "Autumn Trees", image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", price: 32.99 },
      { id: 10, title: "Beach Sunset", image: "https://images.unsplash.com/photo-1502657877623-f66bf489d236", price: 26.99 },
    ],
    abstract: [
      { id: 11, title: "Geometric Patterns", image: "https://images.unsplash.com/photo-1552083375-1447ce886485", price: 24.99 },
      { id: 12, title: "Color Explosion", image: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3", price: 29.99 },
      { id: 13, title: "Fluid Art", image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52a", price: 27.99 },
      { id: 14, title: "Digital Abstract", image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8", price: 32.99 },
      { id: 15, title: "Minimalist Lines", image: "https://images.unsplash.com/photo-1486718448742-163732cd1544", price: 26.99 },
    ],
  };

  const generateRandomPosters = () => {
    if (!category) {
      toast({
        title: "Please select a category",
        description: "Choose a category to generate surprise posters",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let allPosters = samplePosters[category as keyof typeof samplePosters] || [];
      
      if (!allPosters.length) {
        allPosters = Object.values(samplePosters).flat();
      }
      
      const shuffled = [...allPosters].sort(() => 0.5 - Math.random());
      const count = Math.min(parseInt(posterCount), shuffled.length);
      const selected = shuffled.slice(0, count);
      
      setGeneratedPosters(selected);
      setIsGenerating(false);
      
      toast({
        title: "Surprise posters generated!",
        description: `Generated ${count} ${category} posters for you.`,
      });
    }, 1000);
  };

  const addPosterToCart = (posterTitle: string) => {
    onAddToCart();
    toast({
      title: "Added to cart!",
      description: `${posterTitle} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden shadow-md">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-700">
                  What kind of posters do you like?
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="posterCount" className="text-sm font-medium text-gray-700">
                  How many posters?
                </label>
                <div className="flex space-x-2">
                  {["1", "3", "5"].map((count) => (
                    <Button
                      key={count}
                      type="button"
                      variant={posterCount === count ? "default" : "outline"}
                      className={`flex-1 ${
                        posterCount === count ? "bg-posterzone-orange" : ""
                      }`}
                      onClick={() => setPosterCount(count)}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={generateRandomPosters}
                className="w-full mt-4 bg-posterzone-blue hover:bg-posterzone-blue/90"
                disabled={isGenerating}
              >
                <Gift className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Surprise Me!"}
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="h-full flex items-center justify-center">
              {generatedPosters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {generatedPosters.map((poster, index) => (
                    <motion.div
                      key={poster.id}
                      className="poster-card overflow-hidden"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="relative overflow-hidden group">
                        <img 
                          src={poster.image} 
                          alt={poster.title} 
                          className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            className="bg-posterzone-orange text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
                            onClick={() => addPosterToCart(poster.title)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="text-sm font-medium mb-1 hover:text-posterzone-orange cursor-pointer truncate">
                          {poster.title}
                        </h3>
                        <p className="text-posterzone-blue font-semibold text-sm">${poster.price.toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg w-full">
                  <Gift className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">Surprise Yourself!</h3>
                  <p className="text-gray-500">
                    Select a category and how many posters you'd like to see
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurpriseMe;
