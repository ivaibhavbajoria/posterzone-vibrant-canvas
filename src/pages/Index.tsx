
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import PosterGrid from "@/components/PosterGrid";
import CategoryFilter from "@/components/CategoryFilter";
import HeroSection from "@/components/HeroSection";
import CategoryBlocks from "@/components/CategoryBlocks";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const addToCart = () => {
    setCartItems(cartItems + 1);
    toast({
      title: "Added to cart!",
      description: "Item has been added to your cart.",
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-posterzone-charcoal">
                  Poster<span className="text-posterzone-orange">Zone</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-posterzone-charcoal hover:text-posterzone-orange transition-colors">
                Home
              </Link>
              <Link to="/collections" className="text-posterzone-charcoal hover:text-posterzone-orange transition-colors">
                Collections
              </Link>
              <a href="#posters" className="text-posterzone-charcoal hover:text-posterzone-orange transition-colors">
                Posters
              </a>
              <a href="#about" className="text-posterzone-charcoal hover:text-posterzone-orange transition-colors">
                About Us
              </a>
              <a href="#contact" className="text-posterzone-charcoal hover:text-posterzone-orange transition-colors">
                Contact
              </a>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-posterzone-lightgray rounded-full" aria-label="Search">
                <Search size={20} className="text-posterzone-charcoal" />
              </button>
              
              <button 
                className="p-2 hover:bg-posterzone-lightgray rounded-full relative"
                aria-label="Cart"
                onClick={addToCart}
              >
                <ShoppingCart size={20} className="text-posterzone-charcoal" />
                {cartItems > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 bg-posterzone-orange text-white text-xs"
                  >
                    {cartItems}
                  </Badge>
                )}
              </button>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 hover:bg-posterzone-lightgray rounded-full"
                onClick={toggleMenu}
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X size={20} className="text-posterzone-charcoal" />
                ) : (
                  <Menu size={20} className="text-posterzone-charcoal" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 animate-fade-in">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/collections"
                  className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Collections
                </Link>
                <a 
                  href="#posters" 
                  className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Posters
                </a>
                <a 
                  href="#about" 
                  className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </a>
                <a 
                  href="#contact" 
                  className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Category Blocks */}
        <CategoryBlocks />

        {/* Main Content */}
        <section id="posters" className="container mx-auto px-4 py-12">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-3xl font-bold text-posterzone-charcoal mb-4 md:mb-0">
                Browse Our Collection
              </h2>
              
              {/* Category Filter */}
              <CategoryFilter 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
              />
            </div>
            
            {/* Poster Grid */}
            <PosterGrid 
              category={selectedCategory} 
              onAddToCart={addToCart} 
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
