
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

// Define module groups for organization
export const moduleGroups = {
  core: ['quran', 'prayerTimes', 'qibla', 'tasbeeh'] as ModuleType[],
  knowledge: ['hadith', 'islamicCalendar', 'namesOfAllah'] as ModuleType[],
  utility: ['duas', 'salahGuide', 'hajjGuide'] as ModuleType[],
  social: ['channels', 'sadqaJaria'] as ModuleType[]
};

export interface NavigationState {
  activeModule: ModuleType;
  navigationHistory: ModuleType[];
  previousModule: ModuleType | null;
  setActiveModule: (module: ModuleType) => void;
  goBack: () => void;
  goTo: (module: ModuleType) => void;
  resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeModule: 'home',
  navigationHistory: [],
  previousModule: null,
  
  setActiveModule: (module) => set((state) => {
    // Don't update if navigating to the same module
    if (state.activeModule === module) return state;
    
    // Add current module to history if navigating away from home
    const newHistory = state.activeModule === 'home' 
      ? [] 
      : [...state.navigationHistory, state.activeModule];
    
    return {
      activeModule: module,
      navigationHistory: newHistory,
      previousModule: state.activeModule
    };
  }),
  
  goBack: () => set((state) => {
    if (state.navigationHistory.length === 0) {
      return { 
        activeModule: 'home', 
        navigationHistory: [],
        previousModule: state.activeModule
      };
    }
    
    // Pop the last item as the current module
    const newHistory = [...state.navigationHistory];
    const previousModule = newHistory.pop() || 'home';
    
    return {
      activeModule: previousModule,
      navigationHistory: newHistory,
      previousModule: state.activeModule
    };
  }),
  
  goTo: (module) => set((state) => {
    // Clear history and go directly to the specified module
    return {
      activeModule: module,
      navigationHistory: [],
      previousModule: state.activeModule
    };
  }),
  
  resetNavigation: () => set({ 
    activeModule: 'home', 
    navigationHistory: [],
    previousModule: null
  })
}));
