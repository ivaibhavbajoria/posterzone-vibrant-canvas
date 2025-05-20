
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { categories } from "@/utils/categories";

type CategoryFilterProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  // Extract just the category IDs and names for the filter
  const filterCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name
  }));

  return (
    <div className="flex overflow-x-auto pb-2 scrollbar-none space-x-2">
      {filterCategories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={`rounded-full whitespace-nowrap px-4 ${
            selectedCategory === category.id
              ? "bg-posterzone-blue hover:bg-posterzone-blue/90"
              : "hover:bg-posterzone-lightgray hover:text-posterzone-charcoal"
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
