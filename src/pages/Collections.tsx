
import { motion } from "framer-motion";
import { useState } from "react";
import { categories } from "@/utils/categories";
import CategoryCard from "@/components/CategoryCard";
import { useParams } from "react-router-dom";
import PosterGrid from "@/components/PosterGrid";
import CategoryFilter from "@/components/CategoryFilter";

const Collections = () => {
  const { categoryId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || "all");

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-posterzone-charcoal mb-2">Collections</h1>
          <p className="text-gray-600 mb-8">Browse our curated collections of beautiful posters</p>
        </motion.div>

        {!categoryId ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <PosterGrid 
              category={selectedCategory}
              onAddToCart={() => {}} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
