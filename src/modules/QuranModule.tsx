
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Book, Type, Headphones, BookOpen, Download, Share2, Heart } from "lucide-react";
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

// Mock quran data - in a real app, this would come from an API or local storage
const MOCK_SURAH = {
  number: 1,
  name: "Al-Fatiha",
  englishName: "The Opening",
  englishNameTranslation: "The Opening",
  numberOfAyahs: 7,
  ayahs: [
    {
      number: 1,
      text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      tafsir: "This verse is known as the Basmalah. Muslims begin their actions with it seeking blessing and divine aid."
    },
    {
      number: 2,
      text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "All praise is due to Allah, Lord of the worlds.",
      tafsir: "Allah deserves all praise for His perfect attributes and actions. He is the Lord and Sustainer of all creation."
    },
    {
      number: 3,
      text: "الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "The Entirely Merciful, the Especially Merciful,",
      tafsir: "Allah is merciful to all creation in this world, and especially merciful to the believers in the Hereafter."
    },
    {
      number: 4,
      text: "مَالِكِ يَوْمِ الدِّينِ",
      translation: "Sovereign of the Day of Recompense.",
      tafsir: "Allah alone is the Master of the Day of Judgment when all will be judged according to their deeds."
    },
    {
      number: 5,
      text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      translation: "It is You we worship and You we ask for help.",
      tafsir: "This verse establishes the essence of Islam: worship and seeking help are exclusively directed to Allah alone."
    },
    {
      number: 6,
      text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      translation: "Guide us to the straight path -",
      tafsir: "This is the most important supplication: asking Allah for guidance to the right path in beliefs, speech, and actions."
    },
    {
      number: 7,
      text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      translation: "The path of those upon whom You have bestowed favor, not of those who have earned Your anger or of those who are astray.",
      tafsir: "The straight path is that followed by the prophets, truthful ones, martyrs, and righteous. It is not the path of those who earned Allah's anger or who went astray."
    }
  ]
};

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
  { id: "en_sahih", name: "English - Sahih International" },
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
  const [selectedTranslation, setSelectedTranslation] = useState("en_sahih");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  
  const { toast } = useToast();

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
      description: `Surah ${MOCK_SURAH.number}, Ayah ${ayahNumber} has been saved to your bookmarks`,
    });
  };

  const handleShare = (ayahNumber: number) => {
    const ayah = MOCK_SURAH.ayahs[ayahNumber - 1];
    navigator.clipboard.writeText(`${ayah.text}\n\n${ayah.translation}\n\nSurah ${MOCK_SURAH.englishName}, Ayah ${ayahNumber}`);
    
    toast({
      title: "Ayah copied to clipboard",
      description: "You can now share it with others",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading Surah",
      description: "Surah Al-Fatiha will be available offline shortly.",
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
          <p className="text-sm text-gray-500">Surah {MOCK_SURAH.number}: {MOCK_SURAH.englishName}</p>
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
                            {translation.name}
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
          <div className="space-y-6">
            {MOCK_SURAH.ayahs.map((ayah) => (
              <Card key={ayah.number} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-islamic-gold/20 text-islamic-gold font-medium rounded-full w-8 h-8 flex items-center justify-center">
                      {ayah.number}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handlePlay(ayah.number)}
                        className={currentlyPlaying === ayah.number ? "text-islamic-green" : ""}
                      >
                        <Headphones className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleBookmark(ayah.number)}
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleShare(ayah.number)}
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
                    </>
                  )}
                  
                  {showTafsir && (
                    <>
                      <Separator className="my-3" />
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                        <h4 className="text-sm font-medium mb-1 flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" /> Tafsir
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{ayah.tafsir}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default QuranModule;
