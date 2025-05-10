
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigationStore, ModuleType } from '@/stores/navigationStore';
import FeatureIcon from "./FeatureIcon";
import { FeatureItem } from "@/config/featurePages";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureGridItemProps {
  feature: FeatureItem;
}

const FeatureGridItem: React.FC<FeatureGridItemProps> = ({ feature }) => {
  const setActiveModule = useNavigationStore(state => state.setActiveModule);
  const { toast } = useToast();

  const handleIconClick = (module: ModuleType) => {
    if (feature.isPremium) {
      toast({
        title: "Premium Feature",
        description: "This feature is only available for premium users.",
        style: {
          background: "#F8F4EA", 
          border: "1px solid #D5C7A9",
          color: "#564F47"
        },
      });
      return;
    }

    const implementedModules = [
      "quran", 
      "hadith", 
      "sadqaJaria", 
      "dailyVerse", 
      "quranEngagement",
      "home",
      "islamicThemes",
      "islamicQuiz",
      "salahGuide",
      "certificates",
      "tipDeveloper",
      "contact",
      "notifications",
      "share",
      "rate",
      "islamicChannels",
      "namesOfAllah",
      "prayerTimes",
      "qibla",
      "tasbeeh"
    ];
    
    if (implementedModules.includes(module)) {
      setActiveModule(module);
    } else {
      toast({
        title: "Module coming soon",
        description: "This feature is still under development.",
        style: {
          background: "#F8F4EA", 
          border: "1px solid #D5C7A9",
          color: "#564F47"
        },
      });
    }
  };

  return (
    <motion.div 
      className="relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="feature-icon-wrapper relative">
        {/* Decorative Islamic pattern overlay */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 rounded-xl pointer-events-none"></div>
        
        <FeatureIcon
          title={feature.title}
          icon={feature.icon}
          color={feature.color}
          onClick={() => handleIconClick(feature.module)}
          className="transition-transform duration-300 bg-islamic-light-beige border-islamic-warm-beige shadow-sm"
        />
      </div>
      
      {feature.isPremium && (
        <div className="absolute top-0 right-0 p-1 bg-islamic-gold rounded-full -mt-2 -mr-2 shadow-sm">
          <Lock className="w-3 h-3 text-white" />
        </div>
      )}
    </motion.div>
  );
};

export default FeatureGridItem;
