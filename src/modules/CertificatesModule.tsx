
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Download } from 'lucide-react';

const CertificatesModule = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-islamic-green flex items-center">
          <Award className="mr-2" /> Islamic Certificates
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Generate beautiful certificates for your Islamic achievements.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-islamic-green/20">
            <CardHeader className="bg-islamic-green/10 border-b">
              <CardTitle>Quran Completion</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Generate a beautiful certificate for completing the recitation of the entire Quran.</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Available after completion</span>
                <button className="flex items-center bg-islamic-green hover:bg-islamic-green/80 text-white py-2 px-4 rounded-lg transition-colors">
                  <Download className="mr-2 h-4 w-4" /> Generate
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-islamic-blue/20">
            <CardHeader className="bg-islamic-blue/10 border-b">
              <CardTitle>Prayer Consistency</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Certificate for maintaining consistency in your five daily prayers for 30 days.</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">0/30 days completed</span>
                <button className="flex items-center bg-islamic-blue/50 text-white py-2 px-4 rounded-lg cursor-not-allowed opacity-70">
                  <Download className="mr-2 h-4 w-4" /> Generate
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-islamic-light-green/20">
            <CardHeader className="bg-islamic-light-green/10 border-b">
              <CardTitle>Hadith Study</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Certificate for studying and understanding 40 Hadiths.</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">0/40 hadiths studied</span>
                <button className="flex items-center bg-islamic-light-green/50 text-white py-2 px-4 rounded-lg cursor-not-allowed opacity-70">
                  <Download className="mr-2 h-4 w-4" /> Generate
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-islamic-gold/20">
            <CardHeader className="bg-islamic-gold/10 border-b">
              <CardTitle>Ramadan Completion</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Certificate for completing the fasting and worship during the month of Ramadan.</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Available during Ramadan</span>
                <button className="flex items-center bg-islamic-gold/50 text-white py-2 px-4 rounded-lg cursor-not-allowed opacity-70">
                  <Download className="mr-2 h-4 w-4" /> Generate
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificatesModule;
