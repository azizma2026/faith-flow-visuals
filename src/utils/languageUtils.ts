
// Language utility functions

export interface Language {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
}

export const languages: Language[] = [
  { code: 'en', name: 'English', direction: 'ltr' },
  { code: 'ar', name: 'العربية', direction: 'rtl' },
  { code: 'ur', name: 'اردو', direction: 'rtl' },
  { code: 'fr', name: 'Français', direction: 'ltr' },
  { code: 'id', name: 'Bahasa Indonesia', direction: 'ltr' },
  { code: 'tr', name: 'Türkçe', direction: 'ltr' },
];

export const getDefaultLanguage = (): Language => {
  // Try to get from localStorage if available
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      const found = languages.find(lang => lang.code === savedLang);
      if (found) return found;
    }
  }
  
  // Default to English
  return languages[0];
};

export const saveLanguagePreference = (languageCode: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferredLanguage', languageCode);
  }
};
