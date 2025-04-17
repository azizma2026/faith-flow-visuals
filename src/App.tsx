
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NavigationMenu } from "@/components/ui/navigation-menu";
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
import ModuleWrapper from "./components/ModuleWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ModuleWrapper />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
