
import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, HelpCircle, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { useCart } from "@/contexts/CartContext";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

type SurpriseMeProps = {
  onAddToCart?: () => void;
};

const SurpriseMe = ({ onAddToCart }: SurpriseMeProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [category, setCategory] = useState("");
  const [posterCount, setPosterCount] = useState("5");
  const [customPosterCount, setCustomPosterCount] = useState("5");
  const [generatedPosters, setGeneratedPosters] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [orientation, setOrientation] = useState("no-preference");
  const [budgetRange, setBudgetRange] = useState([20, 50]);
  const [roomType, setRoomType] = useState("");
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);

  const categories = [
    { value: "movies", label: "Movies" },
    { value: "music", label: "Music" },
    { value: "nature", label: "Nature" },
    { value: "abstract", label: "Abstract Art" },
    { value: "minimalist", label: "Minimalist" },
    { value: "vintage", label: "Vintage" },
    { value: "sports", label: "Sports" },
    { value: "travel", label: "Travel" },
    { value: "gaming", label: "Gaming" },
    { value: "anime", label: "Anime" },
    { value: "quotes", label: "Quotes" },
    { value: "celebs", label: "Celebrities" },
  ];

  const styleOptions = [
    { id: "digital", label: "Digital Art" },
    { id: "sketch", label: "Sketch" },
    { id: "watercolor", label: "Watercolor" },
    { id: "graffiti", label: "Graffiti" },
    { id: "3d", label: "3D Render" },
    { id: "minimalist", label: "Minimalist" },
  ];

  const roomOptions = [
    { value: "bedroom", label: "Bedroom" },
    { value: "office", label: "Office" },
    { value: "livingroom", label: "Living Room" },
    { value: "gamingroom", label: "Gaming Room" },
    { value: "studio", label: "Studio" },
    { value: "kidsroom", label: "Kids' Room" },
  ];

  const posterSizes = [
    { value: "a4", label: "A4 (8.3\" × 11.7\")" },
    { value: "a3", label: "A3 (11.7\" × 16.5\")" },
    { value: "a2", label: "A2 (16.5\" × 23.4\")" },
    { value: "12x18", label: "12\" × 18\"" },
    { value: "16x20", label: "16\" × 20\"" },
    { value: "24x36", label: "24\" × 36\"" },
  ];

  const colorOptions = [
    { id: "bold", label: "Bold", color: "#FF4500" },
    { id: "monochrome", label: "Monochrome", color: "#333333" },
    { id: "pastels", label: "Pastels", color: "#FFB6C1" },
    { id: "earthy", label: "Earthy", color: "#8B4513" },
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
    // Add other categories as needed
    music: [
      { id: 16, title: "Vinyl Record", image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1", price: 24.99 },
      { id: 17, title: "Concert Experience", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a", price: 29.99 },
      { id: 18, title: "Musical Notes", image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76", price: 27.99 },
    ],
  };

  const toggleStylePreference = (style: string) => {
    setStylePreferences(prev => 
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
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
        // Fallback to all posters if category has no items
        allPosters = Object.values(samplePosters).flat();
      }
      
      // Apply budget filter
      allPosters = allPosters.filter(poster => 
        poster.price >= budgetRange[0] && poster.price <= budgetRange[1]
      );
      
      const shuffled = [...allPosters].sort(() => 0.5 - Math.random());
      const count = Math.min(parseInt(posterCount === "custom" ? customPosterCount : posterCount), shuffled.length);
      const selected = shuffled.slice(0, count);
      
      setGeneratedPosters(selected);
      setIsGenerating(false);
      
      toast({
        title: "Surprise posters generated!",
        description: `Generated ${count} ${category} posters for you.`,
      });
    }, 1000);
  };

  const addAllToCart = () => {
    if (!generatedPosters.length) {
      toast({
        title: "No posters to add",
        description: "Generate some surprise posters first",
        variant: "destructive",
      });
      return;
    }

    generatedPosters.forEach(poster => {
      addToCart({
        id: poster.id,
        title: poster.title,
        price: poster.price,
        image: poster.image,
        size: "Standard"
      });
    });

    toast({
      title: "Success!",
      description: `Added ${generatedPosters.length} posters to your cart with your preferences.`,
    });

    if (onAddToCart) {
      onAddToCart();
    }
  };

  const addPosterToCart = (poster: any) => {
    addToCart({
      id: poster.id,
      title: poster.title,
      price: poster.price,
      image: poster.image,
      size: "Standard"
    });

    toast({
      title: "Added to cart!",
      description: `${poster.title} has been added to your cart.`,
    });

    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div className="space-y-8">
      {/* How It Works Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <HelpCircle className="text-posterzone-blue h-6 w-6" />
            <h2 className="text-xl font-semibold">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                title: "Choose Your Preferences",
                description: "Select your preferred themes, styles, and how many posters you'd like to see.",
              },
              {
                step: 2,
                title: "Generate Recommendations",
                description: "Our algorithm will curate a personalized selection of posters tailored to your taste.",
              },
              {
                step: 3,
                title: "Add to Cart & Enjoy",
                description: "Choose the posters you love, add them to your cart, and transform your space!",
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="bg-posterzone-orange text-white rounded-full h-8 w-8 flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Surprise Me Feature */}
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
                    How many posters? (5-50)
                  </label>
                  <div className="flex space-x-2">
                    {["5", "10", "25", "custom"].map((count) => (
                      <Button
                        key={count}
                        type="button"
                        variant={posterCount === count ? "default" : "outline"}
                        className={`flex-1 ${
                          posterCount === count ? "bg-posterzone-orange" : ""
                        }`}
                        onClick={() => setPosterCount(count)}
                      >
                        {count === "custom" ? "Custom" : count}
                      </Button>
                    ))}
                  </div>
                  
                  {posterCount === "custom" && (
                    <div className="mt-2">
                      <Input
                        type="number"
                        min="5"
                        max="50"
                        value={customPosterCount}
                        onChange={(e) => setCustomPosterCount(e.target.value)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">Choose between 5-50 posters</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Poster Orientation
                  </label>
                  <RadioGroup value={orientation} onValueChange={setOrientation}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="portrait" id="portrait" />
                      <label htmlFor="portrait" className="text-sm">Portrait</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="landscape" id="landscape" />
                      <label htmlFor="landscape" className="text-sm">Landscape</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="square" id="square" />
                      <label htmlFor="square" className="text-sm">Square</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no-preference" id="no-preference" />
                      <label htmlFor="no-preference" className="text-sm">No Preference</label>
                    </div>
                  </RadioGroup>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="advanced-options">
                    <AccordionTrigger>Advanced Options</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Style Preference</label>
                          <div className="grid grid-cols-2 gap-2">
                            {styleOptions.map((style) => (
                              <div key={style.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`style-${style.id}`}
                                  checked={stylePreferences.includes(style.id)}
                                  onCheckedChange={() => toggleStylePreference(style.id)}
                                />
                                <label htmlFor={`style-${style.id}`} className="text-sm">
                                  {style.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Room Type</label>
                          <Select value={roomType} onValueChange={setRoomType}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                            <SelectContent>
                              {roomOptions.map((room) => (
                                <SelectItem key={room.value} value={room.value}>
                                  {room.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Budget Range: ${budgetRange[0]} - ${budgetRange[1]}
                          </label>
                          <Slider
                            defaultValue={[20, 50]}
                            max={100}
                            min={10}
                            step={5}
                            value={budgetRange}
                            onValueChange={setBudgetRange}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="allow-duplicates"
                            checked={allowDuplicates}
                            onCheckedChange={(checked) => setAllowDuplicates(!!checked)}
                          />
                          <label htmlFor="allow-duplicates" className="text-sm text-gray-700">
                            Allow posters you've already purchased
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button
                  onClick={generateRandomPosters}
                  className="w-full mt-4 bg-posterzone-blue hover:bg-posterzone-blue/90"
                  disabled={isGenerating}
                >
                  <Gift className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Surprise Me!"}
                </Button>
                
                {generatedPosters.length > 0 && (
                  <Button
                    onClick={addAllToCart}
                    className="w-full bg-posterzone-orange hover:bg-posterzone-orange/90"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add All To Cart
                  </Button>
                )}
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
                              onClick={() => addPosterToCart(poster)}
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

      {/* FAQ Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the Surprise Me feature work?</AccordionTrigger>
              <AccordionContent>
                Our Surprise Me feature uses your preferences to curate a personalized selection of posters. 
                Simply select your interests, style preferences, and how many posters you'd like to see, 
                and our algorithm will generate recommendations tailored just for you.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I request specific themes or styles?</AccordionTrigger>
              <AccordionContent>
                Yes! You can select from various categories, styles, and themes to guide our recommendations. 
                The more specific your preferences, the more tailored your surprise selection will be.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What if I don't like the selections?</AccordionTrigger>
              <AccordionContent>
                If you're not satisfied with the recommendations, you can generate a new set of surprise posters 
                by adjusting your preferences and clicking the "Surprise Me" button again. You're never obligated 
                to purchase posters that don't resonate with you.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurpriseMe;
