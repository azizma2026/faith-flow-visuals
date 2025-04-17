
import { 
  Book, Clock, Compass, BookOpen, BookMarked, FileText, 
  Headphones, Radio, Map, Heart, Calendar, Settings, 
  Tv, Music, Activity, Landmark, Palette, HelpCircle, 
  Award, Coins, Gift, LayoutDashboard
} from "lucide-react";
import { ModuleType } from "@/stores/navigationStore";

export interface FeatureItem {
  title: string;
  icon: any; // Using any here because the Lucide icon type is complex
  color: string;
  module: ModuleType;
}

// Feature icon data for all pages
export const FEATURE_PAGES: FeatureItem[][] = [
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
  ],
  // Page 5 - More Islamic Apps
  [
    {
      title: "Islamic Themes",
      icon: Palette,
      color: "bg-islamic-green",
      module: "islamicThemes"
    },
    {
      title: "Islamic Quiz",
      icon: HelpCircle,
      color: "bg-islamic-blue",
      module: "islamicQuiz"
    },
    {
      title: "3D Salah Guide",
      icon: Compass,
      color: "bg-islamic-light-green",
      module: "salahGuide"
    },
    {
      title: "Certificates",
      icon: Award,
      color: "bg-islamic-light-blue",
      module: "certificates"
    },
    {
      title: "Tip Developer",
      icon: Gift,
      color: "bg-islamic-green",
      module: "tipDeveloper"
    },
    {
      title: "Sadqa Jaria Pool",
      icon: Coins,
      color: "bg-islamic-blue",
      module: "sadqaJaria"
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      color: "bg-islamic-light-green",
      module: "home"
    },
    {
      title: "Settings",
      icon: Settings,
      color: "bg-islamic-light-blue",
      module: "settings"
    }
  ]
];
