
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import PrayerTimer from "@/components/PrayerTimer";
import AnimatedIconGrid from "@/components/AnimatedIconGrid";
import PageNavigation from "@/components/PageNavigation";
import DarkModeToggle from "@/components/DarkModeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { getGregorianDate, getHijriDate, getCurrentTime } from "@/utils/dateUtils";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [time, setTime] = useState(getCurrentTime());
  const hijriDate = getHijriDate();
  const gregorianDate = getGregorianDate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { currentLanguage } = useLanguage();
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTime());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <motion.div 
      className={`min-h-screen ${isDarkMode ? 'dark bg-islamic-dark-navy' : 'mosque-silhouette-bg'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir={currentLanguage.direction}
    >
      <motion.div 
        className="max-w-lg mx-auto"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Header 
          currentTime={time} 
          hijriDate={hijriDate} 
          gregorianDate={gregorianDate} 
        />
        
        <main className="px-4 py-6">
          <PrayerTimer className="mb-6" />
          
          <h2 className="text-xl font-bold mb-4 text-islamic-dark-navy dark:text-white">
            Islamic Resources
          </h2>
          
          <AnimatedIconGrid currentPage={currentPage} />
          
          <PageNavigation 
            totalPages={3} 
            currentPage={currentPage} 
            onPageChange={handlePageChange} 
          />
        </main>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
        <LanguageSelector />
      </motion.div>
    </motion.div>
  );
};

export default Index;
