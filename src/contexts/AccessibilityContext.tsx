
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrastMode: boolean;
  toggleHighContrastMode: () => void;
  fontSize: number | 'normal' | 'large' | 'x-large';
  setFontSize: (size: 'normal' | 'large' | 'x-large' | number) => void;
  screenReaderMode: boolean;
  toggleScreenReaderMode: () => void;
}

const defaultContext: AccessibilityContextType = {
  highContrastMode: false,
  toggleHighContrastMode: () => {},
  fontSize: 'normal',
  setFontSize: () => {},
  screenReaderMode: false,
  toggleScreenReaderMode: () => {},
};

const AccessibilityContext = createContext<AccessibilityContextType>(defaultContext);

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'x-large' | number>('normal');
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  const toggleHighContrastMode = () => {
    const newMode = !highContrastMode;
    setHighContrastMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const toggleScreenReaderMode = () => {
    setScreenReaderMode(!screenReaderMode);
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedHighContrastMode = localStorage.getItem('highContrastMode') === 'true';
    const savedFontSize = localStorage.getItem('fontSize') as 'normal' | 'large' | 'x-large' || 'normal';
    const savedScreenReaderMode = localStorage.getItem('screenReaderMode') === 'true';
    
    setHighContrastMode(savedHighContrastMode);
    setFontSize(savedFontSize);
    setScreenReaderMode(savedScreenReaderMode);
    
    if (savedHighContrastMode) {
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  // Save settings to localStorage on change
  useEffect(() => {
    localStorage.setItem('highContrastMode', highContrastMode.toString());
    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('screenReaderMode', screenReaderMode.toString());
  }, [highContrastMode, fontSize, screenReaderMode]);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrastMode,
        toggleHighContrastMode,
        fontSize,
        setFontSize,
        screenReaderMode,
        toggleScreenReaderMode,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
