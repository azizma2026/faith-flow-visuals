
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageNavigationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
  className?: string;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ 
  totalPages = 4, // Updated to 4 pages by default
  currentPage = 0, 
  onPageChange,
  className
}) => {
  return (
    <motion.div 
      className={cn("flex justify-center mt-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button 
            key={index}
            onClick={() => onPageChange(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              currentPage === index 
                ? "bg-islamic-gold w-6" 
                : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
            )}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PageNavigation;
