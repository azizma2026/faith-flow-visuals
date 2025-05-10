
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Refresh, Plus, Save, Volume2 } from "lucide-react";

// Pre-defined Tasbeeh phrases
const TASBEEH_PHRASES = [
  {
    arabic: "سُبْحَانَ اللهِ",
    transliteration: "Subhan Allah",
    translation: "Glory be to Allah",
    recommended: 33,
  },
  {
    arabic: "الْحَمْدُ للهِ",
    transliteration: "Alhamdulillah",
    translation: "Praise be to Allah",
    recommended: 33,
  },
  {
    arabic: "اللهُ أَكْبَر",
    transliteration: "Allahu Akbar",
    translation: "Allah is the Greatest",
    recommended: 34,
  },
  {
    arabic: "لَا إِلَٰهَ إِلَّا اللهُ",
    transliteration: "La ilaha illallah",
    translation: "There is no god but Allah",
    recommended: 100,
  },
  {
    arabic: "أَسْتَغْفِرُ اللهَ",
    transliteration: "Astaghfirullah",
    translation: "I seek forgiveness from Allah",
    recommended: 100,
  },
  {
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
    transliteration: "La hawla wala quwwata illa billah",
    translation: "There is no might nor power except with Allah",
    recommended: 100,
  },
];

// Sound effect for counter
const playCountSound = () => {
  const audio = new Audio("/tasbeeh-click.mp3");
  audio.volume = 0.5;
  audio.play().catch(e => console.log("Audio play failed:", e));
};

// Sound effect for completion
const playCompletionSound = () => {
  const audio = new Audio("/tasbeeh-complete.mp3");
  audio.volume = 0.7;
  audio.play().catch(e => console.log("Audio play failed:", e));
};

const TasbeehModule: React.FC = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [savedCounts, setSavedCounts] = useState<{ phrase: string; count: number }[]>([]);
  const [selectedTasbeeh, setSelectedTasbeeh] = useState(0);
  const [vibration, setVibration] = useState(true);
  const [sound, setSound] = useState(true);
  const { toast } = useToast();

  // Effect to check if target is reached
  useEffect(() => {
    if (count === target) {
      if (sound) playCompletionSound();
      toast({
        title: "Tasbeeh Complete",
        description: `You have completed ${target} counts of ${TASBEEH_PHRASES[selectedTasbeeh].transliteration}`,
        style: {
          background: "#F8F4EA", 
          border: "1px solid #D5C7A9",
          color: "#564F47"
        },
      });
    }
  }, [count, target, selectedTasbeeh, sound, toast]);

  const handleIncrement = () => {
    setCount(prevCount => {
      const newCount = prevCount + 1;
      if (sound && newCount <= target) playCountSound();
      if (vibration && "vibrate" in navigator) {
        navigator.vibrate(20);
      }
      return newCount;
    });
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleSave = () => {
    const newSavedCount = {
      phrase: TASBEEH_PHRASES[selectedTasbeeh].transliteration,
      count,
    };
    setSavedCounts(prev => [...prev, newSavedCount]);
    toast({
      title: "Saved",
      description: `Saved ${count} counts of ${TASBEEH_PHRASES[selectedTasbeeh].transliteration}`,
      style: {
        background: "#F8F4EA", 
        border: "1px solid #D5C7A9",
        color: "#564F47"
      },
    });
  };

  const handleTasbeehChange = (value: string) => {
    const index = parseInt(value);
    setSelectedTasbeeh(index);
    setTarget(TASBEEH_PHRASES[index].recommended);
    setCount(0);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-islamic-light-beige bg-islamic-pattern">
      <div className="max-w-md w-full space-y-6">
        <Card className="p-6 rounded-xl border-islamic-warm-beige bg-white/90 shadow-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-islamic-green to-islamic-gold"></div>
          
          <h1 className="text-2xl font-semibold text-islamic-text-brown text-center mb-6">
            Digital Tasbeeh
          </h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-islamic-text-brown mb-1">
              Select Dhikr
            </label>
            <Select 
              onValueChange={handleTasbeehChange} 
              defaultValue="0"
            >
              <SelectTrigger className="w-full border-islamic-warm-beige">
                <SelectValue placeholder="Select a tasbeeh" />
              </SelectTrigger>
              <SelectContent>
                {TASBEEH_PHRASES.map((phrase, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {phrase.transliteration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-center mb-8 py-4">
            <h2 className="text-4xl font-arabic mb-2 text-islamic-text-brown">
              {TASBEEH_PHRASES[selectedTasbeeh].arabic}
            </h2>
            <p className="text-lg text-islamic-text-light-brown">
              {TASBEEH_PHRASES[selectedTasbeeh].transliteration}
            </p>
            <p className="text-sm text-islamic-text-light-brown">
              {TASBEEH_PHRASES[selectedTasbeeh].translation}
            </p>
          </div>
          
          <div className="relative mb-6">
            <div className="h-4 w-full bg-islamic-medium-beige rounded-full overflow-hidden">
              <div 
                className="h-full bg-islamic-gold transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, (count / target) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-islamic-text-light-brown">
              <span>0</span>
              <span>{target}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center bg-islamic-light-beige rounded-full p-2 w-40 justify-between">
              <Button 
                variant="outline"
                size="sm"
                className="rounded-full h-10 w-10 flex items-center justify-center border-islamic-warm-beige hover:bg-islamic-warm-beige"
                onClick={handleReset}
              >
                <Refresh className="h-5 w-5 text-islamic-text-brown" />
              </Button>
              
              <span className="text-2xl font-medium text-islamic-text-brown">
                {count}
              </span>
              
              <Button 
                variant="outline"
                size="sm"
                className="rounded-full h-10 w-10 flex items-center justify-center border-islamic-warm-beige hover:bg-islamic-warm-beige"
                onClick={handleSave}
              >
                <Save className="h-5 w-5 text-islamic-text-brown" />
              </Button>
            </div>
          </div>
          
          <motion.div 
            className="flex justify-center"
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              className="w-24 h-24 rounded-full bg-islamic-gold flex items-center justify-center shadow-lg hover:bg-islamic-gold/90 transition-colors border-4 border-white"
              onClick={handleIncrement}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="h-12 w-12 text-white" />
            </motion.button>
          </motion.div>
          
          <div className="flex justify-between items-center mt-8">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="vibration" 
                checked={vibration} 
                onChange={() => setVibration(!vibration)}
                className="rounded text-islamic-gold"
              />
              <label htmlFor="vibration" className="ml-2 text-sm text-islamic-text-light-brown">
                Vibration
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="sound" 
                checked={sound} 
                onChange={() => setSound(!sound)}
                className="rounded text-islamic-gold"
              />
              <label htmlFor="sound" className="ml-2 text-sm text-islamic-text-light-brown flex items-center">
                Sound
                <Volume2 className="h-4 w-4 ml-1 text-islamic-text-light-brown" />
              </label>
            </div>
          </div>
        </Card>
        
        {savedCounts.length > 0 && (
          <Card className="p-6 rounded-xl border-islamic-warm-beige bg-white/90 shadow-md">
            <h2 className="text-xl font-semibold text-islamic-text-brown mb-4">Saved Counts</h2>
            <div className="space-y-2">
              {savedCounts.map((saved, index) => (
                <div 
                  key={index} 
                  className="flex justify-between p-2 bg-islamic-light-beige rounded-lg border border-islamic-warm-beige"
                >
                  <span className="text-islamic-text-brown">{saved.phrase}</span>
                  <span className="font-medium text-islamic-text-brown">{saved.count}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TasbeehModule;
