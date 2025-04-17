
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';

const IslamicThemesModule = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-islamic-green flex items-center">
          <Palette className="mr-2" /> Islamic Themes
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Customize your app with beautiful Islamic themes.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-islamic-green to-islamic-light-green border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-white">Green Serenity</CardTitle>
              <CardDescription className="text-white/80">Traditional Islamic theme</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">A calm and serene theme featuring the traditional Islamic green.</p>
              <button className="mt-4 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors">
                Apply Theme
              </button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-islamic-gold to-yellow-500 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-white">Golden Mosque</CardTitle>
              <CardDescription className="text-white/80">Elegant gold accents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">An elegant theme inspired by the golden domes of mosques.</p>
              <button className="mt-4 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors">
                Apply Theme
              </button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-islamic-blue to-blue-400 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-white">Ocean Blue</CardTitle>
              <CardDescription className="text-white/80">Cool and calming</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">A calming blue theme inspired by the waters of paradise.</p>
              <button className="mt-4 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors">
                Apply Theme
              </button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-400 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-white">Royal Purple</CardTitle>
              <CardDescription className="text-white/80">Premium theme (Locked)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">A premium theme with royal purple accents.</p>
              <button className="mt-4 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Unlock Premium
              </button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default IslamicThemesModule;
