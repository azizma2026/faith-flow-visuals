
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Heart, Play, Pause, Search } from "lucide-react";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Temporary mock data for Duas
const mockDuasData = [
  {
    id: "1",
    category: "morning",
    name: "Morning Dua",
    arabicText: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَـهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    translation: "We have reached the morning and the kingdom belongs to Allah, praise is to Allah. None has the right to be worshipped except Allah, alone, without partner.",
    reference: "Abu Dawud 4/317",
    audioUrl: "https://example.com/audio/morning1.mp3"
  },
  {
    id: "2",
    category: "evening",
    name: "Evening Dua",
    arabicText: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    translation: "We have reached the evening and the kingdom belongs to Allah, praise is to Allah. None has the right to be worshipped except Allah, alone, without partner.",
    reference: "Abu Dawud 4/317",
    audioUrl: "https://example.com/audio/evening1.mp3"
  },
  {
    id: "3",
    category: "food",
    name: "Before Eating",
    arabicText: "بِسْمِ اللهِ",
    transliteration: "Bismillah",
    translation: "In the name of Allah",
    reference: "At-Tirmidhi 5/506",
    audioUrl: "https://example.com/audio/food1.mp3"
  },
  {
    id: "4",
    category: "travel",
    name: "When Beginning a Journey",
    arabicText: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    transliteration: "Allahu Akbar, Allahu Akbar, Allahu Akbar, Subhana-alladhee sakhkhara lana hadha wama kunna lahu muqrineen",
    translation: "Allah is the Greatest, Allah is the Greatest, Allah is the Greatest. Glory is to Him Who has provided this for us though we could never have had it by our efforts.",
    reference: "Abu Dawud 3/34",
    audioUrl: "https://example.com/audio/travel1.mp3"
  },
  {
    id: "5",
    category: "sleep",
    name: "Before Sleeping",
    arabicText: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amootu wa ahya",
    translation: "In Your Name, O Allah, I die and I live.",
    reference: "Al-Bukhari 11/126",
    audioUrl: "https://example.com/audio/sleep1.mp3"
  },
  {
    id: "6",
    category: "morning",
    name: "Protection Dua",
    arabicText: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatil-lahit-tamati min sharri ma khalaq",
    translation: "I seek refuge in the Perfect Words of Allah from the evil of what He has created.",
    reference: "Muslim 4/2080",
    audioUrl: "https://example.com/audio/morning2.mp3"
  }
];

interface DuaCardProps {
  dua: typeof mockDuasData[0];
  toggleFavorite: (id: string) => void;
  favorites: string[];
  playAudio: (audioUrl: string, id: string) => void;
  isPlaying: boolean;
  currentlyPlayingId: string | null;
}

const DuaCard: React.FC<DuaCardProps> = ({ 
  dua, 
  toggleFavorite, 
  favorites, 
  playAudio,
  isPlaying,
  currentlyPlayingId
}) => {
  const isFavorite = favorites.includes(dua.id);
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{dua.name}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto"
            onClick={() => toggleFavorite(dua.id)}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-islamic-gold text-islamic-gold' : 'text-gray-400'}`} 
            />
          </Button>
        </div>
        <Badge className="mb-3 bg-islamic-light-green text-white">{dua.category}</Badge>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-3 text-right">
          <p className="font-arabic text-lg">{dua.arabicText}</p>
        </div>
        
        <div className="mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-2">{dua.transliteration}</p>
          <p>{dua.translation}</p>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">Source: {dua.reference}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          className="text-islamic-green"
          onClick={() => playAudio(dua.audioUrl, dua.id)}
        >
          {isPlaying && currentlyPlayingId === dua.id ? (
            <><Pause className="h-4 w-4 mr-2" /> Pause</>
          ) : (
            <><Play className="h-4 w-4 mr-2" /> Listen</>
          )}
        </Button>
        
        <Button variant="ghost" size="sm" className="text-gray-500">
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

const DuasModule: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [audio] = useState(new Audio());
  
  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };
  
  // Play audio
  const playAudio = (audioUrl: string, id: string) => {
    if (isPlaying && currentlyPlayingId === id) {
      // Pause the current audio
      audio.pause();
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    } else {
      // Play new audio
      audio.src = audioUrl;
      audio.play().catch(e => console.error("Error playing audio:", e));
      setIsPlaying(true);
      setCurrentlyPlayingId(id);
    }
  };
  
  // Filter duas based on active category and search term
  const filteredDuas = mockDuasData.filter(dua => {
    const matchesCategory = activeCategory === "all" || dua.category === activeCategory;
    const matchesSearch = dua.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         dua.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dua.transliteration.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Filter favorites
  const favoriteDuas = mockDuasData.filter(dua => favorites.includes(dua.id));

  // Handle audio end
  React.useEffect(() => {
    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    };
    
    audio.addEventListener('ended', handleAudioEnd);
    
    // Cleanup
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [audio]);

  return (
    <motion.div 
      className="p-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-islamic-blue rounded-xl p-3 mr-4">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Supplications</h1>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search duas..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>All</TabsTrigger>
          <TabsTrigger value="favorites" onClick={() => setActiveCategory("favorites")}>Favorites</TabsTrigger>
          <TabsTrigger value="morning" onClick={() => setActiveCategory("morning")}>Morning</TabsTrigger>
          <TabsTrigger value="evening" onClick={() => setActiveCategory("evening")}>Evening</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-4 gap-1 mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            className={`${activeCategory === "food" ? "bg-muted" : ""}`}
            onClick={() => setActiveCategory("food")}
          >
            Food
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={`${activeCategory === "travel" ? "bg-muted" : ""}`}
            onClick={() => setActiveCategory("travel")}
          >
            Travel
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={`${activeCategory === "sleep" ? "bg-muted" : ""}`}
            onClick={() => setActiveCategory("sleep")}
          >
            Sleep
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={`${activeCategory === "other" ? "bg-muted" : ""}`}
            onClick={() => setActiveCategory("other")}
          >
            Other
          </Button>
        </div>
        
        <TabsContent value="all">
          <ScrollArea className="h-[60vh]">
            {filteredDuas.length > 0 ? (
              filteredDuas.map(dua => (
                <DuaCard 
                  key={dua.id} 
                  dua={dua} 
                  toggleFavorite={toggleFavorite} 
                  favorites={favorites}
                  playAudio={playAudio}
                  isPlaying={isPlaying}
                  currentlyPlayingId={currentlyPlayingId}
                />
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">No duas found matching your search.</p>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="favorites">
          <ScrollArea className="h-[60vh]">
            {favoriteDuas.length > 0 ? (
              favoriteDuas.map(dua => (
                <DuaCard 
                  key={dua.id} 
                  dua={dua} 
                  toggleFavorite={toggleFavorite} 
                  favorites={favorites}
                  playAudio={playAudio}
                  isPlaying={isPlaying}
                  currentlyPlayingId={currentlyPlayingId}
                />
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">No favorite duas yet.</p>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="morning">
          <ScrollArea className="h-[60vh]">
            {filteredDuas.filter(dua => dua.category === "morning").length > 0 ? (
              filteredDuas.filter(dua => dua.category === "morning").map(dua => (
                <DuaCard 
                  key={dua.id} 
                  dua={dua} 
                  toggleFavorite={toggleFavorite} 
                  favorites={favorites}
                  playAudio={playAudio}
                  isPlaying={isPlaying}
                  currentlyPlayingId={currentlyPlayingId}
                />
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">No morning duas found.</p>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="evening">
          <ScrollArea className="h-[60vh]">
            {filteredDuas.filter(dua => dua.category === "evening").length > 0 ? (
              filteredDuas.filter(dua => dua.category === "evening").map(dua => (
                <DuaCard 
                  key={dua.id} 
                  dua={dua} 
                  toggleFavorite={toggleFavorite} 
                  favorites={favorites}
                  playAudio={playAudio}
                  isPlaying={isPlaying}
                  currentlyPlayingId={currentlyPlayingId}
                />
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">No evening duas found.</p>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DuasModule;
