
import React from "react";
import { Settings, Bell, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
  currentTime: string;
  hijriDate: string;
  gregorianDate: string;
}

const Header: React.FC<HeaderProps> = ({ currentTime, hijriDate, gregorianDate }) => {
  const { currentLanguage } = useLanguage();
  const isRtl = currentLanguage.direction === 'rtl';

  return (
    <div className="relative w-full px-4 py-2">
      {/* Status bar */}
      <div className={cn("flex justify-between text-xs text-gray-500 mb-2", 
                         isRtl && "flex-row-reverse")}>
        <span>{currentTime}</span>
        <div className={cn("flex space-x-2", isRtl && "flex-row-reverse space-x-reverse")}>
          <span>
            <span className="mr-1">●</span>4G
          </span>
          <span>85%</span>
        </div>
      </div>
      
      {/* Header content */}
      <div className={cn("flex justify-between items-start", isRtl && "flex-row-reverse")}>
        <div className={cn(isRtl && "text-right")}>
          <h1 className="text-2xl font-bold text-islamic-green">Faith Flow</h1>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>{hijriDate}</p>
            <p>{gregorianDate}</p>
          </div>
        </div>
        <div className={cn("flex items-center space-x-3", isRtl && "flex-row-reverse space-x-reverse")}>
          <Badge className="bg-islamic-gold text-white hover:bg-islamic-gold/90">
            Premium
          </Badge>
          <RefreshCw className="w-5 h-5 text-islamic-green cursor-pointer hover:text-islamic-light-green transition-colors" />
          <Bell className="w-5 h-5 text-islamic-green cursor-pointer hover:text-islamic-light-green transition-colors" />
          <Settings className="w-5 h-5 text-islamic-green cursor-pointer hover:text-islamic-light-green transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Header;
