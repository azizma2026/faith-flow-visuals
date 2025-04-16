
import React from "react";
import { motion } from "framer-motion";
import { Book } from "lucide-react";

const QuranModule: React.FC = () => {
  return (
    <motion.div 
      className="p-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-islamic-green rounded-xl p-3 mr-4">
          <Book className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Quran</h1>
      </div>
      
      <div className="text-center my-12">
        <p>Quran module is under development.</p>
        <p className="text-sm text-gray-500 mt-2">This feature will be available soon.</p>
      </div>
    </motion.div>
  );
};

export default QuranModule;
