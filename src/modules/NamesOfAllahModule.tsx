
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Volume2, Info, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NameOfAllah {
  id: number;
  arabic: string;
  transliteration: string;
  english: string;
  meaning: string;
  benefits: string;
  category: string[];
  isFavorite?: boolean;
}

// Enhanced data for 99 names of Allah with categories and benefits
const namesOfAllah: NameOfAllah[] = [
  {
    id: 1,
    arabic: "الرحمن",
    transliteration: "Ar-Rahman",
    english: "The Most Compassionate",
    meaning: "The Most Gracious, The Most Merciful in this world and the Hereafter",
    benefits: "Reciting this name brings mercy and compassion into one's life. It helps soften the heart and develop empathy for others.",
    category: ["mercy", "primary"]
  },
  {
    id: 2,
    arabic: "الرحيم",
    transliteration: "Ar-Raheem",
    english: "The Most Merciful",
    meaning: "The Most Merciful, The one who has plenty of mercy for the believers",
    benefits: "This name brings divine mercy specifically for believers. Reciting it helps in receiving forgiveness and mercy from Allah.",
    category: ["mercy", "primary"]
  },
  {
    id: 3,
    arabic: "الملك",
    transliteration: "Al-Malik",
    english: "The King",
    meaning: "The King, The Sovereign Lord, The One with complete Dominion",
    benefits: "Invoking this name helps in matters of leadership, self-discipline, and management. It reminds us of Allah's supreme authority.",
    category: ["power", "primary"]
  },
  {
    id: 4,
    arabic: "القدوس",
    transliteration: "Al-Quddus",
    english: "The Most Holy",
    meaning: "The Most Holy, The One who is pure from any imperfection",
    benefits: "Remembering this name helps in purifying the heart and soul. It brings spiritual cleanliness and elevation.",
    category: ["purity"]
  },
  {
    id: 5,
    arabic: "السلام",
    transliteration: "As-Salam",
    english: "The Source of Peace",
    meaning: "The Source of Peace, The One who is free from every imperfection",
    benefits: "This name brings peace and tranquility. Reciting it helps in resolving conflicts and finding inner peace.",
    category: ["peace", "primary"]
  },
  {
    id: 6,
    arabic: "المؤمن",
    transliteration: "Al-Mu'min",
    english: "The Guardian of Faith",
    meaning: "The Guardian of Faith, The One who gives security",
    benefits: "Reciting this name strengthens faith and provides security from fears and anxieties.",
    category: ["protection"]
  },
  {
    id: 7,
    arabic: "المهيمن",
    transliteration: "Al-Muhaymin",
    english: "The Protector",
    meaning: "The Protector, The One who watches over and protects all things",
    benefits: "This name offers protection and watchful care. It helps when seeking Allah's guardianship over matters.",
    category: ["protection"]
  },
  // Add more names as needed
];

// Available categories for filtering
const categories = ["all", "primary", "mercy", "power", "protection", "peace", "purity"];

const NamesOfAllahModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteNames, setFavoriteNames] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
  const [selectedName, setSelectedName] = useState<NameOfAllah | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteAllahNames');
    if (savedFavorites) {
      setFavoriteNames(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem('favoriteAllahNames', JSON.stringify(favoriteNames));
  }, [favoriteNames]);

  const toggleFavorite = (id: number) => {
    setFavoriteNames(prev => 
      prev.includes(id) 
        ? prev.filter(nameId => nameId !== id)
        : [...prev, id]
    );

    toast({
      title: favoriteNames.includes(id) ? "Removed from favorites" : "Added to favorites",
      description: favoriteNames.includes(id) 
        ? "This name has been removed from your favorites."
        : "This name has been added to your favorites.",
    });
  };

  const playAudio = (name: string) => {
    // In a real implementation, this would play actual audio recordings
    // For now, we'll use browser's speech synthesis as a placeholder
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.lang = 'ar-SA'; // Arabic language
      window.speechSynthesis.speak(utterance);

      toast({
        title: "Playing audio",
        description: `Pronouncing: ${name}`,
      });
    } else {
      toast({
        title: "Audio not supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (category: string) => {
    if (category === 'all') {
      setSelectedFilters(['all']);
    } else {
      const newFilters = selectedFilters.includes('all') 
        ? [category] 
        : selectedFilters.includes(category)
          ? selectedFilters.filter(c => c !== category)
          : [...selectedFilters, category];
      
      setSelectedFilters(newFilters.length === 0 ? ['all'] : newFilters);
    }
  };

  // Apply filters
  const filteredNames = namesOfAllah.filter(name => {
    const matchesSearch = 
      name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.english.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'favorites' && favoriteNames.includes(name.id));
    
    const matchesFilter = 
      selectedFilters.includes('all') || 
      name.category.some(cat => selectedFilters.includes(cat));
    
    return matchesSearch && matchesTab && matchesFilter;
  });

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-islamic-green flex items-center">
        <span className="arabic-font mr-2">أسماء الله الحسنى</span> 
        99 Names of Allah
      </h1>
      
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Names</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedFilters.includes(category)}
                  onCheckedChange={() => handleFilterChange(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredNames.map(name => (
          <motion.div 
            key={name.id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="overflow-hidden h-full">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1 arabic-font text-right">
                      {name.arabic}
                    </h3>
                    <h4 className="font-semibold">{name.transliteration}</h4>
                    <p className="text-islamic-gold">{name.english}</p>
                  </div>
                  <div className="flex items-start gap-1">
                    <button 
                      className="text-gray-400 hover:text-islamic-green"
                      onClick={() => playAudio(name.transliteration)}
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-islamic-gold"
                      onClick={() => toggleFavorite(name.id)}
                    >
                      <Heart 
                        className={`h-5 w-5 ${favoriteNames.includes(name.id) ? "fill-islamic-gold text-islamic-gold" : ""}`} 
                      />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{name.meaning}</p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {name.category.map(cat => (
                    <Badge key={cat} variant="outline" className="capitalize">
                      {cat}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-auto pt-3 flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-islamic-green"
                        onClick={() => setSelectedName(name)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Learn More
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          <span>{name.transliteration} - {name.english}</span>
                          <span className="arabic-font text-xl">{name.arabic}</span>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-islamic-green mb-1">Meaning:</h4>
                          <p>{name.meaning}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-islamic-green mb-1">Benefits:</h4>
                          <p>{name.benefits}</p>
                        </div>
                        <div className="flex justify-between pt-2">
                          <Button variant="outline" onClick={() => playAudio(name.transliteration)}>
                            <Volume2 className="h-4 w-4 mr-2" />
                            Pronounce
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => toggleFavorite(name.id)}
                            className={favoriteNames.includes(name.id) ? "text-islamic-gold border-islamic-gold" : ""}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${favoriteNames.includes(name.id) ? "fill-islamic-gold" : ""}`} />
                            {favoriteNames.includes(name.id) ? "Favorited" : "Add to Favorites"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredNames.length === 0 && (
        <div className="text-center py-8">
          <p>No results found for "{searchTerm}"</p>
          {activeTab === 'favorites' && favoriteNames.length === 0 && (
            <p className="mt-2 text-muted-foreground">You haven't added any favorites yet.</p>
          )}
        </div>
      )}

      {/* Hidden audio element for playing sounds */}
      <audio ref={audioRef} className="hidden" />
    </motion.div>
  );
};

export default NamesOfAllahModule;
