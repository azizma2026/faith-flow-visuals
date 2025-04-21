
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import FeatureIcon from "./FeatureIcon";
import { 
  Book, Clock, Compass, BookOpen, BookMarked, FileText, 
  Headphones, Radio, Map, Heart, Calendar, Settings, 
  Tv, Music, Activity, Landmark, BarChart, Gift, Quote, Share 
} from "lucide-react";

interface AnimatedIconGridProps {
  currentPage: number;
  className?: string;
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
      title: "Islamic Channels",
      icon: Radio,
      color: "bg-islamic-light-blue",
      path: "/islamic-channels"
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
      icon: Activity,
      color: "bg-islamic-light-green",
      onClick: () => console.log("Advertise clicked")
    },
    {
      title: "E-Card",
      icon: Heart,
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
      icon: Tv,
      color: "bg-islamic-green",
      path: "/islamic-channels"
    },
    {
      title: "Madinah Live",
      icon: Tv,
      color: "bg-islamic-blue",
      path: "/islamic-channels"
    },
    {
      title: "Halal Places",
      icon: Map,
      color: "bg-islamic-light-green",
      onClick: () => console.log("Halal Places clicked")
    },
    {
      title: "Masjid Finder",
      icon: Landmark,
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
      icon: Heart,
      color: "bg-islamic-blue",
      onClick: () => console.log("Charity clicked")
    },
    {
      title: "Calendar",
      icon: Calendar,
      color: "bg-islamic-light-green",
      onClick: () => console.log("Calendar clicked")
    },
    {
      title: "Settings",
      icon: Settings,
      color: "bg-islamic-light-blue",
      onClick: () => console.log("Settings clicked")
    }
  ],
  // Page 4 - New features
  [
    {
      title: "Quran Engagement",
      icon: BarChart,
      color: "bg-islamic-green",
      path: "/quran-engagement"
    },
    {
      title: "Sadqa Jaria",
      icon: Gift,
      color: "bg-islamic-blue",
      path: "/sadqa-jaria"
    },
    {
      title: "Daily Verse",
      icon: Quote,
      color: "bg-islamic-light-green",
      path: "/daily-verse"
    },
    {
      title: "Share App",
      icon: Share,
      color: "bg-islamic-light-blue",
      onClick: () => console.log("Share App clicked")
    },
    {
      title: "Favorite Verses",
      icon: Heart,
      color: "bg-islamic-green",
      onClick: () => console.log("Favorite Verses clicked")
    },
    {
      title: "Audio Library",
      icon: Headphones,
      color: "bg-islamic-blue",
      onClick: () => console.log("Audio Library clicked")
    },
    {
      title: "Community",
      icon: Activity,
      color: "bg-islamic-light-green",
      onClick: () => console.log("Community clicked")
    },
    {
      title: "Educational",
      icon: BookOpen,
      color: "bg-islamic-light-blue",
      onClick: () => console.log("Educational clicked")
    }
  ]
];

const AnimatedIconGrid: React.FC<AnimatedIconGridProps> = ({ currentPage = 0, className }) => {
  const features = FEATURE_PAGES[currentPage] || [];
  const [expandedIcon, setExpandedIcon] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleIconClick = (index: number, onClick?: () => void, path?: string) => {
    if (expandedIcon === index) {
      setExpandedIcon(null);
    } else {
      setExpandedIcon(index);
      if (path) {
        navigate(path);
      } else if (onClick) {
        onClick();
      }
    }
  };

  // Animation variants for the grid container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for each grid item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={currentPage} // Re-trigger animation when page changes
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FeatureIcon
            title={feature.title}
            icon={feature.icon}
            color={feature.color}
            onClick={() => handleIconClick(index, feature.onClick, feature.path)}
            className={expandedIcon === index ? "ring-2 ring-islamic-gold" : ""}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedIconGrid;
