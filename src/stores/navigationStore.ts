
import { create } from 'zustand';

export type ModuleType = 
  | 'home'
  | 'quran'
  | 'prayerTimes'
  | 'qibla'
  | 'hadith'
  | 'tasbeeh'
  | 'duas'
  | 'channels'
  | 'sadqaJaria'
  | 'dailyVerse'
  | 'quranEngagement'
  | 'islamicThemes'
  | 'islamicQuiz'
  | 'salahGuide'
  | 'certificates'
  | 'tipDeveloper'
  | 'settings'
  | 'contact'
  | 'notifications'
  | 'share' 
  | 'rate'
  | 'hajjGuide'
  | 'knowledgeTests'
  | 'namesOfAllah'
  | 'islamicCalendar'
  | 'dailyReminder'
  | 'zakatCalculator'
  | 'makkahLive'
  | 'prayerTracker'
  | 'halalFinder';

export interface NavigationState {
  activeModule: ModuleType;
  navigationHistory: ModuleType[];
  setActiveModule: (module: ModuleType) => void;
  goBack: () => void;
  resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeModule: 'home',
  navigationHistory: [],
  setActiveModule: (module) => set((state) => {
    if (state.activeModule === module) return state;
    
    // Add current module to history if navigating away from home
    const newHistory = state.activeModule === 'home' 
      ? [] 
      : [...state.navigationHistory, state.activeModule];
    
    return {
      activeModule: module,
      navigationHistory: newHistory
    };
  }),
  goBack: () => set((state) => {
    if (state.navigationHistory.length === 0) {
      return { activeModule: 'home', navigationHistory: [] };
    }
    
    // Pop the last item as the current module
    const newHistory = [...state.navigationHistory];
    const previousModule = newHistory.pop() || 'home';
    
    return {
      activeModule: previousModule,
      navigationHistory: newHistory
    };
  }),
  resetNavigation: () => set({ activeModule: 'home', navigationHistory: [] })
}));
