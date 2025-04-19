
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface NameOfAllah {
  id: number;
  arabic: string;
  transliteration: string;
  english: string;
  meaning: string;
  isFavorite?: boolean;
}

// Sample data for 99 names of Allah
const namesOfAllah: NameOfAllah[] = [
  {
    id: 1,
    arabic: "الرحمن",
    transliteration: "Ar-Rahman",
    english: "The Most Compassionate",
    meaning: "The Most Gracious, The Most Merciful in this world and the Hereafter"
  },
  {
    id: 2,
    arabic: "الرحيم",
    transliteration: "Ar-Raheem",
    english: "The Most Merciful",
    meaning: "The Most Merciful, The one who has plenty of mercy for the believers"
  },
  {
    id: 3,
    arabic: "الملك",
    transliteration: "Al-Malik",
    english: "The King",
    meaning: "The King, The Sovereign Lord, The One with complete Dominion"
  },
  {
    id: 4,
    arabic: "القدوس",
    transliteration: "Al-Quddus",
    english: "The Most Holy",
    meaning: "The Most Holy, The One who is pure from any imperfection"
  },
  {
    id: 5,
    arabic: "السلام",
    transliteration: "As-Salam",
    english: "The Source of Peace",
    meaning: "The Source of Peace, The One who is free from every imperfection"
  },
  // Add more names as needed
];

const NamesOfAllahModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteNames, setFavoriteNames] = useState<number[]>([]);

  const filteredNames = namesOfAllah.filter(name => 
    name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (id: number) => {
    setFavoriteNames(prev => 
      prev.includes(id) 
        ? prev.filter(nameId => nameId !== id)
        : [...prev, id]
    );
  };

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
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredNames.map(name => (
          <motion.div 
            key={name.id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1 arabic-font text-right">
                      {name.arabic}
                    </h3>
                    <h4 className="font-semibold">{name.transliteration}</h4>
                    <p className="text-islamic-gold">{name.english}</p>
                    <p className="text-sm text-muted-foreground mt-2">{name.meaning}</p>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-islamic-gold"
                    onClick={() => toggleFavorite(name.id)}
                  >
                    <Heart 
                      className={`h-5 w-5 ${favoriteNames.includes(name.id) ? "fill-islamic-gold text-islamic-gold" : ""}`} 
                    />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredNames.length === 0 && (
        <div className="text-center py-8">
          <p>No results found for "{searchTerm}"</p>
        </div>
      )}
    </motion.div>
  );
};

export default NamesOfAllahModule;
