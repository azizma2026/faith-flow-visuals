import { 
  Book, Clock, Compass, BookOpen, BookMarked, FileText, 
  Headphones, Radio, Map, Heart, Calendar, Settings, 
  Tv, Music, Activity, Landmark, Palette, HelpCircle, 
  Award, Coins, Gift, LayoutDashboard, Box, BookCheck,
  MessagesSquare, BellRing, Share2, Star, GraduationCap,
  Building, PieChart
} from "lucide-react";
import { ModuleType } from "@/stores/navigationStore";

export interface FeatureItem {
  title: string;
  icon: any;
  color: string;
  module: ModuleType;
  isPremium?: boolean;
}

export const FEATURE_PAGES: FeatureItem[][] = [
  // Page 0 - General Features
  [
    {
      title: "Quran",
      icon: BookOpen,
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
      title: "Contact Us",
      icon: MessagesSquare,
      color: "bg-islamic-green",
      module: "contact"
    },
    {
      title: "Notifications",
      icon: BellRing,
      color: "bg-islamic-blue",
      module: "notifications"
    },
    {
      title: "Share App",
      icon: Share2,
      color: "bg-islamic-light-green",
      module: "share"
    },
    {
      title: "Rate App",
      icon: Star,
      color: "bg-islamic-light-blue",
      module: "rate"
    }
  ],

  // Page 1 - More Islamic Apps
  [
    {
      title: "Islamic Quiz",
      icon: HelpCircle,
      color: "bg-islamic-green",
      module: "islamicQuiz"
    },
    {
      title: "3D Salah Guide",
      icon: Box,
      color: "bg-islamic-blue",
      module: "salahGuide"
    },
    {
      title: "3D Hajj Guide",
      icon: Building,
      color: "bg-islamic-light-green",
      module: "hajjGuide",
      isPremium: true
    },
    {
      title: "Islamic Themes",
      icon: Palette,
      color: "bg-islamic-light-blue",
      module: "islamicThemes"
    },
    {
      title: "Knowledge Tests",
      icon: BookCheck,
      color: "bg-islamic-green",
      module: "knowledgeTests",
      isPremium: true
    },
    {
      title: "Certificates",
      icon: GraduationCap,
      color: "bg-islamic-blue",
      module: "certificates"
    },
    {
      title: "Tip Developer",
      icon: Gift,
      color: "bg-islamic-light-green",
      module: "tipDeveloper"
    },
    {
      title: "Sadqa Jaria",
      icon: Heart,
      color: "bg-islamic-light-blue",
      module: "sadqaJaria"
    }
  ],

  // Keep rest of the pages the same...
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
