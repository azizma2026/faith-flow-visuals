
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, BookOpen, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

const DailyVerse = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  
  // Sample verse data - in a real app this would come from an API
  const dailyVerse = {
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
    reference: "Surah Al-Baqarah [2:186]",
    backgroundImage: "url('https://images.unsplash.com/photo-1564769625657-43524181b9db?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80')"
  };
  
  const handleShare = () => {
    toast({
      title: "Sharing verse",
      description: "The verse has been copied to your clipboard.",
    });
    
    // In a real app, you'd implement actual sharing functionality
    navigator.clipboard.writeText(`${dailyVerse.arabic}\n\n${dailyVerse.translation}\n\n${dailyVerse.reference}`);
  };
  
  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "The verse image is being downloaded.",
    });
    
    // In a real app, you'd implement actual download functionality
  };
  
  const handleLike = () => {
    setLiked(!liked);
    
    if (!liked) {
      toast({
        title: "Added to favorites",
        description: "This verse has been added to your favorites.",
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
            Daily Verse
          </h1>
        </div>

        <div className="mb-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <div 
              className="relative h-[480px] flex items-center justify-center p-6" 
              style={{
                backgroundImage: dailyVerse.backgroundImage,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              
              <div className="relative z-10 text-center text-white">
                <p className="text-2xl font-bold mb-6" style={{ fontFamily: 'Amiri, serif' }}>
                  {dailyVerse.arabic}
                </p>
                
                <p className="text-lg mb-4">
                  {dailyVerse.translation}
                </p>
                
                <p className="text-sm font-medium text-islamic-gold">
                  {dailyVerse.reference}
                </p>
              </div>
            </div>
            
            <CardContent className="pt-4 pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <button 
                    className="flex items-center gap-2 mr-4" 
                    onClick={handleLike}
                  >
                    <Heart 
                      className={`h-5 w-5 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} 
                    />
                    <span className={`${liked ? 'text-red-500' : 'text-gray-500'}`}>
                      Like
                    </span>
                  </button>
                  
                  <button 
                    className="flex items-center gap-2 text-gray-500" 
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
                
                <div className="flex items-center">
                  <button 
                    className="flex items-center gap-2 mr-4 text-gray-500" 
                    onClick={handleDownload}
                  >
                    <Download className="h-5 w-5" />
                    <span>Save</span>
                  </button>
                  
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 text-islamic-green"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Read More</span>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <h2 className="text-xl font-bold text-islamic-dark-navy dark:text-white">
            Verse of the Day
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            A new verse each day to inspire and guide
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyVerse;
