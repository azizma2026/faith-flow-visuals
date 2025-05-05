
import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  const { screenReaderMode } = useAccessibility();

  return (
    <motion.button
      className="p-3 rounded-full bg-islamic-gold/80 backdrop-blur-sm shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-islamic-gold"
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDarkMode}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-white" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-white" aria-hidden="true" />
      )}
      {screenReaderMode && (
        <span className="sr-only">
          {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        </span>
      )}
    </motion.button>
  );
};

export default DarkModeToggle;
