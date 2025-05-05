
import React, { useState, useRef, useEffect } from "react";
import { useCombinedSurah } from "@/api/quranClient";
import { 
  getAudioUrl, 
  RECITERS_DATABASE, 
  TRANSLATION_MAP, 
  TAFSIR_MAP 
} from "@/api/quranClient";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { BookmarkIcon, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface QuranPlayerProps {
  surahNumber: number;
  defaultTranslation?: keyof typeof TRANSLATION_MAP;
  defaultReciterId?: string;
  jumpToAyah?: number;
  onAyahChange?: (ayahIndex: number) => void;
  onBookmarkChange?: (isBookmarked: boolean, surahNumber: number, ayahNumber: number, text: string, translation: string) => void;
  isAyahBookmarked?: (surahNumber: number, ayahNumber: number) => boolean;
}

export const QuranPlayer: React.FC<QuranPlayerProps> = ({
  surahNumber,
  defaultTranslation = "en_kfc",
  defaultReciterId = "Sudais",
  jumpToAyah,
  onAyahChange,
  onBookmarkChange,
  isAyahBookmarked = () => false
}) => {
  const [ayahIndex, setAyahIndex] = useState(0);
  const [translationEdition, setTranslationEdition] = useState(TRANSLATION_MAP[defaultTranslation]);
  const [reciterId, setReciterId] = useState(defaultReciterId);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const isMobile = useIsMobile();
  const { fontSize } = useAccessibility();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const { data: surahData, isLoading, isError } = useCombinedSurah(surahNumber, translationEdition);

  const currentAyah = surahData?.ayahs[ayahIndex];
  const audioUrl = currentAyah ? getAudioUrl(reciterId, surahNumber, currentAyah.numberInSurah) : "";

  // Jump to specified ayah if provided
  useEffect(() => {
    if (jumpToAyah && surahData && jumpToAyah <= surahData.ayahs.length) {
      // Adjust for 0-based index
      const targetIndex = surahData.ayahs.findIndex(a => a.numberInSurah === jumpToAyah);
      if (targetIndex !== -1) {
        setAyahIndex(targetIndex);
      }
    }
  }, [jumpToAyah, surahData]);

  // Check bookmark status when ayah changes
  useEffect(() => {
    if (currentAyah) {
      const isBookmarked = isAyahBookmarked(surahNumber, currentAyah.numberInSurah);
      setBookmarked(isBookmarked);
    }
  }, [currentAyah, surahNumber, isAyahBookmarked]);

  // Notify parent of ayah changes
  useEffect(() => {
    if (onAyahChange && currentAyah) {
      onAyahChange(ayahIndex);
    }
  }, [ayahIndex, onAyahChange, currentAyah]);

  // Try playback and show error if it fails
  const handleAudioPlay = () => {
    setPlaybackError(null);
    if (audioRef.current) {
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          setPlaybackError(
            "Could not play audio. Try another reciter, or check your internet connection."
          );
        });
      }
    }
  };

  // Whenever reciter or ayah changes, play audio
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      handleAudioPlay();
    }
    // eslint-disable-next-line
  }, [audioUrl, reciterId, ayahIndex]);

  // Handle bookmark toggle
  const toggleBookmark = () => {
    if (!currentAyah) return;
    
    const newBookmarkState = !bookmarked;
    setBookmarked(newBookmarkState);
    
    if (onBookmarkChange) {
      onBookmarkChange(
        newBookmarkState,
        surahNumber,
        currentAyah.numberInSurah,
        currentAyah.text,
        currentAyah.translation
      );
    }
    
    toast({
      title: newBookmarkState ? "Ayah bookmarked" : "Bookmark removed",
      description: newBookmarkState 
        ? `Saved Surah ${surahNumber}, Ayah ${currentAyah.numberInSurah} to your bookmarks`
        : `Removed from your bookmarks`,
    });
  };

  if (isLoading) return <p>Loading Surah...</p>;
  if (isError || !surahData) return <p>Failed to load Surah data.</p>;

  // Determine font size classes based on accessibility settings and device
  const arabicTextSizeClass = isMobile 
    ? "text-[18px] md:text-[22px] quran-arabic-text" 
    : `text-[${22 + (fontSize * 2)}px] lg:text-[${24 + (fontSize * 2)}px] quran-arabic-text`;
    
  const translationTextSizeClass = isMobile
    ? "text-[14px] md:text-[16px] quran-translation-text"
    : `text-[${16 + fontSize}px] quran-translation-text`;

  return (
    <div className={`p-4 ${isMobile ? 'pb-24' : 'pb-6'} w-full max-w-3xl mx-auto`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{surahData.name} ({surahData.englishName})</h2>
        <h4 className="text-muted-foreground">{surahData.englishNameTranslation}</h4>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-start mb-3">
          <div className="bg-islamic-gold/20 text-islamic-gold font-medium rounded-full w-10 h-10 flex items-center justify-center">
            {currentAyah?.numberInSurah}
          </div>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBookmark}
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <BookmarkIcon 
                className={`h-5 w-5 ${bookmarked ? "fill-islamic-gold text-islamic-gold" : ""}`} 
              />
            </Button>
          </div>
        </div>

        <p 
          className={`text-right ${arabicTextSizeClass} mb-4 leading-loose mobile-text-container`} 
          dir="rtl"
        >
          {currentAyah?.text}
        </p>
        
        <p className={`${translationTextSizeClass} mb-2 mobile-text-container`}>
          <strong>Translation:</strong> {currentAyah?.translation}
        </p>
        
        <audio
          key={audioUrl}
          src={audioUrl}
          ref={audioRef}
          autoPlay
          controls
          className="w-full mt-4"
          onError={() =>
            setPlaybackError(
              "Could not play audio. Try another reciter, or check your internet connection."
            )
          }
        />

        {playbackError && (
          <div className="text-destructive bg-destructive/10 p-3 rounded-md mt-3">
            <p className="font-medium">Audio Error: {playbackError}</p>
          </div>
        )}
      </div>

      <div className={`${isMobile ? 'mobile-media-controls' : 'flex justify-center gap-4'} mt-4`}>
        <Button
          variant="outline"
          disabled={ayahIndex <= 0}
          onClick={() => setAyahIndex((i) => i - 1)}
          className={isMobile ? "mobile-touch-target" : ""}
          aria-label="Previous ayah"
        >
          ◀️ Previous
        </Button>
        <Button
          variant="outline"
          disabled={ayahIndex >= surahData.ayahs.length - 1}
          onClick={() => setAyahIndex((i) => i + 1)}
          className={isMobile ? "mobile-touch-target" : ""}
          aria-label="Next ayah"
        >
          Next ▶️
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        <div className="grid gap-2">
          <label htmlFor="reciter-select" className="text-sm font-medium">
            Reciter:
          </label>
          <select
            id="reciter-select"
            value={reciterId}
            onChange={(e) => {
              setReciterId(e.target.value);
              setPlaybackError(null);
            }}
            className="p-2 border rounded-md w-full mobile-touch-target"
          >
            {RECITERS_DATABASE.map((reciter) => (
              <option key={reciter.id} value={reciter.id}>
                {reciter.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="translation-select" className="text-sm font-medium">
            Translation:
          </label>
          <select
            id="translation-select"
            value={translationEdition}
            onChange={(e) => {
              setTranslationEdition(e.target.value);
              setAyahIndex(0); // Reset to first ayah when language changes
            }}
            className="p-2 border rounded-md w-full mobile-touch-target"
          >
            {Object.entries(TRANSLATION_MAP).map(([label, edition]) => (
              <option key={edition} value={edition}>
                {label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {isMobile && (
        <div className="h-16"></div>  // Spacer for mobile to avoid navigation overlap
      )}
    </div>
  );
};

export default QuranPlayer;
