
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getDefaultLanguage, saveLanguagePreference } from '@/utils/languageUtils';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getDefaultLanguage());

  useEffect(() => {
    // Update document direction based on language
    document.documentElement.dir = currentLanguage.direction;
    document.documentElement.lang = currentLanguage.code;
    
    // Save preference
    saveLanguagePreference(currentLanguage.code);
  }, [currentLanguage]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
