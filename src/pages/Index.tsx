import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import PrayerTimer from "@/components/PrayerTimer";
import DynamicIconGrid from "@/components/DynamicIconGrid";
import IconCarousel from "@/components/IconCarousel";
import PageNavigation from "@/components/PageNavigation";
import DarkModeToggle from "@/components/DarkModeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { getGregorianDate, getHijriDate, getCurrentTime } from "@/utils/dateUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

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

  const getSectionTitle = () => {
    switch(currentPage) {
      case 0: return "Islamic Resources";
      case 1: return "Additional Resources";
      case 2: return "Live & Community";
      case 3: return "Engagement Features";
      case 4: return "More Islamic Apps";
      default: return "Islamic Resources";
    }
  };

  const { toast } = useToast();
  
  const handleIconSelect = (index: number) => {
    toast({
      title: "Feature selected",
      description: `You selected feature ${index + 1}`,
    });
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
        className="max-w-lg mx-auto pb-24"
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
          
          <IconCarousel onSelect={handleIconSelect} className="mb-6" />
          
          <Accordion type="single" collapsible className="mb-6 space-y-4">
            <AccordionItem value="general" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="text-xl font-bold text-islamic-dark-navy dark:text-white px-4">
                General Settings
              </AccordionTrigger>
              <AccordionContent>
                <DynamicIconGrid currentPage={0} className="mt-4 p-4" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="more-apps" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="text-xl font-bold text-islamic-dark-navy dark:text-white px-4">
                More Islamic Apps
              </AccordionTrigger>
              <AccordionContent>
                <DynamicIconGrid currentPage={1} className="mt-4 p-4" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <PageNavigation 
            totalPages={5} 
            currentPage={currentPage} 
            onPageChange={handlePageChange} 
          />
        </main>

        <div className="fixed bottom-4 left-4">
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
        </div>
        <div className="fixed bottom-4 right-4">
          <LanguageSelector />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
