
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Award, Book, BookOpen } from 'lucide-react';

const IslamicQuizModule = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-islamic-green flex items-center">
          <HelpCircle className="mr-2" /> Islamic Quiz
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Test your knowledge with interactive quizzes on various Islamic topics.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow border-islamic-green/20">
            <CardHeader className="bg-islamic-green/10 border-b">
              <CardTitle className="flex items-center">
                <Book className="mr-2 text-islamic-green" /> 
                Quran Knowledge
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Test your knowledge of the Holy Quran with questions about surahs, ayahs, and more.</p>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Award className="mr-1 h-4 w-4" /> 
                <span>Earn 50 points</span>
                <span className="mx-2">•</span>
                <span>15 questions</span>
              </div>
              <button className="w-full bg-islamic-green hover:bg-islamic-green/80 text-white py-2 rounded-lg transition-colors">
                Start Quiz
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-islamic-blue/20">
            <CardHeader className="bg-islamic-blue/10 border-b">
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 text-islamic-blue" /> 
                Hadith Comprehension
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Test your knowledge of Hadith with questions about narrations, narrators, and their meanings.</p>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Award className="mr-1 h-4 w-4" /> 
                <span>Earn 40 points</span>
                <span className="mx-2">•</span>
                <span>10 questions</span>
              </div>
              <button className="w-full bg-islamic-blue hover:bg-islamic-blue/80 text-white py-2 rounded-lg transition-colors">
                Start Quiz
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-islamic-light-green/20 col-span-full">
            <CardHeader className="bg-islamic-light-green/10 border-b">
              <CardTitle className="flex items-center">
                <Award className="mr-2 text-islamic-light-green" /> 
                Your Quiz Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-islamic-light-green/5">
                  <p className="text-2xl font-bold text-islamic-light-green">0</p>
                  <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                </div>
                <div className="p-4 rounded-lg bg-islamic-gold/5">
                  <p className="text-2xl font-bold text-islamic-gold">0</p>
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                </div>
                <div className="p-4 rounded-lg bg-islamic-blue/5">
                  <p className="text-2xl font-bold text-islamic-blue">0</p>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default IslamicQuizModule;
