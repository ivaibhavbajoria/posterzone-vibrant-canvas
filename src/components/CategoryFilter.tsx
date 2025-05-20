
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type CategoryFilterProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

const categories = [
  { id: "all", name: "All" },
  { id: "nature", name: "Nature" },
  { id: "abstract", name: "Abstract" },
  { id: "minimalist", name: "Minimalist" },
  { id: "typography", name: "Typography" },
  { id: "movies", name: "Movies" },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="flex overflow-x-auto pb-2 scrollbar-none space-x-2">
      {categories.map((category) => (
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
