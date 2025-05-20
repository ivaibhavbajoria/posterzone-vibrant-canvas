
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CategoryType } from "@/utils/categories";

type CategoryCardProps = {
  category: CategoryType;
  index: number;
};

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <motion.div
      className="category-card overflow-hidden rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link to={`/collections/${category.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={category.image} 
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 text-white">
              <h3 className="text-xl font-bold mb-1">{category.name}</h3>
              <p className="text-sm text-white/80">{category.description}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
