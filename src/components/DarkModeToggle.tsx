
import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <motion.button
      className="fixed bottom-4 right-4 p-3 rounded-full bg-islamic-gold/80 backdrop-blur-sm shadow-lg"
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-white" />
      ) : (
        <Moon className="w-5 h-5 text-white" />
      )}
    </motion.button>
  );
};

export default DarkModeToggle;
