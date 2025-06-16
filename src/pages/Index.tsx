
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import CategoryBlocks from "@/components/CategoryBlocks";
import TrendingSection from "@/components/TrendingSection";
import BestSellersSection from "@/components/BestSellersSection";
import CollagePacksSection from "@/components/CollagePacksSection";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";

const Index = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = (poster: any) => {
    addToCart(poster);
    toast({
      title: "Added to cart",
      description: `${poster.title} has been added to your cart.`,
      duration: 3000,
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
        <TrendingSection onAddToCart={(poster) => handleAddToCart(poster)} />

        {/* Best Sellers Section */}
        <BestSellersSection onAddToCart={(poster) => handleAddToCart(poster)} />

        {/* Collage Packs Section */}
        <CollagePacksSection onAddToCart={(poster) => handleAddToCart(poster)} />
      </main>
    </div>
  );
};

export default Index;
