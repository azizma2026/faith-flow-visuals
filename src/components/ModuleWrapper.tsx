import React, { Suspense, lazy } from 'react';
import { useNavigationStore, ModuleType } from '@/stores/navigationStore';
import { motion } from 'framer-motion';

// Lazy load heavy components
const QuranModule = lazy(() => import('@/modules/QuranModule'));
const PrayerTimesModule = lazy(() => import('@/modules/PrayerTimesModule'));
const QiblaModule = lazy(() => import('@/modules/QiblaModule'));
const HadithModule = lazy(() => import('@/modules/HadithModule'));
const TasbeehModule = lazy(() => import('@/modules/TasbeehModule'));
const DuasModule = lazy(() => import('@/modules/DuasModule'));
const ChannelsModule = lazy(() => import('@/modules/ChannelsModule'));
const SadqaJariaModule = lazy(() => import('@/pages/SadqaJaria'));
const DailyVerseModule = lazy(() => import('@/pages/DailyVerse'));
const QuranEngagementModule = lazy(() => import('@/pages/QuranEngagement'));
const SettingsModule = lazy(() => import('@/modules/SettingsModule'));
const IslamicThemesModule = lazy(() => import('@/modules/IslamicThemesModule'));
const IslamicQuizModule = lazy(() => import('@/modules/IslamicQuizModule'));
const SalahGuideModule = lazy(() => import('@/modules/SalahGuideModule'));
const CertificatesModule = lazy(() => import('@/modules/CertificatesModule'));
const TipDeveloperModule = lazy(() => import('@/modules/TipDeveloperModule'));

// Default component for modules that aren't fully implemented yet
const ComingSoonModule = () => (
  <div className="flex flex-col items-center justify-center h-screen p-6">
    <h1 className="text-2xl font-bold text-islamic-gold mb-4">Coming Soon</h1>
    <p className="text-center text-gray-600 dark:text-gray-300">
      This feature is under development and will be available soon.
    </p>
  </div>
);

const moduleComponents: Record<ModuleType, React.ComponentType> = {
  home: () => null,
  quran: QuranModule,
  prayerTimes: PrayerTimesModule,
  qibla: QiblaModule,
  hadith: HadithModule,
  tasbeeh: TasbeehModule,
  duas: DuasModule,
  channels: ChannelsModule,
  sadqaJaria: SadqaJariaModule,
  dailyVerse: DailyVerseModule,
  quranEngagement: QuranEngagementModule,
  islamicThemes: IslamicThemesModule,
  islamicQuiz: IslamicQuizModule,
  salahGuide: SalahGuideModule,
  certificates: CertificatesModule,
  tipDeveloper: TipDeveloperModule,
  settings: SettingsModule,
  contact: ComingSoonModule,
  notifications: ComingSoonModule,
  share: ComingSoonModule,
  rate: ComingSoonModule,
  hajjGuide: ComingSoonModule,
  knowledgeTests: ComingSoonModule
};

export const ModuleWrapper: React.FC = () => {
  const { activeModule, goBack } = useNavigationStore();
  
  // Return null when on home screen
  if (activeModule === 'home') return null;
  
  const ActiveModuleComponent = moduleComponents[activeModule];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white dark:bg-islamic-dark-navy overflow-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-green"></div>
        </div>
      }>
        <ActiveModuleComponent />
      </Suspense>
      
      <motion.button
        onClick={goBack}
        className="fixed top-4 left-4 z-50 bg-islamic-gold text-white p-2 rounded-full shadow-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5m7 7-7-7 7-7" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default ModuleWrapper;
