
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<number>(3);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const addToCart = () => {
    setCartItems(cartItems + 1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
    // Reset search query after search
    setSearchQuery('');
  };

  // Sample cart items for demonstration
  const sampleCartItems = [
    { id: 1, name: 'Mountain Sunset Poster', price: 24.99, quantity: 1, image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5' },
    { id: 2, name: 'Abstract Art Poster', price: 29.99, quantity: 1, image: 'https://images.unsplash.com/photo-1552083375-1447ce886485' },
    { id: 3, name: 'Vintage Movie Poster', price: 34.99, quantity: 1, image: 'https://images.unsplash.com/photo-1536440136630-a8c3a9f3aee7' },
  ];

  const cartTotal = sampleCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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
            <Link to="/about" className="text-posterzone-charcoal hover:text-posterzone-orange transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-posterzone-charcoal hover:text-posterzone-orange transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Favorites Link */}
            <Link to="/favorites" className="p-2 hover:bg-posterzone-lightgray rounded-full" aria-label="Favorites">
              <Heart size={20} className="text-posterzone-charcoal" />
            </Link>

            {/* Search Dialog */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <button className="p-2 hover:bg-posterzone-lightgray rounded-full" aria-label="Search">
                  <Search size={20} className="text-posterzone-charcoal" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Search Posters</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    placeholder="Search for posters, artists, themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">Search</Button>
                </form>
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Popular searches:</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Abstract', 'Nature', 'Movies', 'Minimalist', 'Vintage'].map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Cart Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-2 hover:bg-posterzone-lightgray rounded-full relative"
                  aria-label="Cart"
                  onClick={(e) => e.preventDefault()} // Prevent the default action to allow dropdown to open
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
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Your Cart ({sampleCartItems.length})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {sampleCartItems.length > 0 ? (
                  <>
                    {sampleCartItems.map((item) => (
                      <DropdownMenuItem key={item.id} className="flex items-center p-2 focus:bg-gray-100">
                        <div className="h-12 w-12 mr-2 overflow-hidden rounded">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-500">{item.quantity} × ${item.price.toFixed(2)}</p>
                            <p className="text-xs font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <div className="p-3">
                      <div className="flex justify-between mb-3">
                        <span className="font-medium">Total:</span>
                        <span className="font-medium">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button className="bg-posterzone-orange hover:bg-posterzone-orange/90 w-full" onClick={() => navigate('/cart')}>
                          View Cart
                        </Button>
                        <Button variant="outline" className="w-full">
                          Checkout
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center">
                    <p className="mb-2">Your cart is empty</p>
                    <Link to="/collections">
                      <Button variant="outline" size="sm" className="mt-2">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
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
              <Link
                to="/about"
                className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/favorites"
                className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Favorites
              </Link>
              <Link
                to="/cart"
                className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
