
import React from "react";
import { useToast } from "./ui/use-toast";
import { useNavigationStore, ModuleType } from '@/stores/navigationStore';
import FeatureIcon from "./FeatureIcon";
import { FeatureItem } from "@/config/featurePages";
import { Lock } from "lucide-react";

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
          background: "#f5f0e8", 
          border: "1px solid #e2d1c3",
          color: "#564f47"
        },
      });
    }
  };

  return (
    <div className="relative group">
      <FeatureIcon
        title={feature.title}
        icon={feature.icon}
        color={feature.color}
        onClick={() => handleIconClick(feature.module)}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      {feature.isPremium && (
        <div className="absolute top-0 right-0 p-1 bg-[#d4af37] rounded-full -mt-2 -mr-2 shadow-sm">
          <Lock className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};

export default FeatureGridItem;
