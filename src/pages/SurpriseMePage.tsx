
import React from 'react';
import { motion } from "framer-motion";
import SurpriseMe from "@/components/SurpriseMe";
import { useToast } from "@/components/ui/use-toast";

const SurpriseMePage = () => {
  const { toast } = useToast();
  
  const addToCart = () => {
    toast({
      title: "Added to cart!",
      description: "Item has been added to your cart.",
    });
  };

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-posterzone-charcoal mb-2">Surprise Me</h1>
          <p className="text-gray-600">Discover posters tailored just for you</p>
        </motion.div>
        <SurpriseMe onAddToCart={addToCart} />
      </div>
    </div>
  );
};

export default SurpriseMePage;
