
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigationStore } from "@/stores/navigationStore";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { getGregorianDate, getHijriDate, getCurrentTime } from "@/utils/dateUtils";
import { Card, CardContent } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import MosqueBackground from "@/components/MosqueBackground";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const hijriDate = getHijriDate();
  const gregorianDate = getGregorianDate();
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
  
  const handleModuleSelect = (moduleId) => {
    setActiveModule(moduleId);
  };

  // Prayer countdown state
  const [countdown, setCountdown] = useState("01:31:46");
  const [currentPrayer, setCurrentPrayer] = useState("المغرب");

  // App feature icons
  const features = [
    { name: "القران", icon: "/lovable-uploads/quran-icon.png", module: "quran" },
    { name: "أوقات الصلاة", icon: "/lovable-uploads/prayer-icon.png", module: "prayerTimes" },
    { name: "القبلة", icon: "/lovable-uploads/qibla-icon.png", module: "qibla" },
    { name: "الأذكار", icon: "/lovable-uploads/tasbeeh-icon.png", module: "tasbeeh" },
    { name: "مطعم حلال", icon: "/lovable-uploads/halal-icon.png", module: "halalFinder" },
    { name: "الدعاء", icon: "/lovable-uploads/dua-icon.png", module: "duas" },
    { name: "التقويم الهجري", icon: "/lovable-uploads/calendar-icon.png", module: "islamicCalendar" },
    { name: "إمساكية رمضان", icon: "/lovable-uploads/ramadan-icon.png", module: "ramadan" },
    { name: "التحديات اليومية", icon: "/lovable-uploads/challenge-icon.png", module: "dailyReminder" },
    { name: "الملف الشخصي", icon: "/lovable-uploads/profile-icon.png", module: "settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-islamic-green to-islamic-dark-green overflow-hidden" dir={currentLanguage.direction}>
      {/* Mosque silhouette background */}
      <MosqueBackground />
      
      {/* Prayer time countdown */}
      <div className="pt-10 pb-6 px-4 text-center text-white">
        <h2 className="text-2xl font-arabic mb-2">{currentPrayer}</h2>
        <h1 className="text-7xl font-bold tracking-wider">{countdown}</h1>
      </div>
      
      {/* App features grid */}
      <div className="px-4 pb-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModuleSelect(feature.module)}
            >
              <Card className="w-full aspect-square rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-4 flex items-center justify-center h-full">
                  {/* If we have actual icons, use them, otherwise use placeholder */}
                  <div className="w-12 h-12 rounded-full bg-islamic-light-beige flex items-center justify-center">
                    <span className="text-2xl text-islamic-dark-green">{feature.name.charAt(0)}</span>
                  </div>
                </CardContent>
              </Card>
              <p className="mt-2 text-center text-white font-arabic">{feature.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
