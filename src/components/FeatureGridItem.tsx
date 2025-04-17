
import React from "react";
import { useToast } from "./ui/use-toast";
import { useNavigationStore, ModuleType } from '@/stores/navigationStore';
import FeatureIcon from "./FeatureIcon";
import { FeatureItem } from "@/config/featurePages";

interface FeatureGridItemProps {
  feature: FeatureItem;
}

const FeatureGridItem: React.FC<FeatureGridItemProps> = ({ feature }) => {
  const setActiveModule = useNavigationStore(state => state.setActiveModule);
  const { toast } = useToast();

  const handleIconClick = (module: ModuleType) => {
    // These modules are already implemented
    const implementedModules = ["quran", "hadith", "sadqaJaria", "dailyVerse", "quranEngagement", "home"];
    
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
    <FeatureIcon
      title={feature.title}
      icon={feature.icon}
      color={feature.color}
      onClick={() => handleIconClick(feature.module)}
    />
  );
};

export default FeatureGridItem;
