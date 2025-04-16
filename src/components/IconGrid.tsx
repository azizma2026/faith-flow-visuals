
import React from "react";
import { Book, Clock, Compass, BookOpen, BookMarked, FileText, Headphones, Radio, Map, Heart, Calendar, Settings, Tv, Music, Activity, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import FeatureIcon from "./FeatureIcon";

interface IconGridProps {
  currentPage: number;
  className?: string;
}

interface FeatureItem {
  title: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

// Feature icon data for all three pages
const FEATURE_PAGES = [
  // Page 1 - Main features
  [
    {
      title: "Quran",
      icon: Book,
      color: "bg-islamic-green",
      onClick: () => console.log("Quran clicked")
    },
    {
      title: "Prayer Times",
      icon: Clock,
      color: "bg-islamic-blue",
      onClick: () => console.log("Prayer Times clicked")
    },
    {
      title: "Qibla",
      icon: Compass,
      color: "bg-islamic-light-green",
      onClick: () => console.log("Qibla clicked")
    },
    {
      title: "Hadith",
      icon: BookOpen,
      color: "bg-islamic-light-blue",
      onClick: () => console.log("Hadith clicked")
    },
    {
      title: "Hifz",
      icon: BookMarked,
      color: "bg-islamic-green",
      onClick: () => console.log("Hifz clicked")
    },
    {
      title: "Supplications",
      icon: FileText,
      color: "bg-islamic-blue",
      onClick: () => console.log("Supplications clicked")
    },
    {
      title: "Tasbeeh",
      icon: Headphones,
      color: "bg-islamic-light-green",
      onClick: () => console.log("Tasbeeh clicked")
    },
    {
      title: "Islamic TV",
      icon: Radio,
      color: "bg-islamic-light-blue",
      onClick: () => console.log("Islamic TV clicked")
    }
  ],
  // Page 2 features
  [
    {
      title: "Tajweed",
      icon: BookOpen,
      color: "bg-islamic-green",
      onClick: () => console.log("Tajweed clicked")
    },
    {
      title: "Allah Names",
      icon: FileText,
      color: "bg-islamic-blue",
      onClick: () => console.log("Allah Names clicked")
    },
    {
      title: "Advertise",
      icon: Radio,
      color: "bg-islamic-light-green",
      onClick: () => console.log("Advertise clicked")
    },
    {
      title: "E-Card",
      icon: Book,
      color: "bg-islamic-light-blue",
      onClick: () => console.log("E-Card clicked")
    },
    {
      title: "Dua List",
      icon: FileText,
      color: "bg-islamic-green",
      onClick: () => console.log("Dua List clicked")
    },
    {
      title: "Blog",
      icon: BookOpen,
      color: "bg-islamic-blue",
      onClick: () => console.log("Blog clicked")
    },
    {
      title: "Visual Quran",
      icon: Book,
      color: "bg-islamic-light-green",
      onClick: () => console.log("Visual Quran clicked")
    },
    {
      title: "Community",
      icon: Headphones,
      color: "bg-islamic-light-blue",
      onClick: () => console.log("Community clicked")
    }
  ],
  // Page 3 features
  [
    {
      title: "Makkah Live",
      icon: Radio,
      color: "bg-islamic-green",
      onClick: () => console.log("Makkah Live clicked")
    },
    {
      title: "Madinah Live",
      icon: Radio,
      color: "bg-islamic-blue",
      onClick: () => console.log("Madinah Live clicked")
    },
    {
      title: "Halal Places",
      icon: Compass,
      color: "bg-islamic-light-green",
      onClick: () => console.log("Halal Places clicked")
    },
    {
      title: "Masjid Finder",
      icon: Compass,
      color: "bg-islamic-light-blue",
      onClick: () => console.log("Masjid Finder clicked")
    },
    {
      title: "Islamic News",
      icon: FileText,
      color: "bg-islamic-green",
      onClick: () => console.log("Islamic News clicked")
    },
    {
      title: "Charity",
      icon: Headphones,
      color: "bg-islamic-blue",
      onClick: () => console.log("Charity clicked")
    },
    {
      title: "Calendar",
      icon: Clock,
      color: "bg-islamic-light-green",
      onClick: () => console.log("Calendar clicked")
    },
    {
      title: "Settings",
      icon: Compass,
      color: "bg-islamic-light-blue",
      onClick: () => console.log("Settings clicked")
    }
  ]
];

const IconGrid: React.FC<IconGridProps> = ({ currentPage = 0, className }) => {
  const features = FEATURE_PAGES[currentPage] || [];

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}>
      {features.map((feature, index) => (
        <FeatureIcon
          key={index}
          title={feature.title}
          icon={feature.icon}
          color={feature.color}
          onClick={feature.onClick}
        />
      ))}
    </div>
  );
};

export default IconGrid;
