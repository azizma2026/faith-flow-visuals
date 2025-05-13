
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import PrayerTimer from "@/components/PrayerTimer";
import DynamicIconGrid from "@/components/DynamicIconGrid";
import IconCarousel from "@/components/IconCarousel";
import PageNavigation from "@/components/PageNavigation";
import DarkModeToggle from "@/components/DarkModeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import AccessibilitySettings from "@/components/AccessibilitySettings";
import { getGregorianDate, getHijriDate, getCurrentTime } from "@/utils/dateUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigationStore, ModuleType } from "@/stores/navigationStore";
import { 
  Book, 
  Clock, 
  Compass, 
  FileText, 
  Calendar, 
  Moon, 
  Star, 
  Heart, 
  BookOpen, 
  Settings
} from "lucide-react";

// Featured app modules for quick access
const quickAccessModules = [
  { 
    id: "quran" as ModuleType, 
    name: "Quran", 
    icon: BookOpen, 
    color: "bg-islamic-green",
    description: "Read & listen to Quran"
  },
  { 
    id: "prayerTimes" as ModuleType, 
    name: "Prayer Times", 
    icon: Clock, 
    color: "bg-islamic-gold",
    description: "Auto-location prayer times"
  },
  { 
    id: "qibla" as ModuleType, 
    name: "Qibla", 
    icon: Compass, 
    color: "bg-islamic-dark-navy",
    description: "Find Qibla direction"
  },
  { 
    id: "tasbeeh" as ModuleType, 
    name: "Tasbeeh", 
    icon: Heart, 
    color: "bg-islamic-text-brown",
    description: "Digital counter & tracker" 
  },
];

// Main app features
const appFeatures = [
  {
    category: "Essential Worship",
    modules: [
      { id: "quran" as ModuleType, name: "Quran", icon: Book },
      { id: "prayerTimes" as ModuleType, name: "Prayer Times", icon: Clock },
      { id: "qibla" as ModuleType, name: "Qibla Finder", icon: Compass },
      { id: "tasbeeh" as ModuleType, name: "Tasbeeh", icon: Heart },
      { id: "duas" as ModuleType, name: "Duas & Azkar", icon: FileText },
    ]
  },
  {
    category: "Knowledge & Community",
    modules: [
      { id: "hadith" as ModuleType, name: "Hadith Search", icon: BookOpen },
      { id: "hadithCollection" as ModuleType, name: "Hadith Collection", icon: Book },
      { id: "islamicCalendar" as ModuleType, name: "Islamic Calendar", icon: Calendar },
      { id: "namesOfAllah" as ModuleType, name: "Names of Allah", icon: Star },
      { id: "channels" as ModuleType, name: "Islamic Channels", icon: Calendar },
    ]
  },
  {
    category: "Special Features",
    modules: [
      { id: "islamicQuiz" as ModuleType, name: "Knowledge Quiz", icon: Book },
      { id: "salahGuide" as ModuleType, name: "Salah Guide", icon: FileText },
      { id: "dailyVerse" as ModuleType, name: "Daily Verse", icon: BookOpen },
    ]
  },
];

const Index = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const hijriDate = getHijriDate();
  const gregorianDate = getGregorianDate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { currentLanguage } = useLanguage();
  const { fontSize } = useAccessibility();
  const { setActiveModule } = useNavigationStore();
  const { toast } = useToast();
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleModuleSelect = (moduleId: ModuleType) => {
    setActiveModule(moduleId);
  };

  // Container animations
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={`min-h-screen font-size-${fontSize} ${isDarkMode ? 'dark bg-islamic-dark-navy' : 'mosque-silhouette-bg'}`}
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
          currentTime={currentTime} 
          hijriDate={hijriDate} 
          gregorianDate={gregorianDate} 
        />
        
        <main className="px-4 py-6">
          {/* Prayer Timer */}
          <PrayerTimer className="mb-6" />
          
          {/* Quick Access Module Cards */}
          <motion.div 
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3 mb-6"
          >
            {quickAccessModules.map((module) => (
              <motion.div 
                key={module.id}
                variants={itemAnimation}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Card 
                  className="overflow-hidden h-32 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => handleModuleSelect(module.id)}
                >
                  <CardContent className="p-0 h-full">
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <div className={`w-12 h-12 rounded-full ${module.color} flex items-center justify-center mb-2`}>
                        <module.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-center">{module.name}</h3>
                      <p className="text-xs text-center text-muted-foreground">{module.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Feature Categories */}
          <div className="space-y-4 mb-6">
            <Tabs defaultValue="essential">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="essential">Worship</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                <TabsTrigger value="special">Features</TabsTrigger>
              </TabsList>
              
              {appFeatures.map((category, index) => (
                <TabsContent 
                  key={index} 
                  value={index === 0 ? "essential" : index === 1 ? "knowledge" : "special"}
                >
                  <Card>
                    <CardContent className="p-4">
                      <motion.div 
                        className="grid grid-cols-3 gap-3"
                        variants={containerAnimation}
                        initial="hidden"
                        animate="show"
                      >
                        {category.modules.map((module) => (
                          <motion.div 
                            key={module.id}
                            variants={itemAnimation}
                            className="flex flex-col items-center justify-center p-3 rounded-lg border border-muted bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                            onClick={() => handleModuleSelect(module.id)}
                          >
                            <module.icon className="h-6 w-6 mb-2 text-islamic-green" />
                            <span className="text-xs text-center">{module.name}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Settings Section */}
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="settings" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="font-medium flex items-center px-4">
                <Settings className="h-4 w-4 mr-2" />
                App Settings
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <AccessibilitySettings />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dark Mode</span>
                    <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Language</span>
                    <LanguageSelector />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </main>
      </motion.div>
    </motion.div>
  );
};

export default Index;
