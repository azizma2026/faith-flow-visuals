
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
import { BookmarkIcon, Loader2, RefreshCw, AlertCircle, ChevronDown, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { isWordDataAvailable } from "@/api/quranWordsClient";
import QuranWordTranslation from "./QuranWordTranslation";
import QuranTagging from "./QuranTagging";
import DailyReadingSchedule from "./DailyReadingSchedule";

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
  const [isRetrying, setIsRetrying] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [showWordTranslation, setShowWordTranslation] = useState(false);
  const [activeTab, setActiveTab] = useState("reading");
  const isMobile = useIsMobile();
  const { fontSize } = useAccessibility();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const { data: surahData, isLoading, isError } = useCombinedSurah(surahNumber, translationEdition);

  const currentAyah = surahData?.ayahs[ayahIndex];
  
  // Check if word-by-word data is available for this surah
  const wordDataAvailable = isWordDataAvailable(surahNumber);
  
  // Primary audio URL
  const audioUrl = currentAyah ? getAudioUrl(reciterId, surahNumber, currentAyah.numberInSurah) : "";
  
  // Fallback audio URLs for different reciters
  const fallbackReciters = ["Alafasy", "Abdul_Basit_Murattal", "Minshawi_Mujawwad"];
  const getFallbackAudioUrl = () => {
    // Pick a different reciter as fallback
    if (currentAyah) {
      const fallbackReciter = fallbackReciters.find(r => r !== reciterId) || "Alafasy";
      return getAudioUrl(fallbackReciter, surahNumber, currentAyah.numberInSurah);
    }
    return "";
  };
  
  useEffect(() => {
    if (jumpToAyah && surahData && jumpToAyah <= surahData.ayahs.length) {
      const targetIndex = surahData.ayahs.findIndex(a => a.numberInSurah === jumpToAyah);
      if (targetIndex !== -1) {
        setAyahIndex(targetIndex);
      }
    }
  }, [jumpToAyah, surahData]);
  
  useEffect(() => {
    if (currentAyah) {
      const isBookmarked = isAyahBookmarked(surahNumber, currentAyah.numberInSurah);
      setBookmarked(isBookmarked);
    }
  }, [currentAyah, surahNumber, isAyahBookmarked]);
  
  useEffect(() => {
    if (onAyahChange && currentAyah) {
      onAyahChange(ayahIndex);
    }
  }, [ayahIndex, onAyahChange, currentAyah]);
  
  const handleAudioPlay = (url: string = audioUrl) => {
    if (!url) return;
    
    setAudioLoading(true);
    setPlaybackError(null);
    setIsRetrying(false);
    
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioLoading(false);
            setFallbackAttempted(false); // Reset fallback status on successful play
            console.log(`Playing audio successfully from: ${url}`);
          })
          .catch((err) => {
            console.error("Audio playback error:", err);
            setAudioLoading(false);
            setPlaybackError(
              "Could not play audio. Try another reciter, or check your internet connection."
            );
          });
      }
    }
  };

  // Handle trying a fallback reciter
  const tryFallbackReciter = () => {
    setFallbackAttempted(true);
    const fallbackUrl = getFallbackAudioUrl();
    console.log(`Trying fallback audio URL: ${fallbackUrl}`);
    
    // Attempt to change to a different reciter in UI
    const fallbackReciter = fallbackReciters.find(r => r !== reciterId) || "Alafasy";
    setReciterId(fallbackReciter);
    
    toast({
      title: "Trying alternate reciter",
      description: `Switched to ${RECITERS_DATABASE.find(r => r.id === fallbackReciter)?.name || fallbackReciter}`
    });
    
    // Try to play using fallback
    handleAudioPlay(fallbackUrl);
  };
  
  // Retry current audio with refreshed connection
  const retryAudio = () => {
    setIsRetrying(true);
    
    // Force browser to fetch a fresh copy
    const refreshedUrl = `${audioUrl}${audioUrl.includes('?') ? '&' : '?'}refresh=${Date.now()}`;
    console.log("Retrying with refreshed URL:", refreshedUrl);
    
    toast({
      title: "Retrying audio playback",
      description: "Attempting to reconnect to audio server..."
    });
    
    setTimeout(() => {
      handleAudioPlay(refreshedUrl);
    }, 1000);
  };
  
  // Initialize or change audio source
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      setFallbackAttempted(false); // Reset when URL changes
      handleAudioPlay();
    }
    // eslint-disable-next-line
  }, [audioUrl, reciterId, ayahIndex]);

  if (isLoading) return <p>Loading Surah...</p>;
  if (isError || !surahData) return <p>Failed to load Surah data.</p>;
  
  // Safely convert fontSize to a number
  const fontSizeValue = typeof fontSize === 'number' ? fontSize : 0;
  
  const arabicTextSizeClass = isMobile 
    ? "text-[18px] md:text-[22px] quran-arabic-text" 
    : `text-[${22 + (fontSizeValue * 2)}px] lg:text-[${24 + (fontSizeValue * 2)}px] quran-arabic-text`;
    
  const translationTextSizeClass = isMobile
    ? "text-[14px] md:text-[16px] quran-translation-text"
    : `text-[${16 + fontSizeValue}px] quran-translation-text`;

  return (
    <div className={`p-4 ${isMobile ? 'pb-24' : 'pb-6'} w-full max-w-3xl mx-auto`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{surahData.name} ({surahData.englishName})</h2>
        <h4 className="text-muted-foreground">{surahData.englishNameTranslation}</h4>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reading">
          <div className="bg-card rounded-lg shadow-sm p-4">
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
            
            <Collapsible
              open={showWordTranslation}
              onOpenChange={setShowWordTranslation}
              className="mb-4"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`w-full flex justify-between items-center mb-2 ${wordDataAvailable ? 'text-islamic-green' : 'text-muted-foreground opacity-70'}`}
                  disabled={!wordDataAvailable}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Word-by-Word Translation
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showWordTranslation ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {currentAyah && (
                  <QuranWordTranslation 
                    arabicText={currentAyah.text}
                    surahNumber={surahNumber}
                    ayahNumber={currentAyah.numberInSurah}
                    className={arabicTextSizeClass}
                  />
                )}
              </CollapsibleContent>
            </Collapsible>

            {!showWordTranslation && (
              <p 
                className={`text-right ${arabicTextSizeClass} mb-4 leading-loose mobile-text-container`} 
                dir="rtl"
              >
                {currentAyah?.text}
              </p>
            )}
            
            <p className={`${translationTextSizeClass} mb-2 mobile-text-container`}>
              <strong>Translation:</strong> {currentAyah?.translation}
            </p>
            
            {/* Add tagging functionality */}
            {currentAyah && (
              <QuranTagging 
                surahNumber={surahNumber} 
                ayahNumber={currentAyah.numberInSurah} 
              />
            )}
            
            <div className="relative mt-4">
              <audio
                key={audioUrl}
                ref={audioRef}
                src={audioUrl}
                controls
                className={`w-full ${playbackError ? 'opacity-60' : ''}`}
                onError={() => setPlaybackError(
                  "Could not play audio. Try another reciter, or check your internet connection."
                )}
              />
              
              {audioLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/20 rounded">
                  <Loader2 className="h-6 w-6 animate-spin text-islamic-green" />
                </div>
              )}
            </div>

            {playbackError && (
              <div className="mt-3">
                <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription className="flex flex-col space-y-2">
                    <p>{playbackError}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {!fallbackAttempted && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-card text-primary"
                          onClick={tryFallbackReciter}
                          disabled={isRetrying}
                        >
                          Try different reciter
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-card text-primary" 
                        onClick={retryAudio}
                        disabled={isRetrying}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRetrying ? 'animate-spin' : ''}`} />
                        Retry
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
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
          </div>
        </TabsContent>
        
        <TabsContent value="schedule">
          <DailyReadingSchedule />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-4">
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
                  setAyahIndex(0); 
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
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Display Options:
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="word-translation-toggle"
                  checked={showWordTranslation}
                  onChange={(e) => setShowWordTranslation(e.target.checked)}
                  className="mr-2"
                  disabled={!wordDataAvailable}
                />
                <label htmlFor="word-translation-toggle" className={!wordDataAvailable ? "opacity-70" : ""}>
                  Show word-by-word translation
                  {!wordDataAvailable && <span className="text-xs text-muted-foreground ml-2">(Not available for this surah)</span>}
                </label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {isMobile && (
        <div className="h-16"></div>  
      )}
    </div>
  );
  
  // Helper function to toggle bookmark status
  function toggleBookmark() {
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
  }
};

export default QuranPlayer;
