
import React, { useState } from 'react';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useWordByWordData, WordData } from '@/api/quranWordsClient';

interface WordTranslationProps {
  arabicText: string;
  surahNumber: number;
  ayahNumber: number;
  className?: string;
  showLoading?: boolean;
}

const QuranWordTranslation: React.FC<WordTranslationProps> = ({ 
  arabicText, 
  surahNumber,
  ayahNumber,
  className = "",
  showLoading = true
}) => {
  const { data: words, isLoading, error } = useWordByWordData(surahNumber, ayahNumber);
  const [focusedWord, setFocusedWord] = useState<number | null>(null);

  // If we're loading and should show the loading state
  if (isLoading && showLoading) {
    return (
      <div className="quran-verse-container py-4 my-2 px-2 border-b border-islamic-warm-beige">
        <div className="flex flex-row-reverse gap-2 flex-wrap">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-10 w-16 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  // If there's an error or no word data available, fall back to showing the full verse text
  if (error || !words || words.length === 0) {
    return (
      <div className="quran-verse-container py-4 my-2 px-2 border-b border-islamic-warm-beige">
        <p className={`text-right ${className} leading-loose font-arabic text-2xl quran-arabic-text`} dir="rtl">
          {arabicText}
        </p>
      </div>
    );
  }

  // Handle word focus
  const handleWordFocus = (index: number) => {
    setFocusedWord(index);
  };

  const handleWordBlur = () => {
    setFocusedWord(null);
  };

  return (
    <TooltipProvider>
      <div className="quran-verse-container py-4 my-2 px-2 border-b border-islamic-warm-beige">
        <div className={`text-right ${className} leading-loose flex flex-row-reverse flex-wrap gap-2`} dir="rtl">
          {words.map((word, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <span 
                  className={`inline-block cursor-help hover:text-islamic-gold transition-colors font-arabic text-2xl quran-arabic-text p-1 rounded-md ${focusedWord === index ? 'bg-islamic-gold/10' : ''}`}
                  onMouseEnter={() => handleWordFocus(index)}
                  onMouseLeave={handleWordBlur}
                  onFocus={() => handleWordFocus(index)}
                  onBlur={handleWordBlur}
                >
                  {word.arabic_text}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-islamic-light-beige border-islamic-warm-beige p-3 max-w-xs rounded-md shadow-md">
                <div className="text-center">
                  <p className="font-medium text-islamic-text-brown">{word.transliteration}</p>
                  <p className="text-sm text-islamic-text-light-brown">{word.translation}</p>
                  {word.part_of_speech && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {word.part_of_speech}
                    </Badge>
                  )}
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
