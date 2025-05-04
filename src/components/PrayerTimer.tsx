
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PrayerTimerProps {
  className?: string;
}

interface PrayerTime {
  name: string;
  time: string;
  timestamp: number;
}

const PrayerTimer: React.FC<PrayerTimerProps> = ({ className }) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerTime | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  // Fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Using default location (Mecca). Enable location for accurate prayer times.",
            variant: "destructive",
          });
          // Default to Mecca coordinates
          setLocation({ lat: 21.4225, lng: 39.8262 });
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      // Default to Mecca coordinates
      setLocation({ lat: 21.4225, lng: 39.8262 });
    }
  }, [toast]);

  // Fetch prayer times once we have location
  useEffect(() => {
    if (!location) return;

    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${date}-${month}-${year}?latitude=${location.lat}&longitude=${location.lng}&method=2`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch prayer times");
        }

        const data = await response.json();
        const timings = data.data.timings;
        
        // Create prayer times array from API response
        const formattedPrayerTimes: PrayerTime[] = [
          { name: "Fajr", time: timings.Fajr, timestamp: getTimestamp(timings.Fajr) },
          { name: "Dhuhr", time: timings.Dhuhr, timestamp: getTimestamp(timings.Dhuhr) },
          { name: "Asr", time: timings.Asr, timestamp: getTimestamp(timings.Asr) },
          { name: "Maghrib", time: timings.Maghrib, timestamp: getTimestamp(timings.Maghrib) },
          { name: "Isha", time: timings.Isha, timestamp: getTimestamp(timings.Isha) }
        ];
        
        setPrayerTimes(formattedPrayerTimes);
        setLoading(false);
        setError(null);

        // Show success toast
        toast({
          title: "Prayer Times Updated",
          description: `Prayer times for your location have been updated.`,
        });
      } catch (err) {
        console.error("Error fetching prayer times:", err);
        setError("Failed to fetch prayer times. Please try again later.");
        setLoading(false);
        
        // Use mock data as fallback
        const mockPrayerTimes: PrayerTime[] = [
          { name: "Fajr", time: "05:12", timestamp: new Date().setHours(5, 12, 0, 0) },
          { name: "Dhuhr", time: "12:30", timestamp: new Date().setHours(12, 30, 0, 0) },
          { name: "Asr", time: "15:45", timestamp: new Date().setHours(15, 45, 0, 0) },
          { name: "Maghrib", time: "18:20", timestamp: new Date().setHours(18, 20, 0, 0) },
          { name: "Isha", time: "19:50", timestamp: new Date().setHours(19, 50, 0, 0) }
        ];
        setPrayerTimes(mockPrayerTimes);
        
        toast({
          title: "Error",
          description: "Using default prayer times. Please check your connection.",
          variant: "destructive",
        });
      }
    };

    fetchPrayerTimes();
  }, [location, toast]);

  // Helper function to convert time string to timestamp
  const getTimestamp = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.getTime();
  };

  useEffect(() => {
    const calculateCurrentAndNextPrayer = () => {
      if (prayerTimes.length === 0) return;
      
      const now = new Date().getTime();
      
      // Find current and next prayers
      let current = null;
      let next = null;
      
      for (let i = 0; i < prayerTimes.length; i++) {
        if (now < prayerTimes[i].timestamp) {
          next = prayerTimes[i];
          if (i > 0) {
            current = prayerTimes[i - 1];
          } else {
            // If no prayer has occurred today yet, set current to the last prayer from yesterday
            current = prayerTimes[prayerTimes.length - 1];
          }
          break;
        }
      }
      
      // If we've passed all prayers for today, next is tomorrow's first prayer
      if (!next) {
        next = prayerTimes[0];
        current = prayerTimes[prayerTimes.length - 1];
      }
      
      setCurrentPrayer(current);
      setNextPrayer(next);
    };

    calculateCurrentAndNextPrayer();
    
    // Update countdown every second
    const timer = setInterval(() => {
      calculateCurrentAndNextPrayer();
      
      if (nextPrayer) {
        const now = new Date().getTime();
        const distance = nextPrayer.timestamp - now;
        
        // Calculate hours, minutes, seconds
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Format countdown
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [prayerTimes, nextPrayer]);
  
  if (loading) {
    return (
      <div className={cn("prayer-countdown p-4 text-center flex justify-center items-center", className)}>
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading prayer times...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("prayer-countdown p-4 text-center text-red-500", className)}>
        <p>{error}</p>
      </div>
    );
  }

  if (!currentPrayer || !nextPrayer) {
    return (
      <div className={cn("prayer-countdown p-4 text-center", className)}>
        <p>Calculating prayer times...</p>
      </div>
    );
  }

  return (
    <div className={cn("prayer-countdown p-4 text-center rounded-lg bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm", className)}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">Current Prayer</p>
          <h3 className="text-xl font-bold">{currentPrayer.name} {currentPrayer.time}</h3>
        </div>
        <div className="pulse-animation text-center md:text-right">
          <p className="text-sm text-muted-foreground">Next Prayer</p>
          <h3 className="text-xl font-bold">{nextPrayer.name} {nextPrayer.time}</h3>
          <p className="text-xs mt-1">{nextPrayer.name} starts in <span className="font-bold">{countdown}</span></p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimer;
