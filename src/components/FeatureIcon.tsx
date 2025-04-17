
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureIconProps {
  title: string;
  icon: LucideIcon;
  description?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({
  title,
  icon: Icon,
  description,
  color = "bg-islamic-green",
  onClick,
  className
}) => {
  return (
    <motion.div 
      className={cn("feature-icon flex flex-col items-center justify-center p-4 cursor-pointer", className)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div 
        className={cn("rounded-xl p-3 mb-2", color)}
        whileHover={{ boxShadow: "0 0 15px rgba(0, 255, 0, 0.3)" }}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="font-medium text-islamic-dark-navy dark:text-white text-sm text-center">{title}</h3>
      {description && <p className="text-xs text-gray-500 mt-1 text-center">{description}</p>}
    </motion.div>
  );
};

export default FeatureIcon;
