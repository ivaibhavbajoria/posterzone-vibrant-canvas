
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Heart, User, LogOut, LogIn } from 'lucide-react';
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
import { useCart } from '@/contexts/CartContext';
import { useAuth0Context } from '@/contexts/Auth0Context';

const Header = () => {
  const navigate = useNavigate();
  const { cartItems, getCartCount, getCartTotal, removeFromCart } = useCart();
  const { user, isAuthenticated, logout, isLoading } = useAuth0Context();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
    // Reset search query after search
    setSearchQuery('');
  };

  const handleSignOut = async () => {
    try {
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

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
            {/* Login/Profile Buttons */}
            <div className="flex items-center space-x-2">
              {!isLoading && (
                <>
                  {!isAuthenticated ? (
                    <Button
                      onClick={handleLoginClick}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <LogIn className="h-4 w-4" />
                      Login / Sign Up
                    </Button>
                  ) : (
                    <Button
                      onClick={handleViewProfile}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* User Profile/Auth Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-posterzone-lightgray rounded-full" aria-label="Profile">
                  <User size={20} className="text-posterzone-charcoal" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated && user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user.name || user.email}</span>
                        <span className="text-xs font-normal text-gray-500">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/order-history')}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Order History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/favorites')}>
                      <Heart className="mr-2 h-4 w-4" />
                      My Favorites
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate('/auth')}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login / Sign Up
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Favorites Link - only show when authenticated */}
            {isAuthenticated && (
              <Link to="/favorites" className="p-2 hover:bg-posterzone-lightgray rounded-full" aria-label="Favorites">
                <Heart size={20} className="text-posterzone-charcoal" />
              </Link>
            )}

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
                    {['Cars', 'Movies', 'Gym Motivation', 'Gun Games'].map((tag) => (
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
                  onClick={(e) => e.preventDefault()}
                >
                  <ShoppingCart size={20} className="text-posterzone-charcoal" />
                  {cartCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 bg-posterzone-orange text-white text-xs"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Your Cart ({cartItems.length})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {cartItems.length > 0 ? (
                  <>
                    {cartItems.slice(0, 3).map((item) => (
                      <DropdownMenuItem key={item.id} className="flex items-center p-2 focus:bg-gray-100">
                        <div className="h-12 w-12 mr-2 overflow-hidden rounded">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-500">{item.quantity} × ₹{item.price.toFixed(2)}</p>
                            <p className="text-xs font-medium">₹{(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    {cartItems.length > 3 && (
                      <div className="px-3 py-2 text-xs text-gray-500 text-center">
                        +{cartItems.length - 3} more items
                      </div>
                    )}
                    <DropdownMenuSeparator />
                    <div className="p-3">
                      <div className="flex justify-between mb-3">
                        <span className="font-medium">Total:</span>
                        <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button className="bg-posterzone-orange hover:bg-posterzone-orange/90 w-full" onClick={() => navigate('/cart')}>
                          View Cart
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => navigate('/checkout')}>
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
              {isAuthenticated && (
                <>
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
                </>
              )}
              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/order-history"
                    className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Order History
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="text-posterzone-charcoal hover:text-posterzone-orange px-2 py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
