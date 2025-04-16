
import React, { useState } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { languages } from "@/utils/languageUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className={cn("relative", className)}>
      <motion.button
        className="fixed bottom-4 left-4 p-3 rounded-full bg-islamic-light-blue/80 backdrop-blur-sm shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Globe className="w-5 h-5 text-white" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-16 left-4 bg-white dark:bg-islamic-dark-navy rounded-lg shadow-lg p-2 w-40 z-50"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
          >
            <ul className="space-y-1">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button
                    className={cn(
                      "w-full text-left p-2 rounded-md transition-colors hover:bg-islamic-beige",
                      currentLanguage.code === lang.code ? "bg-islamic-beige text-islamic-dark-navy" : "text-islamic-dark-navy dark:text-white"
                    )}
                    onClick={() => {
                      setLanguage(lang);
                      setIsOpen(false);
                    }}
                  >
                    <span className={lang.direction === 'rtl' ? 'text-right block' : ''}>
                      {lang.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
