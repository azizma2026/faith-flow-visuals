
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import SkipToContent from "./components/SkipToContent";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QuranEngagement from "./pages/QuranEngagement";
import SadqaJaria from "./pages/SadqaJaria";
import DailyVerse from "./pages/DailyVerse";
import IslamicThemes from "./modules/IslamicThemesModule";
import IslamicQuiz from "./modules/IslamicQuizModule";
import SalahGuide from "./modules/SalahGuideModule";
import Certificates from "./modules/CertificatesModule";
import TipDeveloper from "./modules/TipDeveloperModule";
import ChannelsModule from "./modules/ChannelsModule";
import SettingsModule from "./modules/SettingsModule";
import TasbeehModule from "./modules/TasbeehModule";
import PrayerTimesModule from "./modules/PrayerTimesModule";
import QiblaModule from "./modules/QiblaModule";
import ModuleWrapper from "./components/ModuleWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <LanguageProvider>
        <TooltipProvider>
          <BrowserRouter>
            <SkipToContent />
            <Toaster />
            <Sonner />
            <ModuleWrapper />
            <div className="min-h-screen bg-background" id="main-content">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/quran-engagement" element={<QuranEngagement />} />
                <Route path="/sadqa-jaria" element={<SadqaJaria />} />
                <Route path="/daily-verse" element={<DailyVerse />} />
                <Route path="/islamic-themes" element={<IslamicThemes />} />
                <Route path="/islamic-quiz" element={<IslamicQuiz />} />
                <Route path="/salah-guide" element={<SalahGuide />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/tip-developer" element={<TipDeveloper />} />
                <Route path="/islamic-channels" element={<ChannelsModule />} />
                <Route path="/settings" element={<SettingsModule />} />
                <Route path="/tasbeeh" element={<TasbeehModule />} />
                <Route path="/prayer-times" element={<PrayerTimesModule />} />
                <Route path="/qibla" element={<QiblaModule />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;
