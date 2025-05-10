
import React from 'react';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface WordTranslationProps {
  arabicText: string;
  words: {
    arabic: string;
    transliteration: string;
    translation: string;
  }[];
  className?: string;
}

const QuranWordTranslation: React.FC<WordTranslationProps> = ({ 
  arabicText, 
  words, 
  className = "" 
}) => {
  // If we don't have word-by-word data, just display the full text
  if (!words || words.length === 0) {
    return (
      <div className="quran-verse-container">
        <p className={`text-right ${className} leading-loose font-arabic text-2xl quran-arabic-text`} dir="rtl">
          {arabicText}
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="quran-verse-container">
        <div className={`text-right ${className} leading-loose`} dir="rtl">
          {words.map((word, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <span className="inline-block mx-1 cursor-help hover:text-[#8a7356] transition-colors font-arabic text-2xl quran-arabic-text">
                  {word.arabic}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-[#f8f4ea] border-[#d5c7a9] p-3 max-w-xs rounded-md shadow-md">
                <div className="text-center">
                  <p className="font-medium text-[#564f47]">{word.transliteration}</p>
                  <p className="text-sm text-[#6b6256]">{word.translation}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default QuranWordTranslation;
