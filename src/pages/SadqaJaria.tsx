
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Gift, Heart, Award, Share2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

const SadqaJaria = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  
  // Sample gift options
  const giftOptions = [
    { id: 1, name: "Single Quran", amount: 10, color: "bg-islamic-light-green" },
    { id: 2, name: "Family Pack", amount: 25, color: "bg-islamic-green" },
    { id: 3, name: "Masjid Collection", amount: 50, color: "bg-islamic-blue" },
    { id: 4, name: "Community Donation", amount: 100, color: "bg-islamic-gold" }
  ];
  
  const handleDonateClick = () => {
    if (selectedAmount) {
      toast({
        title: "Thank you for your Sadqa Jaria!",
        description: `Your donation of $${selectedAmount} has been received.`,
      });
    } else {
      toast({
        title: "Please select a donation amount",
        description: "Choose one of the gift options to proceed.",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-islamic-dark-navy"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir={currentLanguage.direction}
    >
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-islamic-dark-navy dark:text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-islamic-dark-navy dark:text-white">
            Sadqa Jaria
          </h1>
        </div>

        <Card className="mb-6 overflow-hidden border-none shadow-md">
          <CardHeader className="bg-islamic-gold text-white pb-2">
            <CardTitle className="text-xl">Gift a Quran</CardTitle>
            <CardDescription className="text-white/80">
              Support the spread of knowledge
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <p className="text-gray-600 dark:text-gray-300">
                "When a person dies, their deeds come to an end except for three: 
                ongoing charity, beneficial knowledge, or a righteous child who prays for them."
              </p>
              <p className="text-sm italic mt-2">- Sahih Muslim</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {giftOptions.map(option => (
                <div
                  key={option.id}
                  className={`${option.color} ${
                    selectedAmount === option.amount ? "ring-2 ring-islamic-gold" : ""
                  } rounded-lg p-4 text-white cursor-pointer transition-all hover:opacity-90`}
                  onClick={() => setSelectedAmount(option.amount)}
                >
                  <div className="flex justify-between items-start">
                    <Gift className="h-6 w-6" />
                    {selectedAmount === option.amount && (
                      <Check className="h-5 w-5" />
                    )}
                  </div>
                  <h3 className="font-bold mt-2">{option.name}</h3>
                  <p className="text-xl font-bold mt-1">${option.amount}</p>
                </div>
              ))}
            </div>
            
            <button
              className={`w-full mt-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all ${
                selectedAmount 
                  ? "bg-islamic-gold hover:bg-islamic-gold/90 text-white" 
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleDonateClick}
            >
              <Heart className="h-5 w-5 mr-2" />
              Donate ${selectedAmount || "..."}
            </button>
          </CardContent>
        </Card>
        
        <Card className="mb-6 overflow-hidden border-none shadow-md">
          <CardHeader className="bg-islamic-green text-white pb-2">
            <CardTitle className="text-xl">Impact Stats</CardTitle>
            <CardDescription className="text-white/80">
              Your contributions are making a difference
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="flex justify-center">
                  <Gift className="h-10 w-10 text-islamic-green mb-2" />
                </div>
                <p className="text-2xl font-bold">1,245</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Qurans Gifted</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center">
                  <Award className="h-10 w-10 text-islamic-blue mb-2" />
                </div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Countries Reached</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-islamic-light-green rounded-lg text-white">
                <Heart className="h-4 w-4" />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-islamic-light-blue rounded-lg text-white">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SadqaJaria;
