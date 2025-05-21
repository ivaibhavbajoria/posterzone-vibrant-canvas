
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

  return (
    <div className="min-h-screen flex flex-col">
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Category Blocks */}
        <CategoryBlocks />

        {/* Trending Now Section */}
        <TrendingSection />

        {/* Best Sellers Section */}
        <BestSellersSection />

        {/* Collage Packs Section */}
        <CollagePacksSection />
      </main>
    </div>
  );
};

export default Index;
