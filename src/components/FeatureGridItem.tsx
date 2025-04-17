
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
      "rate"
    ];
    
    if (implementedModules.includes(module)) {
      setActiveModule(module);
    } else {
      toast({
        title: "Module coming soon",
        description: "This feature is still under development.",
      });
    }
  };

  return (
    <div className="relative">
      <FeatureIcon
        title={feature.title}
        icon={feature.icon}
        color={feature.color}
        onClick={() => handleIconClick(feature.module)}
      />
      {feature.isPremium && (
        <div className="absolute top-0 right-0 p-1 bg-islamic-gold rounded-full -mt-2 -mr-2">
          <Lock className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};

export default FeatureGridItem;
