
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Heart, Star, Coffee } from 'lucide-react';

const TipDeveloperModule = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-islamic-green flex items-center">
          <Gift className="mr-2" /> Support the Developer
        </h1>
        
        <div className="bg-islamic-light-green/10 p-4 rounded-lg mb-8 flex items-center">
          <Heart className="text-red-500 mr-3 flex-shrink-0" />
          <p>Your support helps us continue to develop and improve this app for the Muslim community worldwide.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-islamic-blue/20 hover:shadow-md transition-shadow">
            <CardHeader className="bg-islamic-blue/10 border-b">
              <CardTitle className="flex items-center">
                <Coffee className="mr-2 text-islamic-blue" /> Buy me a coffee
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Support the development with a small donation equivalent to a cup of coffee.</p>
              <button className="w-full bg-islamic-blue hover:bg-islamic-blue/80 text-white py-2 rounded-lg transition-colors">
                Donate $5
              </button>
            </CardContent>
          </Card>

          <Card className="border-islamic-green/20 hover:shadow-md transition-shadow">
            <CardHeader className="bg-islamic-green/10 border-b">
              <CardTitle className="flex items-center">
                <Star className="mr-2 text-islamic-green" /> Rate the App
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Leave a positive review on the app store to help others discover this app.</p>
              <button className="w-full bg-islamic-green hover:bg-islamic-green/80 text-white py-2 rounded-lg transition-colors">
                Rate & Review
              </button>
            </CardContent>
          </Card>

          <Card className="border-islamic-gold/20 hover:shadow-md transition-shadow col-span-full">
            <CardHeader className="bg-islamic-gold/10 border-b">
              <CardTitle className="flex items-center">
                <Heart className="mr-2 text-islamic-gold" /> Become a Monthly Supporter
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Support the ongoing development with a monthly contribution. Unlock premium features and be the first to receive updates.</p>
              <div className="grid grid-cols-3 gap-4">
                <button className="bg-islamic-gold/80 hover:bg-islamic-gold text-white py-2 rounded-lg transition-colors">
                  $5/month
                </button>
                <button className="bg-islamic-gold hover:bg-islamic-gold text-white py-2 rounded-lg transition-colors">
                  $10/month
                </button>
                <button className="bg-islamic-gold/80 hover:bg-islamic-gold text-white py-2 rounded-lg transition-colors">
                  Custom
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>All donations are processed securely. Thank you for your support!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TipDeveloperModule;
