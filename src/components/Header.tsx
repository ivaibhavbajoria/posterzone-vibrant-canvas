
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<number>(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const addToCart = () => {
    setCartItems(cartItems + 1);
  };

  return (
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
            <Link to="/custom-poster" className="text-posterzone-charcoal hover:text-posterzone-orange transition-colors">
              Custom Poster
            </Link>
            <Link to="/surprise-me" className="text-posterzone-charcoal hover:text-posterzone-orange transition-colors">
              Surprise Me
            </Link>
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
              <Link
                to="/custom-poster"
                className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Custom Poster
              </Link>
              <Link
                to="/surprise-me"
                className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Surprise Me
              </Link>
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
  );
};

export default Header;
