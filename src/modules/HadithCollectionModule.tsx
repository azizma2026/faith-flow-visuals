
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Book, Search, Filter, BookOpen } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

// Types
interface Hadith {
  id: string;
  collection: string;
  bookNumber: number;
  chapterNumber: number;
  hadithNumber: number;
  arabic: string;
  english: string;
  grade: string;
  narrator: string;
  reference: string;
}

interface HadithCollection {
  name: string;
  englishName: string;
  hadiths: number;
  available: boolean;
}

// Mock data for collections
const hadithCollections: HadithCollection[] = [
  { name: "صحيح البخاري", englishName: "Sahih al-Bukhari", hadiths: 7563, available: true },
  { name: "صحيح مسلم", englishName: "Sahih Muslim", hadiths: 7563, available: true },
  { name: "سنن أبي داود", englishName: "Sunan Abi Dawood", hadiths: 5274, available: true },
  { name: "جامع الترمذي", englishName: "Jami at-Tirmidhi", hadiths: 3956, available: true },
  { name: "سنن النسائي", englishName: "Sunan an-Nasa'i", hadiths: 5761, available: false },
  { name: "سنن ابن ماجه", englishName: "Sunan Ibn Majah", hadiths: 4341, available: false }
];

// Mock hadiths data
const mockHadiths: Hadith[] = [
  {
    id: "bukhari1",
    collection: "Sahih al-Bukhari",
    bookNumber: 1,
    chapterNumber: 1,
    hadithNumber: 1,
    arabic: "حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ، قَالَ: حَدَّثَنَا سُفْيَانُ، قَالَ: حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ، قَالَ: أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ، أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ، يَقُولُ: سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ، قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، يَقُولُ: «إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ»",
    english: "The Messenger of Allah (ﷺ) said: \"Actions are only by intentions, and each person will only have what they intended. So whoever emigrated for Allah and His Messenger, then his emigration is for Allah and His Messenger. And whoever emigrated to get something of this world or to marry a woman, then his emigration is for that which he emigrated for.\"",
    grade: "Sahih",
    narrator: "Umar ibn Al-Khattab",
    reference: "Sahih al-Bukhari 1"
  },
  {
    id: "bukhari2",
    collection: "Sahih al-Bukhari",
    bookNumber: 1,
    chapterNumber: 1,
    hadithNumber: 2,
    arabic: "حَدَّثَنَا عَبْدُ اللَّهِ بْنُ يُوسُفَ، قَالَ: أَخْبَرَنَا مَالِكٌ، عَنْ هِشَامِ بْنِ عُرْوَةَ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ أُمِّ المُؤْمِنِينَ رَضِيَ اللَّهُ عَنْهَا، أَنَّهَا قَالَتْ: سَأَلَ الحَارِثُ بْنُ هِشَامٍ رَضِيَ اللَّهُ عَنْهُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، فَقَالَ: يَا رَسُولَ اللَّهِ، كَيْفَ يَأْتِيكَ الوَحْيُ؟ فَقَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «أَحْيَانًا يَأْتِينِي مِثْلَ صَلْصَلَةِ الجَرَسِ، وَهُوَ أَشَدُّهُ عَلَيَّ، فَيُفْصَمُ عَنِّي وَقَدْ وَعَيْتُ عَنْهُ مَا قَالَ، وَأَحْيَانًا يَتَمَثَّلُ لِي المَلَكُ رَجُلًا فَيُكَلِّمُنِي فَأَعِي مَا يَقُولُ»، قَالَتْ عَائِشَةُ رَضِيَ اللَّهُ عَنْهَا: «وَلَقَدْ رَأَيْتُهُ يَنْزِلُ عَلَيْهِ الوَحْيُ فِي اليَوْمِ الشَّدِيدِ البَرْدِ، فَيَفْصِمُ عَنْهُ وَإِنَّ جَبِينَهُ لَيَتَفَصَّدُ عَرَقًا»",
    english: "Aisha, the Mother of the Believers, reported: Al-Harith bin Hisham asked Allah's Messenger: \"O Allah's Messenger! How is the Divine Inspiration revealed to you?\" Allah's Messenger replied: \"Sometimes it is (revealed) like the ringing of a bell, this form of Inspiration is the hardest of all and then this state passes off after I have grasped what is inspired. Sometimes the Angel comes in the form of a man and talks to me and I grasp whatever he says.\" Aisha added: \"Verily I saw the Prophet being inspired divinely on a very cold day and noticed the sweat dripping from his forehead (as the Inspiration was over).\"",
    grade: "Sahih",
    narrator: "Aisha",
    reference: "Sahih al-Bukhari 2"
  },
  {
    id: "muslim1",
    collection: "Sahih Muslim",
    bookNumber: 1,
    chapterNumber: 1,
    hadithNumber: 1,
    arabic: "حَدَّثَنَا يَحْيَى بْنُ يَحْيَى التَّمِيمِيُّ، قَالَ: قَرَأْتُ عَلَى مَالِكٍ، عَنِ ابْنِ شِهَابٍ، عَنْ سَعِيدِ بْنِ الْمُسَيِّبِ، عَنْ أَبِي هُرَيْرَةَ: أَنَّ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «إِذَا اسْتَيْقَظَ أَحَدُكُمْ مِنْ نَوْمِهِ، فَلَا يَغْمِسْ يَدَهُ فِي الْإِنَاءِ، حَتَّى يَغْسِلَهَا ثَلَاثًا، فَإِنَّ أَحَدَكُمْ لَا يَدْرِي أَيْنَ بَاتَتْ يَدُهُ»",
    english: "Abu Huraira reported Allah's Messenger (ﷺ) as saying: When any one of you wakes up from sleep, he must not put his hand in the vessel till he has washed it three times, for he does not know where his hand was during the night.",
    grade: "Sahih",
    narrator: "Abu Huraira",
    reference: "Sahih Muslim 278"
  }
];

// Fetch hadiths from a collection
const fetchHadiths = async (collection: string): Promise<Hadith[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockHadiths.filter(h => h.collection === collection));
    }, 800);
  });
};

// Search hadiths
const searchHadiths = async (query: string): Promise<Hadith[]> => {
  // In a real app, this would search via API
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockHadiths.filter(h => 
        h.english.toLowerCase().includes(query.toLowerCase()) ||
        h.narrator.toLowerCase().includes(query.toLowerCase()) ||
        h.reference.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 500);
  });
};

// Hadith card component
const HadithCard: React.FC<{ hadith: Hadith }> = ({ hadith }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <Badge className="mb-2 bg-islamic-green/20 text-islamic-green">
            {hadith.reference}
          </Badge>
          <Badge variant="outline">{hadith.grade}</Badge>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm text-muted-foreground mb-1">Narrated by {hadith.narrator}</h3>
          <p className="text-base">{hadith.english}</p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-islamic-green w-full flex justify-center items-center"
        >
          {expanded ? "Hide Arabic" : "Show Arabic"}
        </Button>
        
        {expanded && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mt-3 text-right">
            <p className="font-arabic text-lg" dir="rtl">{hadith.arabic}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const HadithCollectionModule: React.FC = () => {
  const [activeCollection, setActiveCollection] = useState("Sahih al-Bukhari");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Fetch hadiths based on selected collection
  const { 
    data: hadiths, 
    isLoading: isLoadingHadiths 
  } = useQuery({
    queryKey: ['hadiths', activeCollection],
    queryFn: () => fetchHadiths(activeCollection),
    enabled: !isSearching,
  });
  
  // Search results query
  const { 
    data: searchResults, 
    isLoading: isLoadingSearch,
    refetch: refetchSearch
  } = useQuery({
    queryKey: ['hadith-search', searchQuery],
    queryFn: () => searchHadiths(searchQuery),
    enabled: false,
  });
  
  const handleSearch = () => {
    if (searchQuery.trim().length > 2) {
      setIsSearching(true);
      refetchSearch();
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };
  
  const handleTabChange = (value: string) => {
    setActiveCollection(value);
    setIsSearching(false);
  };
  
  return (
    <motion.div 
      className="p-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-islamic-green rounded-xl p-3 mr-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Hadith Collection</h1>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search hadiths..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={searchQuery.trim().length < 3}>
            Search
          </Button>
        </div>
        
        {isSearching && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">
              {isLoadingSearch
                ? "Searching..."
                : searchResults?.length 
                  ? `Found ${searchResults.length} results` 
                  : "No results found"}
            </p>
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
      
      {!isSearching ? (
        <Tabs defaultValue={activeCollection} onValueChange={handleTabChange}>
          <ScrollArea className="whitespace-nowrap mb-4">
            <TabsList className="inline-flex w-max">
              {hadithCollections.map(collection => (
                <TabsTrigger 
                  key={collection.englishName}
                  value={collection.englishName}
                  disabled={!collection.available}
                  className="flex-shrink-0"
                >
                  {collection.englishName}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          
          {hadithCollections.map(collection => (
            <TabsContent key={collection.englishName} value={collection.englishName}>
              <h3 className="font-medium text-lg mb-4">
                {collection.name} <span className="text-sm text-muted-foreground">({collection.englishName})</span>
              </h3>
              
              {isLoadingHadiths ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[60vh]">
                  {hadiths?.map(hadith => (
                    <HadithCard key={hadith.id} hadith={hadith} />
                  ))}
                </ScrollArea>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div>
          <h3 className="font-medium text-lg mb-4">Search Results</h3>
          
          {isLoadingSearch ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[60vh]">
              {searchResults && searchResults.length > 0 ? (
                searchResults.map(hadith => (
                  <HadithCard key={hadith.id} hadith={hadith} />
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">No hadiths found matching your search.</p>
              )}
            </ScrollArea>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default HadithCollectionModule;
