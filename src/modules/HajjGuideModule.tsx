
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Map, 
  Clock, 
  FileText, 
  Check, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  User,
  Luggage
} from "lucide-react";

// Hajj steps data
const hajjSteps = [
  {
    day: "Day 1 (8th Dhul-Hijjah)",
    name: "Entering Ihram",
    description: "Enter the state of Ihram from Miqat. Men wear two white sheets, and women wear regular modest clothes. Make the intention for Hajj and recite the Talbiyah.",
    tips: [
      "Take a shower before wearing Ihram",
      "Men should not cover their heads",
      "Women should not cover their faces",
      "Avoid perfumes, cutting nails/hair"
    ],
    duas: ["Labbayk Allahumma Labbayk (Here I am, O Allah, here I am)"]
  },
  {
    day: "Day 1 (8th Dhul-Hijjah)",
    name: "Stay in Mina",
    description: "Travel to Mina and stay there until Fajr. Pray Dhuhr, Asr, Maghrib, and Isha at Mina.",
    tips: [
      "Bring essential items for overnight stay",
      "Continue reciting Talbiyah frequently",
      "Rest well for the next day"
    ],
    duas: []
  },
  {
    day: "Day 2 (9th Dhul-Hijjah)",
    name: "Standing at Arafat",
    description: "Travel to Arafat after Fajr. Stand and make dua at Arafat from Dhuhr until Maghrib. This is the most important part of Hajj.",
    tips: [
      "Stay in the shade if possible",
      "Drink plenty of water",
      "Make as much dua as possible",
      "Recite Quran and seek forgiveness"
    ],
    duas: ["There is no god but Allah alone with no partner. To Him belongs the dominion, to Him belongs all praise, and He is over all things powerful."]
  },
  {
    day: "Day 2 (9th Dhul-Hijjah)",
    name: "Muzdalifah",
    description: "After sunset, travel to Muzdalifah. Pray Maghrib and Isha together. Collect small pebbles for stoning. Stay overnight until Fajr or leave after midnight.",
    tips: [
      "Collect 49-70 pebbles for the stoning ritual",
      "Rest as much as possible"
    ],
    duas: []
  },
  {
    day: "Day 3 (10th Dhul-Hijjah)",
    name: "Stoning of Jamarat",
    description: "Stone the large Jamrah (pillar) with 7 pebbles. Recite 'Allahu Akbar' with each throw.",
    tips: [
      "Aim at the base of the pillar",
      "Be careful of crowds",
      "Choose a less crowded time if possible"
    ],
    duas: ["Allahu Akbar (with each throw)"]
  },
  {
    day: "Day 3 (10th Dhul-Hijjah)",
    name: "Animal Sacrifice",
    description: "Sacrifice an animal or purchase a sacrifice voucher.",
    tips: [
      "Authorized agents can perform the sacrifice for you",
      "Vouchers are widely available and convenient"
    ],
    duas: ["Bismillah, Allahu Akbar"]
  },
  {
    day: "Day 3 (10th Dhul-Hijjah)",
    name: "Shaving/Trimming Hair",
    description: "Men should shave or trim their hair. Women trim a fingertip length of hair.",
    tips: [
      "Shaving the entire head is better for men",
      "Women only cut a small portion of their hair"
    ],
    duas: []
  },
  {
    day: "Day 3 (10th Dhul-Hijjah)",
    name: "Tawaf al-Ifadah",
    description: "Go to Mecca and perform Tawaf (7 circuits around the Kaaba).",
    tips: [
      "This Tawaf is an essential pillar of Hajj",
      "Try to kiss or touch the Black Stone if possible without harming others",
      "Otherwise, point to it from a distance"
    ],
    duas: ["Subhan Allah, Alhamdulillah, Allahu Akbar"]
  },
  {
    day: "Day 3 (10th Dhul-Hijjah)",
    name: "Sa'i",
    description: "Perform Sa'i between Safa and Marwah (7 times).",
    tips: [
      "Start at Safa and end at Marwah",
      "Make dua at Safa and Marwah each time"
    ],
    duas: ["Indeed, Safa and Marwah are from the symbols of Allah..."]
  },
  {
    day: "Days 4-6 (11th-13th Dhul-Hijjah)",
    name: "Days of Tashreeq in Mina",
    description: "Stay in Mina and stone all three Jamarat each day after Dhuhr.",
    tips: [
      "Stone in order: small, medium, then large Jamarat",
      "You can leave after the 12th if you want"
    ],
    duas: ["Allahu Akbar (with each throw)"]
  },
  {
    day: "Final Step",
    name: "Farewell Tawaf",
    description: "Before leaving Mecca, perform a farewell Tawaf around the Kaaba.",
    tips: [
      "This should be your last act in Mecca",
      "Make final duas for yourself and loved ones"
    ],
    duas: ["O Allah, make this an accepted Hajj, a forgiven sin, and a rewarded effort."]
  }
];

// Hajj checklist
const hajjChecklist = [
  {
    category: "Documents",
    items: [
      { name: "Passport (valid for at least 6 months)", essential: true },
      { name: "Hajj visa", essential: true },
      { name: "Flight tickets", essential: true },
      { name: "ID cards (original and copies)", essential: true },
      { name: "Travel insurance documents", essential: true },
      { name: "Emergency contact information", essential: true },
      { name: "Hotel booking confirmations", essential: true },
      { name: "Passport photos (4-6 extra)", essential: false }
    ]
  },
  {
    category: "Clothing",
    items: [
      { name: "Ihram garments (for men, 2 sets)", essential: true },
      { name: "Modest clothing (for women)", essential: true },
      { name: "Belt for Ihram (with secret pocket)", essential: true },
      { name: "Comfortable walking shoes", essential: true },
      { name: "Prayer clothes/prayer dress", essential: true },
      { name: "Undergarments (5-7 sets)", essential: true },
      { name: "Light jacket/sweater (for air-conditioned areas)", essential: false },
      { name: "Socks", essential: false },
      { name: "Sleeping clothes", essential: false }
    ]
  },
  {
    category: "Toiletries",
    items: [
      { name: "Unscented soap/shower gel", essential: true },
      { name: "Unscented shampoo", essential: true },
      { name: "Toothbrush and toothpaste", essential: true },
      { name: "Sunscreen (unscented)", essential: true },
      { name: "Prescription medications", essential: true },
      { name: "First aid kit", essential: true },
      { name: "Hand sanitizer (unscented)", essential: true },
      { name: "Wet wipes/tissues", essential: true },
      { name: "Towel/microfiber towel", essential: true },
      { name: "Nail clippers", essential: false },
      { name: "Pain relievers", essential: false },
      { name: "Insect repellent (unscented)", essential: false }
    ]
  },
  {
    category: "Hajj Essentials",
    items: [
      { name: "Hajj guide book", essential: true },
      { name: "Prayer mat", essential: true },
      { name: "Dua book", essential: true },
      { name: "Pocket Quran/Quran app", essential: true },
      { name: "Tasbeeh (prayer beads)", essential: false },
      { name: "Money belt", essential: true },
      { name: "Waist pouch", essential: true },
      { name: "Umbrella for sun protection", essential: true },
      { name: "Water spray bottle", essential: true },
      { name: "ID card holder/lanyard", essential: true }
    ]
  },
  {
    category: "Electronics",
    items: [
      { name: "Smartphone with Hajj apps", essential: true },
      { name: "Power bank", essential: true },
      { name: "Universal adapter", essential: true },
      { name: "Chargers for devices", essential: true },
      { name: "SIM card/international plan", essential: false },
      { name: "Small flashlight", essential: false },
      { name: "Camera", essential: false }
    ]
  },
  {
    category: "Miscellaneous",
    items: [
      { name: "Snacks for long waits", essential: false },
      { name: "Small backpack for daily use", essential: true },
      { name: "Resealable plastic bags", essential: false },
      { name: "Safety pins", essential: false },
      { name: "Small scissors (not in carry-on)", essential: false },
      { name: "Small amount of cash (SAR and your currency)", essential: true },
      { name: "Credit/debit card", essential: true },
      { name: "Small Arabic phrasebook", essential: false }
    ]
  }
];

const HajjGuideModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState("steps");
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const { toast } = useToast();
  
  const toggleItem = (itemName: string) => {
    if (completedItems.includes(itemName)) {
      setCompletedItems(completedItems.filter(item => item !== itemName));
    } else {
      setCompletedItems([...completedItems, itemName]);
      toast({
        title: "Item checked",
        description: `"${itemName}" added to your completed items.`,
      });
    }
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // Calculate Hajj checklist progress
  const essentialItems = hajjChecklist.flatMap(cat => cat.items.filter(item => item.essential)).length;
  const completedEssentials = hajjChecklist.flatMap(cat => 
    cat.items.filter(item => item.essential && completedItems.includes(item.name))
  ).length;
  const progress = (completedEssentials / essentialItems) * 100;

  return (
    <motion.div 
      className="p-4 max-w-4xl mx-auto pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-islamic-green rounded-xl p-3 mr-4">
          <Map className="h-8 w-8 text-white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold">Hajj Guide</h1>
          <p className="text-sm text-gray-500">
            Complete guidance for your sacred journey
          </p>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="steps">
            <FileText className="h-4 w-4 mr-2" /> Hajj Steps
          </TabsTrigger>
          <TabsTrigger value="checklist">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Checklist
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="steps">
          <ScrollArea className="h-[calc(100vh-240px)]">
            <motion.div 
              variants={containerAnimation}
              initial="hidden"
              animate="show"
              className="space-y-4 pr-4"
            >
              {hajjSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  variants={itemAnimation}
                >
                  <Card className="overflow-hidden">
                    <div className="h-2 bg-islamic-green" />
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-islamic-light-beige text-islamic-text-brown text-xs px-2 py-1 rounded-full">
                          {step.day}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2">{step.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                      
                      {step.tips.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-sm mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1 text-islamic-gold" /> Tips
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {step.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-muted-foreground">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {step.duas.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Du'as</h4>
                          {step.duas.map((dua, duaIndex) => (
                            <div 
                              key={duaIndex}
                              className="bg-islamic-light-beige/50 p-3 rounded-md text-sm text-islamic-text-brown"
                            >
                              {dua}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="checklist">
          <div className="mb-6">
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-sm font-medium">Essential Items Progress</h3>
              <span className="text-sm">{completedEssentials}/{essentialItems}</span>
            </div>
            <div className="h-2 w-full bg-islamic-light-beige rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-islamic-green"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-280px)]">
            <motion.div 
              variants={containerAnimation}
              initial="hidden"
              animate="show"
              className="space-y-6 pr-4"
            >
              {hajjChecklist.map((category, categoryIndex) => (
                <motion.div 
                  key={categoryIndex}
                  variants={itemAnimation}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        {categoryIndex === 0 ? (
                          <FileText className="h-5 w-5 mr-2 text-islamic-green" />
                        ) : categoryIndex === 1 ? (
                          <User className="h-5 w-5 mr-2 text-islamic-green" />
                        ) : categoryIndex === 2 ? (
                          <FileText className="h-5 w-5 mr-2 text-islamic-green" />
                        ) : categoryIndex === 3 ? (
                          <Clock className="h-5 w-5 mr-2 text-islamic-green" />
                        ) : categoryIndex === 4 ? (
                          <FileText className="h-5 w-5 mr-2 text-islamic-green" />
                        ) : (
                          <Luggage className="h-5 w-5 mr-2 text-islamic-green" />
                        )}
                        <h3 className="text-lg font-semibold">{category.category}</h3>
                      </div>
                      
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div 
                            key={itemIndex}
                            className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                              completedItems.includes(item.name) 
                                ? 'bg-islamic-green/10' 
                                : 'hover:bg-accent/10'
                            }`}
                          >
                            <div className="flex items-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 mr-2"
                                onClick={() => toggleItem(item.name)}
                              >
                                <div className={`h-5 w-5 rounded border flex items-center justify-center ${
                                  completedItems.includes(item.name) 
                                    ? 'bg-islamic-green border-islamic-green text-white' 
                                    : 'border-input'
                                }`}>
                                  {completedItems.includes(item.name) && (
                                    <Check className="h-3 w-3" />
                                  )}
                                </div>
                              </Button>
                              
                              <span className={`text-sm ${
                                completedItems.includes(item.name) ? 'line-through text-muted-foreground' : ''
                              }`}>
                                {item.name}
                              </span>
                            </div>
                            
                            {item.essential && (
                              <span className="bg-islamic-gold/20 text-islamic-gold text-xs px-2 py-0.5 rounded-full">
                                Essential
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default HajjGuideModule;
