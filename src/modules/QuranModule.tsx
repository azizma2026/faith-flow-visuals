
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Book, 
  Type, 
  Headphones, 
  BookOpen, 
  Download, 
  Share2, 
  Heart, 
  Loader2, 
  Volume2, 
  VolumeX, 
  Pause,
  Search,
  Bookmark,
  X,
  ArrowLeft
} from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import QuranPlayer from "@/components/QuranPlayer";
import QuranSearch from "@/components/QuranSearch";
import QuranTafsir from "@/components/QuranTafsir";
import BookmarksPanel from "@/components/BookmarksPanel";
import useQuranBookmarks from "@/hooks/useQuranBookmarks";
import { 
  useCombinedSurah, 
  TRANSLATION_MAP, 
  TAFSIR_MAP,
  RECITERS_DATABASE,
} from "@/api/quranClient";

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
  const isMobile = useIsMobile();
  const { fontSize } = useAccessibility();
  
  // Core Quran state
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [selectedFont, setSelectedFont] = useState("uthmani");
  const [selectedReciterId, setSelectedReciterId] = useState<string>("Alafasy");
  const [selectedTafsir, setSelectedTafsir] = useState("taqi_usmani");
  const [selectedTranslation, setSelectedTranslation] = useState("en_kfc");
  const [surahNumber, setSurahNumber] = useState(1);
  const [jumpToAyah, setJumpToAyah] = useState<number | undefined>(undefined);
  
  // UI state
  const [activeTab, setActiveTab] = useState("read");
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [selectedAyahForTafsir, setSelectedAyahForTafsir] = useState<{surah: number, ayah: number} | null>(null);
  
  // Get bookmarks functionality
  const { 
    bookmarks, 
    addBookmark, 
    removeBookmark, 
    isBookmarked 
  } = useQuranBookmarks();
  
  const { toast } = useToast();

  // Handle search result selection
  const handleSearchResultSelect = (surah: number, ayah: number) => {
    setSurahNumber(surah);
    setJumpToAyah(ayah);
    setSearchOpen(false);
    toast({
      title: "Navigating to verse",
      description: `Surah ${surah}, Ayah ${ayah}`
    });
  };

  // Handle bookmark changes from QuranPlayer
  const handleBookmarkChange = (
    isBookmarked: boolean, 
    surahNumber: number, 
    ayahNumber: number, 
    text: string, 
    translation: string
  ) => {
    if (isBookmarked) {
      addBookmark({
        surahNumber,
        surahName: "", // Will be filled by the API in real implementation
        englishName: "", // Will be filled by the API in real implementation
        ayahNumber,
        text,
        translation
      });
    } else {
      removeBookmark(surahNumber, ayahNumber);
    }
  };

  // Handle showing tafsir for a specific ayah
  const showTafsirForAyah = (surah: number, ayah: number) => {
    setSelectedAyahForTafsir({ surah, ayah });
  };

  // Get font class for Arabic text
  const fontClass = {
    indopak: "font-indopak",
    uthmani: "font-uthmani",
    tajweed: "font-tajweed"
  }[selectedFont] || "font-uthmani";

  return (
    <motion.div 
      className={`p-4 ${isMobile ? 'pb-24' : 'pb-8'} max-w-4xl mx-auto`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      id="main-content"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-islamic-green rounded-xl p-3 mr-4">
            <Book className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold">Quran</h1>
            <p className="text-sm text-gray-500">
              Read, listen, and study the Holy Quran
            </p>
          </div>
        </div>
        
        {/* Quick action buttons for mobile */}
        {isMobile && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Quran"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setBookmarksOpen(true)}
              aria-label="Your bookmarks"
              className="relative"
            >
              <Bookmark className="h-5 w-5" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-islamic-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="mb-6"
      >
        <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-4'} mb-4`}>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          {!isMobile && <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>}
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
                              <span className={`ml-2 text-sm opacity-70 ${font.id === 'indopak' ? 'font-indopak' : font.id === 'tajweed' ? 'font-tajweed' : 'font-uthmani'}`}>
                                {font.preview}
                              </span>
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
                  <Select value={surahNumber.toString()} onValueChange={(value) => {
                    setSurahNumber(parseInt(value));
                    setJumpToAyah(undefined);
                    setActiveTab("read");
                  }}>
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
                  {RECITERS_DATABASE.map(reciter => (
                    <div 
                      key={reciter.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedReciterId === reciter.id ? 'border-islamic-green bg-islamic-green/10' : 'border-gray-200 hover:border-islamic-green/50'
                      }`}
                      onClick={() => setSelectedReciterId(reciter.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-islamic-gold/20 rounded-full flex items-center justify-center mr-3">
                            <Headphones className="h-5 w-5 text-islamic-gold" />
                          </div>
                          <div>
                            <p className="font-medium">{reciter.name}</p>
                            <p className="text-xs text-gray-500">{reciter.arabicName}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {reciter.style && (
                                <span className="text-xs text-gray-500">{reciter.style}</span>
                              )}
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
                        
                        {selectedReciterId === reciter.id && (
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
                  className="w-full mobile-touch-target" 
                  onClick={() => {
                    toast({
                      title: "Download Recitation",
                      description: "Recitations will be available offline (feature coming soon)",
                    });
                  }}
                  disabled={!selectedReciterId}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Selected Reciter
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookmarks">
          {!isMobile && (
            <Card>
              <CardContent className="pt-6">
                <BookmarksPanel 
                  bookmarks={bookmarks}
                  onSelectBookmark={(surah, ayah) => {
                    setSurahNumber(surah);
                    setJumpToAyah(ayah);
                    setActiveTab("read");
                  }}
                  onRemoveBookmark={removeBookmark}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="read">
          {/* Quick action buttons for desktop */}
          {!isMobile && (
            <div className="flex justify-end mb-4 space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setSearchOpen(true)}
                className="flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Quran
              </Button>
            </div>
          )}

          <QuranPlayer
            surahNumber={surahNumber}
            defaultTranslation={selectedTranslation as keyof typeof TRANSLATION_MAP}
            defaultReciterId={selectedReciterId}
            jumpToAyah={jumpToAyah}
            onBookmarkChange={handleBookmarkChange}
            isAyahBookmarked={isBookmarked}
          />

          {showTafsir && (
            <div className="mt-6">
              <QuranTafsir 
                surahNumber={surahNumber} 
                ayahNumber={jumpToAyah || 1} 
                tafsirSource={TAFSIRS.find(t => t.id === selectedTafsir)?.name || "Tafsir"} 
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Fixed bottom navigation for mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t mobile-nav-container">
          <div className="flex justify-around items-center">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center py-2"
              onClick={() => setActiveTab("read")}
            >
              <Book className={`h-5 w-5 ${activeTab === "read" ? "text-islamic-green" : ""}`} />
              <span className="text-xs mt-1">Read</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex flex-col items-center py-2"
              onClick={() => setActiveTab("audio")}
            >
              <Headphones className={`h-5 w-5 ${activeTab === "audio" ? "text-islamic-green" : ""}`} />
              <span className="text-xs mt-1">Audio</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex flex-col items-center py-2"
              onClick={() => setActiveTab("settings")}
            >
              <Type className={`h-5 w-5 ${activeTab === "settings" ? "text-islamic-green" : ""}`} />
              <span className="text-xs mt-1">Settings</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Search dialog/sheet */}
      {isMobile ? (
        <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader className="text-left mb-4">
              <SheetTitle>Search Quran</SheetTitle>
            </SheetHeader>
            <QuranSearch onSelect={handleSearchResultSelect} />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Search Quran</DialogTitle>
            <QuranSearch onSelect={handleSearchResultSelect} />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Bookmarks sheet for mobile */}
      {isMobile && (
        <Sheet open={bookmarksOpen} onOpenChange={setBookmarksOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader className="text-left mb-4">
              <SheetTitle>Your Bookmarks</SheetTitle>
            </SheetHeader>
            <BookmarksPanel 
              bookmarks={bookmarks}
              onSelectBookmark={(surah, ayah) => {
                setSurahNumber(surah);
                setJumpToAyah(ayah);
                setActiveTab("read");
                setBookmarksOpen(false);
              }}
              onRemoveBookmark={removeBookmark}
              onClose={() => setBookmarksOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}
      
      {/* Tafsir dialog */}
      <Dialog 
        open={!!selectedAyahForTafsir} 
        onOpenChange={(open) => !open && setSelectedAyahForTafsir(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>Tafsir</DialogTitle>
          {selectedAyahForTafsir && (
            <QuranTafsir 
              surahNumber={selectedAyahForTafsir.surah} 
              ayahNumber={selectedAyahForTafsir.ayah} 
              tafsirSource={TAFSIRS.find(t => t.id === selectedTafsir)?.name || "Tafsir"} 
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default QuranModule;
