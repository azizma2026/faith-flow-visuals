
import React from "react";
import { useNavigationStore, ModuleType } from '@/stores/navigationStore';
import { Book, Clock, Compass, BookOpen, BookMarked, FileText, Headphones, Radio, Map, Heart, Calendar, Settings, Tv, Music, Activity, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import FeatureIcon from "./FeatureIcon";
import { useToast } from "./ui/use-toast";

interface DynamicIconGridProps {
  currentPage: number;
  className?: string;
}

interface FeatureItem {
  title: string;
  icon: React.ElementType;
  color: string;
  module: ModuleType;
}

// Feature icon data for all pages
const FEATURE_PAGES = [
  // Page 1 - Main features
  [
    {
      title: "Quran",
      icon: Book,
      color: "bg-islamic-green",
      module: "quran"
    },
    {
      title: "Prayer Times",
      icon: Clock,
      color: "bg-islamic-blue",
      module: "prayerTimes"
    },
    {
      title: "Qibla",
      icon: Compass,
      color: "bg-islamic-light-green",
      module: "qibla"
    },
    {
      title: "Hadith",
      icon: BookOpen,
      color: "bg-islamic-light-blue",
      module: "hadith"
    },
    {
      title: "Hifz",
      icon: BookMarked,
      color: "bg-islamic-green",
      module: "quran"
    },
    {
      title: "Supplications",
      icon: FileText,
      color: "bg-islamic-blue",
      module: "duas"
    },
    {
      title: "Tasbeeh",
      icon: Headphones,
      color: "bg-islamic-light-green",
      module: "tasbeeh"
    },
    {
      title: "Islamic TV",
      icon: Radio,
      color: "bg-islamic-light-blue",
      module: "channels"
    }
  ],
  // Page 2 features
  [
    {
      title: "Tajweed",
      icon: BookOpen,
      color: "bg-islamic-green",
      module: "quran"
    },
    {
      title: "Allah Names",
      icon: FileText,
      color: "bg-islamic-blue",
      module: "settings"
    },
    {
      title: "Advertise",
      icon: Radio,
      color: "bg-islamic-light-green",
      module: "settings"
    },
    {
      title: "E-Card",
      icon: Book,
      color: "bg-islamic-light-blue",
      module: "settings"
    },
    {
      title: "Dua List",
      icon: FileText,
      color: "bg-islamic-green",
      module: "duas"
    },
    {
      title: "Blog",
      icon: BookOpen,
      color: "bg-islamic-blue",
      module: "settings"
    },
    {
      title: "Visual Quran",
      icon: Book,
      color: "bg-islamic-light-green",
      module: "quran"
    },
    {
      title: "Community",
      icon: Headphones,
      color: "bg-islamic-light-blue",
      module: "settings"
    }
  ],
  // Page 3 features
  [
    {
      title: "Makkah Live",
      icon: Radio,
      color: "bg-islamic-green",
      module: "channels"
    },
    {
      title: "Madinah Live",
      icon: Radio,
      color: "bg-islamic-blue",
      module: "channels"
    },
    {
      title: "Halal Places",
      icon: Compass,
      color: "bg-islamic-light-green",
      module: "settings"
    },
    {
      title: "Masjid Finder",
      icon: Compass,
      color: "bg-islamic-light-blue",
      module: "settings"
    },
    {
      title: "Islamic News",
      icon: FileText,
      color: "bg-islamic-green",
      module: "settings"
    },
    {
      title: "Charity",
      icon: Heart,
      color: "bg-islamic-blue",
      module: "sadqaJaria"
    },
    {
      title: "Calendar",
      icon: Calendar,
      color: "bg-islamic-light-green",
      module: "settings"
    },
    {
      title: "Settings",
      icon: Settings,
      color: "bg-islamic-light-blue",
      module: "settings"
    }
  ],
  // Page 4 - Engagement features
  [
    {
      title: "Quran Engagement",
      icon: Activity,
      color: "bg-islamic-green",
      module: "quranEngagement"
    },
    {
      title: "Sadqa Jaria",
      icon: Heart,
      color: "bg-islamic-blue",
      module: "sadqaJaria"
    },
    {
      title: "Daily Verse",
      icon: FileText,
      color: "bg-islamic-light-green",
      module: "dailyVerse"
    },
    {
      title: "Share App",
      icon: Radio,
      color: "bg-islamic-light-blue",
      module: "settings"
    },
    {
      title: "Saved Items",
      icon: BookMarked,
      color: "bg-islamic-green",
      module: "settings"
    },
    {
      title: "Donations",
      icon: Landmark,
      color: "bg-islamic-blue",
      module: "sadqaJaria"
    },
    {
      title: "Offline Content",
      icon: BookOpen,
      color: "bg-islamic-light-green",
      module: "settings"
    },
    {
      title: "Music",
      icon: Music,
      color: "bg-islamic-light-blue",
      module: "channels"
    }
  ]
];

const DynamicIconGrid: React.FC<DynamicIconGridProps> = ({ currentPage = 0, className }) => {
  const features = FEATURE_PAGES[currentPage] || [];
  const setActiveModule = useNavigationStore(state => state.setActiveModule);
  const { toast } = useToast();

  const handleIconClick = (module: ModuleType) => {
    // These modules are already implemented
    const implementedModules = ["sadqaJaria", "dailyVerse", "quranEngagement"];
    
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
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}>
      {features.map((feature, index) => (
        <FeatureIcon
          key={index}
          title={feature.title}
          icon={feature.icon}
          color={feature.color}
          onClick={() => handleIconClick(feature.module)}
        />
      ))}
    </div>
  );
};

export default DynamicIconGrid;
