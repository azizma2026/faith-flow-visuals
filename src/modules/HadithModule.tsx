
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, RefreshCw, Share2, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Hadith Data
const mockHadiths = [
  {
    id: "1",
    text: "The deeds are considered by the intentions, and a person will get the reward according to his intention.",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    narrator: "Umar ibn Al-Khattab",
    source: "Sahih Al-Bukhari 1",
    grade: "Sahih",
    chapter: "Revelation"
  },
  {
    id: "2",
    text: "None of you truly believes until he loves for his brother what he loves for himself.",
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    narrator: "Anas ibn Malik",
    source: "Sahih Al-Bukhari 13",
    grade: "Sahih",
    chapter: "Faith"
  },
  {
    id: "3",
    text: "Whoever believes in Allah and the Last Day should talk what is good or keep quiet.",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    narrator: "Abu Hurairah",
    source: "Sahih Al-Bukhari 6018",
    grade: "Sahih",
    chapter: "Good Manners"
  },
  {
    id: "4",
    text: "The best of you are those who are best to their families, and I am the best of you to my family.",
    arabic: "خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي",
    narrator: "Abdullah ibn Abbas",
    source: "Sunan Ibn Majah 1977",
    grade: "Hasan",
    chapter: "Marriage"
  },
  {
    id: "5",
    text: "Whoever relieves a believer's distress of the distressful aspects of this world, Allah will rescue him from a difficulty of the difficulties of the Hereafter.",
    arabic: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ",
    narrator: "Abu Hurairah",
    source: "Sahih Muslim 2699",
    grade: "Sahih",
    chapter: "Virtue"
  }
];

const HadithModule: React.FC = () => {
  const [currentHadith, setCurrentHadith] = useState<typeof mockHadiths[0] | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Get a random hadith
  const getRandomHadith = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockHadiths.length);
      setCurrentHadith(mockHadiths[randomIndex]);
      setLoading(false);
    }, 800);
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Share hadith
  const shareHadith = () => {
    if (currentHadith && navigator.share) {
      navigator.share({
        title: 'Hadith from ' + currentHadith.source,
        text: currentHadith.text + ' - ' + currentHadith.narrator + ' (' + currentHadith.source + ')',
      }).catch(err => console.error('Error sharing:', err));
    } else {
      console.log('Web Share API not supported');
    }
  };

  // Load a random hadith on first render
  useEffect(() => {
    getRandomHadith();
  }, []);

  return (
    <motion.div 
      className="p-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-islamic-light-blue rounded-xl p-3 mr-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Hadith</h1>
      </div>
      
      <Card className="shadow-lg mb-6">
        <CardContent className="pt-6">
          {loading ? (
            <>
              <Skeleton className="h-4 w-20 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-16 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </>
          ) : currentHadith && (
            <>
              <div className="flex justify-between items-start mb-2">
                <Badge className="bg-islamic-light-blue">{currentHadith.chapter}</Badge>
                <Badge className={currentHadith.grade === "Sahih" ? "bg-green-600" : "bg-amber-600"}>
                  {currentHadith.grade}
                </Badge>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4 text-right">
                <p className="font-arabic text-lg leading-relaxed">{currentHadith.arabic}</p>
              </div>
              
              <p className="mb-4 text-lg">{currentHadith.text}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                <p><span className="font-medium">Narrator:</span> {currentHadith.narrator}</p>
                <p>{currentHadith.source}</p>
              </div>
            </>
          )}
        </CardContent>
        
        {!loading && currentHadith && (
          <CardFooter className="flex justify-between pt-2 pb-4">
            <Button 
              variant="outline" 
              onClick={() => toggleFavorite(currentHadith.id)}
            >
              <Heart 
                className={`h-5 w-5 mr-2 ${
                  favorites.includes(currentHadith.id) ? "fill-islamic-gold text-islamic-gold" : ""
                }`} 
              />
              {favorites.includes(currentHadith.id) ? "Saved" : "Save"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={shareHadith}
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
            
            <Button 
              onClick={getRandomHadith}
              className="bg-islamic-light-blue hover:bg-islamic-blue text-white"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Next
            </Button>
          </CardFooter>
        )}
      </Card>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Hadiths are sourced from authentic collections including Sahih Bukhari, 
          Sahih Muslim, and other respected works.
        </p>
      </div>
    </motion.div>
  );
};

export default HadithModule;
