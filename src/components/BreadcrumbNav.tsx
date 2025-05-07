
import React from "react";
import { useNavigationStore } from "@/stores/navigationStore";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";

// Dictionary mapping module types to display names
const moduleDisplayNames: Record<string, string> = {
  home: "Home",
  quran: "Quran",
  prayerTimes: "Prayer Times",
  qibla: "Qibla",
  hadith: "Hadith",
  tasbeeh: "Tasbeeh",
  duas: "Duas",
  channels: "Islamic Channels",
  sadqaJaria: "Sadqa Jaria",
  dailyVerse: "Daily Verse",
  quranEngagement: "Quran Engagement",
  islamicThemes: "Islamic Themes",
  islamicQuiz: "Islamic Quiz",
  salahGuide: "Salah Guide",
  certificates: "Certificates",
  tipDeveloper: "Tip Developer",
  settings: "Settings",
  namesOfAllah: "99 Names of Allah",
  contact: "Contact",
  notifications: "Notifications",
  share: "Share",
  rate: "Rate App",
  hajjGuide: "Hajj Guide",
  knowledgeTests: "Knowledge Tests",
  islamicChannels: "Islamic Channels"
};

const BreadcrumbNav: React.FC = () => {
  const activeModule = useNavigationStore(state => state.activeModule);
  const goBack = useNavigationStore(state => state.goBack);
  
  // If we're on the home screen, don't show breadcrumbs
  if (activeModule === 'home') return null;
  
  const displayName = moduleDisplayNames[activeModule] || activeModule;
  
  return (
    <Breadcrumb className="py-2 px-4 bg-[#f5f0e8]/80 backdrop-blur-sm rounded-lg shadow-sm border border-[#e2d1c3]">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={goBack} className="flex items-center text-[#564f47] hover:text-[#b4a89a]">
            <Home className="h-4 w-4 mr-1" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4 text-[#b4a89a]" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium text-[#564f47]">{displayName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
