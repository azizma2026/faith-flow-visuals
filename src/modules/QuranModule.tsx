
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Book, Type, Headphones, BookOpen, Download, Share2, Heart, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { 
  useCombinedSurah, 
  TRANSLATION_MAP, 
  TAFSIR_MAP 
} from "@/api/quranClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock reciters data
const RECITERS = [
  { id: 1, name: "Abdul Rahman Al-Sudais", isNew: false, hasOfflineContent: true },
  { id: 2, name: "Mishari Rashid Al-Afasy", isNew: false, hasOfflineContent: false },
  { id: 3, name: "Saud Al-Shuraim", isNew: true, hasOfflineContent: false },
  { id: 4, name: "Maher Al Muaiqly", isNew: false, hasOfflineContent: true },
  { id: 5, name: "Muhammad Siddiq Al-Minshawi", isNew: true, hasOfflineContent: false }
];

const FONTS = [
  { id: "indopak", name: "Indopak", preview: "بِسْمِ اللَّهِ" },
  { id: "uthmani", name: "Uthmani", preview: "بِسْمِ اللَّهِ" },
  { id: "tajweed", name: "Tajweed Mushaf", preview: "بِسْمِ اللَّهِ" }
];

const TAFSIRS = [
  { id: "taqi_usmani", name: "Taqi Usmani" },
  { id: "ibn_kathir", name: "Ibn Kathir" },
  { id: "jalalayn", name: "Al-Jalalayn" },
  { id: "maariful", name: "Maariful Quran" }
];

const TRANSLATIONS = [
  { 
    id: "en_kfc", 
    name: "English - Muhammad Asad (King Fahd Complex)",
    organization: "King Fahd Complex for the Printing of the Holy Quran",
    year: "1980"
  },
  { 
    id: "en_sahih", 
    name: "English - Sahih International",
    organization: "Dar Abul-Qasim Publishing House",
    year: "1997"
  },
  { id: "en_pickthall", name: "English - Pickthall", year: "1930" },
  { id: "ur_jalandhry", name: "Urdu - Jalandhry" },
  { id: "tr_diyanet", name: "Turkish - Diyanet" },
  { id: "fr_hamidullah", name: "French - Hamidullah" }
];

const QuranModule: React.FC = () => {
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [selectedFont, setSelectedFont] = useState("uthmani");
  const [selectedReciter, setSelectedReciter] = useState<number | null>(null);
  const [selectedTafsir, setSelectedTafsir] = useState("taqi_usmani");
  const [selectedTranslation, setSelectedTranslation] = useState("en_kfc"); // Default to King Fahd Complex
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [surahNumber, setSurahNumber] = useState(1); // Starting with Al-Fatiha
  
  const { toast } = useToast();

  // Fetch the surah with translations
  const { 
    data: surah, 
    isLoading, 
    isError, 
    error 
  } = useCombinedSurah(
    surahNumber, 
    TRANSLATION_MAP[selectedTranslation as keyof typeof TRANSLATION_MAP]
  );

  const handlePlay = (ayahNumber: number) => {
    if (selectedReciter === null) {
      toast({
        title: "No reciter selected",
        description: "Please select a reciter to play audio",
      });
      return;
    }
    
    setCurrentlyPlaying(currentlyPlaying === ayahNumber ? null : ayahNumber);
    
    toast({
      title: "Playing ayah",
      description: `Now playing ayah ${ayahNumber} by ${RECITERS.find(r => r.id === selectedReciter)?.name}`,
    });
  };

  const handleBookmark = (ayahNumber: number) => {
    toast({
      title: "Ayah bookmarked",
      description: `Surah ${surahNumber}, Ayah ${ayahNumber} has been saved to your bookmarks`,
    });
  };

  const handleShare = (ayahNumber: number) => {
    if (!surah) return;
    
    const ayah = surah.ayahs.find(a => a.numberInSurah === ayahNumber);
    if (!ayah) return;
    
    navigator.clipboard.writeText(`${ayah.text}\n\n${ayah.translation}\n\nSurah ${surah.englishName}, Ayah ${ayahNumber}`);
    
    toast({
      title: "Ayah copied to clipboard",
      description: "You can now share it with others",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading Surah",
      description: `Surah ${surah?.englishName || ''} will be available offline shortly.`,
    });
  };

  const fontClass = {
    indopak: "font-indopak",
    uthmani: "font-uthmani",
    tajweed: "font-tajweed"
  }[selectedFont] || "font-uthmani";

  return (
    <motion.div 
      className="p-4 pb-24 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-islamic-green rounded-xl p-3 mr-4">
          <Book className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Quran</h1>
          {!isLoading && surah && (
            <p className="text-sm text-gray-500">
              Surah {surah.number}: {surah.englishName}
            </p>
          )}
        </div>
      </div>

      <Tabs defaultValue="read" className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Display Options</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-translation">Show Translation</Label>
                    <p className="text-sm text-gray-500">Enable or disable translations</p>
                  </div>
                  <Switch
                    id="show-translation"
                    checked={showTranslation}
                    onCheckedChange={setShowTranslation}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-tafsir">Show Tafsir</Label>
                    <p className="text-sm text-gray-500">Enable or disable Tafsir explanations</p>
                  </div>
                  <Switch
                    id="show-tafsir"
                    checked={showTafsir}
                    onCheckedChange={setShowTafsir}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-select">Quran Font Style</Label>
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
                    <SelectTrigger id="font-select" className="w-full">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Font Styles</SelectLabel>
                        {FONTS.map(font => (
                          <SelectItem key={font.id} value={font.id}>
                            <div className="flex items-center">
                              <span>{font.name}</span>
                              <span className="ml-2 text-sm opacity-70">{font.preview}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="translation-select">Translation</Label>
                  <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                    <SelectTrigger id="translation-select" className="w-full">
                      <SelectValue placeholder="Select a translation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Translations</SelectLabel>
                        {TRANSLATIONS.map(translation => (
                          <SelectItem key={translation.id} value={translation.id}>
                            <div>
                              {translation.name}
                              {translation.organization && (
                                <p className="text-xs text-gray-500">{translation.organization}, {translation.year}</p>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tafsir-select">Tafsir</Label>
                  <Select value={selectedTafsir} onValueChange={setSelectedTafsir}>
                    <SelectTrigger id="tafsir-select" className="w-full">
                      <SelectValue placeholder="Select a tafsir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Tafsirs</SelectLabel>
                        {TAFSIRS.map(tafsir => (
                          <SelectItem key={tafsir.id} value={tafsir.id}>
                            {tafsir.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surah-select">Surah</Label>
                  <Select value={surahNumber.toString()} onValueChange={(value) => setSurahNumber(parseInt(value))}>
                    <SelectTrigger id="surah-select" className="w-full">
                      <SelectValue placeholder="Select a surah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Surahs</SelectLabel>
                        {Array.from({ length: 114 }, (_, i) => i + 1).map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}. {num === 1 ? "Al-Fatiha" : 
                                num === 2 ? "Al-Baqarah" : 
                                num === 3 ? "Aal-Imran" : `Surah ${num}`}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Select Reciter</h3>
              
              <ScrollArea className="h-72 pr-4">
                <div className="space-y-4">
                  {RECITERS.map(reciter => (
                    <div 
                      key={reciter.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedReciter === reciter.id ? 'border-islamic-green bg-islamic-green/10' : 'border-gray-200 hover:border-islamic-green/50'
                      }`}
                      onClick={() => setSelectedReciter(reciter.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-islamic-gold/20 rounded-full flex items-center justify-center mr-3">
                            <Headphones className="h-5 w-5 text-islamic-gold" />
                          </div>
                          <div>
                            <p className="font-medium">{reciter.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {reciter.isNew && (
                                <span className="bg-islamic-green text-white text-xs px-1.5 py-0.5 rounded">New</span>
                              )}
                              {reciter.hasOfflineContent && (
                                <span className="flex items-center text-xs text-gray-500">
                                  <Download className="h-3 w-3 mr-1" /> Offline
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {selectedReciter === reciter.id && (
                          <div className="w-4 h-4 rounded-full bg-islamic-green"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Selected Reciter
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="read">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-islamic-green animate-spin mb-4" />
              <p>Loading Quran content...</p>
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : "Failed to load Quran content. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && surah && (
            <div className="space-y-6">
              {surah.ayahs.map((ayah) => (
                <Card key={ayah.numberInSurah} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-islamic-gold/20 text-islamic-gold font-medium rounded-full w-8 h-8 flex items-center justify-center">
                        {ayah.numberInSurah}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handlePlay(ayah.numberInSurah)}
                          className={currentlyPlaying === ayah.numberInSurah ? "text-islamic-green" : ""}
                        >
                          <Headphones className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleBookmark(ayah.numberInSurah)}
                        >
                          <Heart className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleShare(ayah.numberInSurah)}
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <p className={`text-right text-2xl leading-loose mb-3 ${fontClass}`}>
                      {ayah.text}
                    </p>
                    
                    {showTranslation && (
                      <>
                        <Separator className="my-3" />
                        <p className="text-gray-700 dark:text-gray-300">{ayah.translation}</p>
                        <p className="text-xs text-gray-500 mt-1">Source: {ayah.translationSource}</p>
                      </>
                    )}
                    
                    {showTafsir && (
                      <>
                        <Separator className="my-3" />
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                          <h4 className="text-sm font-medium mb-1 flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" /> Tafsir
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {/* Tafsir content would be fetched from an API in a real app */}
                            This is where the tafsir content would appear when properly fetched from an API.
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {surah && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 flex space-x-8">
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={surahNumber <= 1}
              onClick={() => setSurahNumber(prev => Math.max(1, prev - 1))}
            >
              Previous Surah
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              disabled={surahNumber >= 114}
              onClick={() => setSurahNumber(prev => Math.min(114, prev + 1))}
            >
              Next Surah
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QuranModule;
