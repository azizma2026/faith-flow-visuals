
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PageNavigationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  className
}) => {
  return (
    <div className={cn("flex justify-center items-center space-x-2 mt-6", className)}>
      {Array.from({ length: totalPages }, (_, i) => (
        <motion.button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            currentPage === i
              ? "bg-islamic-gold w-4"
              : "bg-gray-300 hover:bg-gray-400"
          )}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          animate={currentPage === i ? { width: 16 } : { width: 8 }}
          aria-label={`Go to page ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default PageNavigation;
