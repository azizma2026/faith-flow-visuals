
import React, { useState } from "react";
import { Search, Book, Bookmark, Share2, Copy, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Sample hadith data
const hadithCollections = [
  { 
    id: "bukhari", 
    name: "Sahih al-Bukhari", 
    description: "Compiled by Imam Muhammad al-Bukhari, considered the most authentic collection of hadith",
    hadiths: 7563,
    books: 97,
  },
  { 
    id: "muslim", 
    name: "Sahih Muslim", 
    description: "Compiled by Muslim ibn al-Hajjaj, considered the second most authentic hadith collection",
    hadiths: 7500,
    books: 54,
  },
  { 
    id: "nasai", 
    name: "Sunan an-Nasa'i", 
    description: "Compiled by Imam an-Nasa'i, one of the six major hadith collections",
    hadiths: 5761,
    books: 51,
  },
  { 
    id: "abudawud", 
    name: "Sunan Abu Dawood", 
    description: "Compiled by Abu Dawood, one of the six major hadith collections",
    hadiths: 5274,
    books: 35,
  },
  { 
    id: "tirmidhi", 
    name: "Jami at-Tirmidhi", 
    description: "Compiled by Imam at-Tirmidhi, one of the six major hadith collections",
    hadiths: 3956,
    books: 49,
  },
  { 
    id: "ibnmajah", 
    name: "Sunan Ibn Majah", 
    description: "Compiled by Ibn Majah, one of the six major hadith collections",
    hadiths: 4341,
    books: 37,
  },
  { 
    id: "malik", 
    name: "Muwatta Malik", 
    description: "Compiled by Imam Malik ibn Anas, the oldest collection of hadith",
    hadiths: 1720,
    books: 61,
  }
];

// Sample hadiths for demo
const sampleHadiths = [
  {
    id: "bukhari_1",
    collection: "bukhari",
    book: "Book of Revelation",
    bookNumber: 1,
    chapter: "How the revelation began",
    chapterNumber: 1,
    number: 1,
    grade: "Sahih",
    arabic: "حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ قَالَ حَدَّثَنَا سُفْيَانُ قَالَ حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ قَالَ أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ يَقُولُ سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ قَالَ سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
    english: "Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger (ﷺ) saying, \"The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for.\"",
    reference: "Sahih al-Bukhari 1",
    topics: ["intentions", "deeds", "rewards", "emigration"]
  },
  {
    id: "muslim_1",
    collection: "muslim",
    book: "Book of Faith",
    bookNumber: 1,
    chapter: "Saying of the Prophet: Islam is built on five pillars",
    chapterNumber: 5,
    number: 16,
    grade: "Sahih",
    arabic: "حَدَّثَنَا عُبَيْدُ اللَّهِ بْنُ مُعَاذٍ الْعَنْبَرِيُّ، حَدَّثَنَا أَبِي، حَدَّثَنَا شُعْبَةُ، عَنْ وَاصِلٍ الأَحْدَبِ، عَنْ الْمَعْرُورِ بْنِ سُوَيْدٍ، قَالَ رَأَيْتُ أَبَا ذَرٍّ الْغِفَارِيَّ رضى الله عنه وَعَلَيْهِ حُلَّةٌ وَعَلَى غُلاَمِهِ حُلَّةٌ فَسَأَلْنَاهُ عَنْ ذَلِكَ فَذَكَرَ أَنَّهُ سَابَّ رَجُلاً فَعَيَّرَهُ بِأُمِّهِ فَقَالَ النَّبِيُّ صلى الله عليه وسلم ‏\"‏ يَا أَبَا ذَرٍّ أَعَيَّرْتَهُ بِأُمِّهِ إِنَّكَ امْرُؤٌ فِيكَ جَاهِلِيَّةٌ إِخْوَانُكُمْ خَوَلُكُمْ جَعَلَهُمُ اللَّهُ تَحْتَ أَيْدِيكُمْ فَمَنْ كَانَ أَخُوهُ تَحْتَ يَدِهِ فَلْيُطْعِمْهُ مِمَّا يَأْكُلُ وَلْيُلْبِسْهُ مِمَّا يَلْبَسُ وَلاَ تُكَلِّفُوهُمْ مَا يَغْلِبُهُمْ فَإِنْ كَلَّفْتُمُوهُمْ فَأَعِينُوهُمْ‏",
    english: "Ma'rur b. Suwaid said: I saw Abu Dharr wearing a cloak, and his slave too was wearing a cloak. I asked him about it, and he narrated that he had abused a person during the lifetime of Allah's Messenger (ﷺ) and he reproached him for his mother. That person came to Allah's Apostle (ﷺ) and made mention of that to him. Thereupon Allah's Messenger (ﷺ) said: You are a person who has remnants of the Days of Ignorance in you. Your servants are your brothers. Allah has placed them under your authority. He who has his brother under him, should feed him from what he eats, and clothe him with what he wears, and do not burden them beyond their capacity, and if you burden them, then help them.",
    reference: "Sahih Muslim 1661a",
    topics: ["brotherhood", "servants", "kindness", "equality"]
  },
  {
    id: "tirmidhi_1",
    collection: "tirmidhi",
    book: "Chapters on Purification",
    bookNumber: 1,
    chapter: "What Has Been Related About The Virtue Of Wudu",
    chapterNumber: 1,
    number: 1,
    grade: "Sahih",
    arabic: "حَدَّثَنَا قُتَيْبَةُ، قَالَ حَدَّثَنَا اللَّيْثُ، عَنْ يَزِيدَ بْنِ أَبِي حَبِيبٍ، عَنْ عَمْرِو بْنِ الْحَارِثِ، عَنْ قَتَادَةَ بْنِ دِعَامَةَ، عَنْ أَبِي أَيُّوبَ، عَنْ عُقْبَةَ بْنِ عَامِرٍ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم \" مَا مِنْ مُسْلِمٍ يَتَوَضَّأُ فَيُحْسِنُ وُضُوءَهُ ثُمَّ يَقُومُ فَيُصَلِّي رَكْعَتَيْنِ مُقْبِلٌ عَلَيْهِمَا بِقَلْبِهِ وَوَجْهِهِ إِلاَّ وَجَبَتْ لَهُ الْجَنَّةُ \" ‏.‏ قَالَ عُثْمَانُ مَا أَجْوَدَ هَذَا ‏.",
    english: "Narrated 'Uqbah bin 'Amir: that the Messenger of Allah (ﷺ) said: \"Whoever performs Wudu' and does it well, then he stands and prays two Rak'ah, devoting his heart and his face in them, then Paradise is obligatory for him.\" 'Uthman said: \"How good is this.\"",
    reference: "Jami` at-Tirmidhi 1",
    topics: ["wudu", "prayer", "paradise"]
  },
];

// More sample hadiths for different categories
const hadithsByTopics = {
  "prayer": [
    {
      id: "bukhari_prayer_1",
      collection: "bukhari",
      book: "Book of Prayer",
      number: 372,
      grade: "Sahih",
      english: "Narrated Abu Huraira: Allah's Messenger (ﷺ) said, \"The reward of the prayer offered by a person in congregation is twenty-five times greater than that of the prayer offered in one's house or in the market. And this is because if he performs ablution and does it perfectly and then proceeds to the mosque, with the sole intention of praying, then for every step he takes towards the mosque, he is upgraded one degree in reward and one of his sins is taken off from his accounts. When he offers his prayer, the angels keep on asking Allah's Blessings and Allah's forgiveness for him as long as he is (staying) at his Musalla. They say, 'O Allah! Bestow Your blessings upon him, be Merciful and kind to him.' And one is regarded in prayer as long as one is waiting for the prayer.\"",
      reference: "Sahih al-Bukhari 647"
    },
    {
      id: "muslim_prayer_1",
      collection: "muslim",
      book: "Book of Prayer",
      number: 433,
      grade: "Sahih",
      english: "Abu Huraira reported: The Messenger of Allah (ﷺ) said: A man's prayer in congregation exceeds the reward of his prayer in his house or in his place of business by twenty-seven degrees.",
      reference: "Sahih Muslim 649a"
    }
  ],
  "fasting": [
    {
      id: "bukhari_fasting_1",
      collection: "bukhari",
      book: "Book of Fasting",
      number: 1894,
      grade: "Sahih",
      english: "Narrated Abu Huraira: Allah's Messenger (ﷺ) said, \"Whoever does not give up false statements (i.e. telling lies), and evil deeds, and speaking bad words to others, Allah is not in need of his (fasting) leaving his food and drink.\"",
      reference: "Sahih al-Bukhari 1903"
    },
    {
      id: "muslim_fasting_1",
      collection: "muslim",
      book: "Book of Fasting",
      number: 1151,
      grade: "Sahih",
      english: "Abu Huraira reported Allah's Messenger (ﷺ) as saying: If one does not abandon falsehood and false conduct, Allah has no need that he should abandon his food and drink.",
      reference: "Sahih Muslim 1151a"
    }
  ],
  "charity": [
    {
      id: "bukhari_charity_1",
      collection: "bukhari",
      book: "Book of Zakat",
      number: 1410,
      grade: "Sahih",
      english: "Narrated Abu Huraira: Allah's Messenger (ﷺ) said, \"If one gives in charity what equals one date-fruit from the honestly-earned money and Allah accepts only the honestly earned money, Allah takes it in His right (hand) and then enlarges its reward for that person (who has given it), as anyone of you brings up his baby horse, so much so that it becomes as big as a mountain.\"",
      reference: "Sahih al-Bukhari 1410"
    }
  ],
  "kindness": [
    {
      id: "bukhari_kindness_1",
      collection: "bukhari",
      book: "Book of Good Manners",
      number: 6011,
      grade: "Sahih",
      english: "Narrated Jarir bin Abdullah: The Prophet (ﷺ) said, \"He who is not merciful to others, will not be treated mercifully.\"",
      reference: "Sahih al-Bukhari 6011"
    }
  ]
};

// Common topics for filter
const commonTopics = [
  "prayer", "fasting", "charity", "kindness", "patience", "intentions",
  "knowledge", "manners", "faith", "family", "paradise", "forgiveness"
];

const HadithSearchModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCollection, setActiveCollection] = useState("bukhari");
  const [activeTab, setActiveTab] = useState("collections");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showArabic, setShowArabic] = useState(true);
  const { toast } = useToast();
  
  // Filter hadiths based on search term
  const filteredHadiths = searchTerm
    ? sampleHadiths.filter(h => 
        h.english.toLowerCase().includes(searchTerm.toLowerCase()) || 
        h.reference.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : activeCollection 
      ? sampleHadiths.filter(h => h.collection === activeCollection)
      : sampleHadiths;

  // Get topic hadiths
  const topicHadiths = selectedTopic ? hadithsByTopics[selectedTopic as keyof typeof hadithsByTopics] || [] : [];
  
  const copyHadithToClipboard = (hadith: any) => {
    const textToCopy = `${hadith.english}\n\n${hadith.reference}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Hadith has been copied to clipboard",
        style: {
          background: "#F8F4EA", 
          border: "1px solid #D5C7A9",
          color: "#564F47"
        },
      });
    });
  };
  
  const shareHadith = (hadith: any) => {
    // Using Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: hadith.reference,
        text: `${hadith.english}\n\n${hadith.reference}`,
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error);
      });
    } else {
      copyHadithToClipboard(hadith);
    }
  };
  
  const bookmarkHadith = (hadith: any) => {
    toast({
      title: "Hadith bookmarked",
      description: `${hadith.reference} has been saved to your bookmarks`,
      style: {
        background: "#F8F4EA", 
        border: "1px solid #D5C7A9",
        color: "#564F47"
      },
    });
  };
  
  const toggleArabicEnglish = () => {
    setShowArabic(!showArabic);
  };

  return (
    <div className="min-h-screen bg-islamic-light-beige bg-islamic-pattern p-4">
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 rounded-xl border-islamic-warm-beige bg-white/90 shadow-md overflow-hidden mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Book className="h-6 w-6 text-islamic-gold" />
            <h2 className="text-2xl font-semibold text-islamic-text-brown">Hadith Collection</h2>
          </div>
          
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-islamic-text-light-brown" />
            <Input
              placeholder="Search hadith by text, reference, or topic..."
              className="pl-10 py-6 border-islamic-warm-beige bg-islamic-light-beige/50 text-islamic-text-brown"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Navigation tabs */}
          <Tabs defaultValue="collections" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-islamic-light-beige">
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            </TabsList>
            
            {/* Collections tab */}
            <TabsContent value="collections" className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {hadithCollections.map((collection) => (
                  <Button
                    key={collection.id}
                    variant="outline"
                    className={`h-auto py-2 px-3 flex flex-col items-center justify-center text-center border-islamic-warm-beige ${activeCollection === collection.id ? 'bg-islamic-light-beige border-2 border-islamic-gold' : ''}`}
                    onClick={() => {
                      setActiveCollection(collection.id);
                      setSearchTerm("");
                    }}
                  >
                    <span className="font-medium text-islamic-text-brown">{collection.name}</span>
                    <span className="text-xs text-islamic-text-light-brown mt-1">
                      {collection.hadiths.toLocaleString()} hadiths
                    </span>
                  </Button>
                ))}
              </div>
              
              {/* Collection description */}
              {activeCollection && (
                <div className="mb-6 p-4 bg-islamic-light-beige rounded-lg border border-islamic-warm-beige">
                  <h3 className="text-lg font-medium text-islamic-text-brown mb-2">
                    {hadithCollections.find(c => c.id === activeCollection)?.name}
                  </h3>
                  <p className="text-islamic-text-light-brown">
                    {hadithCollections.find(c => c.id === activeCollection)?.description}
                  </p>
                </div>
              )}
            </TabsContent>
            
            {/* Topics tab */}
            <TabsContent value="topics" className="py-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-islamic-text-brown mb-3">Browse by Topic</h3>
                <div className="flex flex-wrap gap-2">
                  {commonTopics.map((topic) => (
                    <Badge
                      key={topic}
                      className={`cursor-pointer py-1 px-3 ${selectedTopic === topic ? 'bg-islamic-gold text-white' : 'bg-islamic-light-beige text-islamic-text-brown border border-islamic-warm-beige hover:bg-islamic-warm-beige/50'}`}
                      onClick={() => setSelectedTopic(topic === selectedTopic ? null : topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedTopic && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-islamic-text-brown mb-3 capitalize">
                    Hadiths about {selectedTopic}
                  </h3>
                  
                  {topicHadiths.length > 0 ? (
                    <div className="space-y-4">
                      {topicHadiths.map((hadith) => (
                        <Card
                          key={hadith.id}
                          className="p-4 border-islamic-warm-beige"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <Badge className="bg-islamic-green text-white">
                              {hadith.collection.charAt(0).toUpperCase() + hadith.collection.slice(1)}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-islamic-text-light-brown hover:text-islamic-gold"
                                onClick={() => bookmarkHadith(hadith)}
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-islamic-text-light-brown hover:text-islamic-gold"
                                onClick={() => copyHadithToClipboard(hadith)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-islamic-text-light-brown hover:text-islamic-gold"
                                onClick={() => shareHadith(hadith)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-islamic-text-brown mb-3">
                            {hadith.english}
                          </p>
                          
                          <div className="text-sm text-islamic-text-light-brown">
                            {hadith.reference}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-islamic-text-light-brown">
                      No hadiths found for this topic.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Bookmarks tab */}
            <TabsContent value="bookmarks" className="py-4">
              <div className="text-center py-10">
                <Book className="h-10 w-10 mx-auto text-islamic-text-light-brown mb-3" />
                <h3 className="text-lg font-medium text-islamic-text-brown mb-2">No Bookmarks Yet</h3>
                <p className="text-islamic-text-light-brown mb-4">
                  Bookmark hadiths to save them for later reading
                </p>
                <Button
                  variant="outline"
                  className="border-islamic-warm-beige text-islamic-text-brown"
                  onClick={() => setActiveTab('collections')}
                >
                  Browse Collections
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Results */}
          {(activeTab === "collections" || searchTerm) && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-islamic-text-brown">
                  {searchTerm ? "Search Results" : "Featured Hadiths"}
                </h3>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-islamic-text-light-brown hover:text-islamic-gold"
                  onClick={toggleArabicEnglish}
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  {showArabic ? "Show English Only" : "Show Arabic"}
                </Button>
              </div>
              
              {filteredHadiths.length > 0 ? (
                <div className="space-y-6">
                  {filteredHadiths.map((hadith) => (
                    <Accordion 
                      type="single" 
                      collapsible
                      key={hadith.id}
                      className="border border-islamic-warm-beige rounded-lg overflow-hidden"
                    >
                      <AccordionItem value={hadith.id} className="border-none">
                        <AccordionTrigger className="px-4 py-3 hover:bg-islamic-light-beige/50">
                          <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-islamic-green text-white">
                                {hadith.collection.charAt(0).toUpperCase() + hadith.collection.slice(1)}
                              </Badge>
                              <span className="text-sm text-islamic-text-light-brown">
                                {hadith.reference}
                              </span>
                            </div>
                            <div className="text-left mt-1 line-clamp-2 text-islamic-text-brown">
                              {hadith.english.substring(0, 100)}...
                            </div>
                          </div>
                        </AccordionTrigger>
                        
                        <AccordionContent className="px-4 pb-4">
                          {showArabic && (
                            <div className="mb-4 p-3 bg-islamic-light-beige rounded-lg">
                              <p className="text-right font-arabic text-xl leading-loose text-islamic-text-brown" dir="rtl">
                                {hadith.arabic}
                              </p>
                            </div>
                          )}
                          
                          <p className="text-islamic-text-brown mb-4">
                            {hadith.english}
                          </p>
                          
                          <div className="flex justify-between items-center border-t border-islamic-warm-beige pt-4">
                            <div className="flex items-center">
                              <Badge 
                                variant="outline" 
                                className="mr-2 border-islamic-warm-beige text-islamic-text-light-brown"
                              >
                                {hadith.grade}
                              </Badge>
                              <span className="text-sm text-islamic-text-light-brown">
                                {hadith.book}
                              </span>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-islamic-text-light-brown hover:text-islamic-gold"
                                onClick={() => bookmarkHadith(hadith)}
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-islamic-text-light-brown hover:text-islamic-gold"
                                onClick={() => copyHadithToClipboard(hadith)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-islamic-text-light-brown hover:text-islamic-gold"
                                onClick={() => shareHadith(hadith)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-islamic-text-light-brown">
                  No hadiths found matching your search.
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HadithSearchModule;
