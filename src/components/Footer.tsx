
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-posterzone-charcoal text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand/Logo */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Poster<span className="text-posterzone-orange">Zone</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Transforming spaces with unique and stunning poster art. 
              Find the perfect piece to express your personality.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-posterzone-orange transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-posterzone-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-posterzone-orange transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-posterzone-orange transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/collections" 
                  className="text-gray-300 hover:text-posterzone-orange transition-colors"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link 
                  to="/trending" 
                  className="text-gray-300 hover:text-posterzone-orange transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link 
                  to="/best-sellers" 
                  className="text-gray-300 hover:text-posterzone-orange transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-posterzone-orange transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-posterzone-orange transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-posterzone-orange transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-posterzone-orange transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Join Our Newsletter
            </h3>
            <p className="text-gray-300 mb-4">
              Get updates on new arrivals, special offers, and more.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 outline-none text-posterzone-charcoal rounded-l-md"
              />
              <button 
                type="submit" 
                className="bg-posterzone-orange px-4 py-2 rounded-r-md hover:bg-posterzone-orange/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} PosterZone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
