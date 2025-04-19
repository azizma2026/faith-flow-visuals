
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const QiblaModule: React.FC = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mecca coordinates
  const MECCA_LAT = 21.422487;
  const MECCA_LNG = 39.826206;

  // Calculate Qibla direction based on user's current position
  const calculateQiblaDirection = (userLat: number, userLng: number) => {
    // Convert to radians
    const userLatRad = (userLat * Math.PI) / 180;
    const userLngRad = (userLng * Math.PI) / 180;
    const meccaLatRad = (MECCA_LAT * Math.PI) / 180;
    const meccaLngRad = (MECCA_LNG * Math.PI) / 180;
    
    // Calculate Qibla direction using formula
    const y = Math.sin(meccaLngRad - userLngRad);
    const x = Math.cos(userLatRad) * Math.tan(meccaLatRad) - 
              Math.sin(userLatRad) * Math.cos(meccaLngRad - userLngRad);
    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    
    // Convert to a value between 0 and 360
    qibla = (qibla + 360) % 360;
    
    return qibla;
  };

  // Calculate distance to Mecca in kilometers
  const calculateDistance = (userLat: number, userLng: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((MECCA_LAT - userLat) * Math.PI) / 180;
    const dLng = ((MECCA_LNG - userLng) * Math.PI) / 180;
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLat * Math.PI) / 180) * 
      Math.cos((MECCA_LAT * Math.PI) / 180) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance);
  };

  // Handle compass data
  const handleCompassData = (event: DeviceOrientationEvent) => {
    // Check if alpha exists (compass direction)
    if (event.alpha !== null) {
      setHeading(event.alpha);
    }
  };

  // Request device orientation permission and initialize compass
  const requestCompassPermission = async () => {
    try {
      // Check if DeviceOrientationEvent is available
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // For iOS 13+ devices
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        
        if (permission === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleCompassData);
          getLocation();
        } else {
          setError('Permission to access device orientation was denied');
          toast({
            title: "Permission Denied",
            description: "We need compass access to show Qibla direction.",
            variant: "destructive",
          });
        }
      } else {
        // For non-iOS or older browsers that don't need permission
        setPermissionGranted(true);
        window.addEventListener('deviceorientation', handleCompassData);
        getLocation();
      }
    } catch (err) {
      console.error('Error requesting compass permission:', err);
      setError('Could not access compass. Please make sure your device has a compass and permissions are granted.');
      toast({
        title: "Compass Error",
        description: "Could not access your device's compass.",
        variant: "destructive",
      });
    }
  };

  // Get user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          const qibla = calculateQiblaDirection(userLat, userLng);
          const dist = calculateDistance(userLat, userLng);
          
          setQiblaDirection(qibla);
          setDistance(dist);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Could not access your location. Please enable location services.');
          toast({
            title: "Location Error",
            description: "Could not access your location. Please enable location services.",
            variant: "destructive",
          });
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  // Remove event listener on component unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleCompassData);
    };
  }, []);

  return (
    <motion.div 
      className="p-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-islamic-light-green rounded-xl p-3 mr-4">
          <Compass className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Qibla Finder</h1>
      </div>
      
      {!permissionGranted ? (
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <Compass className="h-16 w-16 text-islamic-green mb-4" />
              <h2 className="text-xl font-semibold mb-2">Find the Qibla Direction</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Allow access to your device compass and location to find the direction to the Kaaba.
              </p>
              <Button 
                onClick={requestCompassPermission}
                className="bg-islamic-green hover:bg-islamic-green/80 text-white"
              >
                <MapPin className="mr-2 h-4 w-4" /> Allow Access
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          {error ? (
            <Alert variant="destructive" className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-8 w-64 h-64">
                {/* Compass base */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                
                {/* Cardinal directions */}
                <div className="absolute inset-0">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold">N</div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold">E</div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold">S</div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold">W</div>
                </div>
                
                {/* Compass needle - rotates based on device orientation */}
                {heading !== null && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ 
                      rotate: -heading
                    }}
                  >
                    <div className="w-1 h-32 bg-gradient-to-t from-red-500 to-gray-200"></div>
                  </motion.div>
                )}
                
                {/* Qibla direction indicator */}
                {qiblaDirection !== null && heading !== null && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ 
                      rotate: qiblaDirection - heading
                    }}
                  >
                    <div className="w-2 h-32 bg-islamic-green flex items-start justify-center">
                      <div className="w-4 h-4 rounded-full bg-islamic-gold -mt-1"></div>
                    </div>
                  </motion.div>
                )}
                
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-islamic-gold"></div>
              </div>
              
              {distance && (
                <Card className="w-full mb-4">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Distance to Kaaba</h3>
                      <p className="text-3xl font-bold text-islamic-gold">{distance} km</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Alert className="bg-islamic-light-green/20 border-islamic-light-green">
                <Info className="h-4 w-4 text-islamic-green" />
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>
                  Hold your phone flat and point the top toward the green arrow for Qibla direction.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default QiblaModule;
