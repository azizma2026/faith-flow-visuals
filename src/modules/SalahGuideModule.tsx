
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, ChevronRight } from 'lucide-react';

const SalahGuideModule = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-islamic-green flex items-center">
          <Compass className="mr-2" /> 3D Salah Guide
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Learn the proper way to perform Salah with our interactive 3D guide.
        </p>

        <div className="bg-islamic-light-green/10 rounded-lg p-4 mb-8">
          <p className="text-islamic-dark-navy dark:text-white">
            This feature requires 3D capabilities. The full version includes animated models demonstrating each step of the prayer.
          </p>
        </div>

        <div className="grid gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Fajr Prayer</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">2 rakats - Learn the proper way to perform Fajr prayer</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Dhuhr Prayer</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">4 rakats - Learn the proper way to perform Dhuhr prayer</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Asr Prayer</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">4 rakats - Learn the proper way to perform Asr prayer</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Maghrib Prayer</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">3 rakats - Learn the proper way to perform Maghrib prayer</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Isha Prayer</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">4 rakats - Learn the proper way to perform Isha prayer</p>
            </CardContent>
          </Card>
        </div>

      </motion.div>
    </div>
  );
};

export default SalahGuideModule;
