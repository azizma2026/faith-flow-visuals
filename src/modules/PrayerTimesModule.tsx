
import React, { useState, useEffect } from "react";
import { Clock, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface PrayerTime {
  name: string;
  time: string;
  timestamp: number;
}

const PrayerTimesModule: React.FC = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        toast({
          title: "Location Error",
          description: "Could not get your location. Using default location.",
          variant: "destructive",
        });
        // Use default coordinates (Mecca)
        fetchPrayerTimes(21.4225, 39.8262);
      }
    );
  };

  const fetchPrayerTimes = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();
      
      const timings = data.data.timings;
      const prayerTimesData: PrayerTime[] = [
        { name: "Fajr", time: timings.Fajr, timestamp: getTimestamp(timings.Fajr) },
        { name: "Dhuhr", time: timings.Dhuhr, timestamp: getTimestamp(timings.Dhuhr) },
        { name: "Asr", time: timings.Asr, timestamp: getTimestamp(timings.Asr) },
        { name: "Maghrib", time: timings.Maghrib, timestamp: getTimestamp(timings.Maghrib) },
        { name: "Isha", time: timings.Isha, timestamp: getTimestamp(timings.Isha) }
      ];
      
      setPrayerTimes(prayerTimesData);
      setLoading(false);
      updateNextPrayer(prayerTimesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch prayer times. Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getTimestamp = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date.getTime();
  };

  const updateNextPrayer = (times: PrayerTime[]) => {
    const now = Date.now();
    const next = times.find(prayer => prayer.timestamp > now) || times[0];
    setNextPrayer(next);
  };

  useEffect(() => {
    if (!nextPrayer) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = nextPrayer.timestamp - now;

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);

      if (distance < 0) {
        updateNextPrayer(prayerTimes);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayer, prayerTimes]);

  const toggleAdhan = () => {
    if (isAdhanPlaying) {
      // Stop Adhan
      setIsAdhanPlaying(false);
    } else {
      // Play Adhan
      const adhan = new Audio('/adhan.mp3');
      adhan.play().catch(error => {
        toast({
          title: "Audio Error",
          description: "Could not play Adhan. Please check your device settings.",
          variant: "destructive",
        });
      });
      setIsAdhanPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-green"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-6 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-islamic-blue rounded-xl p-3 mr-4">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Prayer Times</h1>
        </div>
        <button
          onClick={toggleAdhan}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isAdhanPlaying ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="space-y-4">
        {prayerTimes.map((prayer) => (
          <motion.div
            key={prayer.name}
            className={`p-4 rounded-lg border ${
              nextPrayer?.name === prayer.name
                ? "bg-islamic-light-green border-islamic-green"
                : "bg-white dark:bg-gray-800"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{prayer.name}</span>
              <span>{prayer.time}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {nextPrayer && (
        <div className="mt-6 p-4 bg-islamic-green text-white rounded-lg">
          <h2 className="text-lg font-semibold">Next Prayer</h2>
          <p className="text-2xl font-bold">{nextPrayer.name}</p>
          <p className="text-sm">Time until: {countdown}</p>
        </div>
      )}
    </motion.div>
  );
};

export default PrayerTimesModule;
