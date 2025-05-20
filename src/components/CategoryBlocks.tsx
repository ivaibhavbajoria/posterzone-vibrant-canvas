
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/utils/categories";

const CategoryBlocks = () => {
  // Exclude "all" from the display categories
  const displayCategories = categories.filter(cat => cat.id !== "all");
  
  return (
    <section className="py-12 bg-posterzone-lightgray">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-6">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-posterzone-charcoal mb-2">Shop by Category</h2>
            <p className="text-gray-600">Find the perfect poster for your space</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className="overflow-hidden rounded-lg shadow-md bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link to={`/collections/${category.id}`} className="block">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-20 transition-all">
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Link 
              to="/collections" 
              className="btn-primary inline-block px-6 py-3"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryBlocks;
