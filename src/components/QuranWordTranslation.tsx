
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
      <p className={`text-right ${className} leading-loose font-arabic text-2xl`} dir="rtl">
        {arabicText}
      </p>
    );
  }

  return (
    <TooltipProvider>
      <div className={`text-right ${className} leading-loose`} dir="rtl">
        {words.map((word, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <span className="inline-block mx-1 cursor-help hover:text-[#b4a89a] transition-colors font-arabic text-2xl">
                {word.arabic}
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-[#f5f0e8] border-[#b4a89a] p-2 max-w-xs">
              <div className="text-center">
                <p className="font-medium">{word.transliteration}</p>
                <p className="text-sm text-muted-foreground">{word.translation}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default QuranWordTranslation;
