
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import CategoryBlocks from "@/components/CategoryBlocks";
import TrendingSection from "@/components/TrendingSection";
import BestSellersSection from "@/components/BestSellersSection";
import CollagePacksSection from "@/components/CollagePacksSection";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<number>(0);

  const addToCart = () => {
    setCartItems(cartItems + 1);
    toast({
      title: "Added to cart!",
      description: "Item has been added to your cart.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Category Blocks */}
        <CategoryBlocks />

        {/* Trending Now Section */}
        <TrendingSection onAddToCart={addToCart} />

        {/* Best Sellers Section */}
        <BestSellersSection onAddToCart={addToCart} />

        {/* Collage Packs Section */}
        <CollagePacksSection onAddToCart={addToCart} />
      </main>
    </div>
  );
};

export default Index;
