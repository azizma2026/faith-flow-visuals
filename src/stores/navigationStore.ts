
import { create } from 'zustand'

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
  | 'settings';

interface NavigationState {
  activeModule: ModuleType;
  previousModule: ModuleType | null;
  setActiveModule: (module: ModuleType) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeModule: 'home',
  previousModule: null,
  setActiveModule: (module) => 
    set((state) => ({ 
      activeModule: module, 
      previousModule: state.activeModule 
    })),
  goBack: () => 
    set((state) => ({ 
      activeModule: state.previousModule || 'home',
      previousModule: null
    })),
}))
