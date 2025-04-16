
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PrayerTimerProps {
  className?: string;
}

interface PrayerTime {
  name: string;
  time: string;
  timestamp: number;
}

const PrayerTimer: React.FC<PrayerTimerProps> = ({ className }) => {
  // Mock prayer times - in a real app, these would come from an API based on location
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([
    { name: "Fajr", time: "05:12", timestamp: new Date().setHours(5, 12, 0, 0) },
    { name: "Dhuhr", time: "12:30", timestamp: new Date().setHours(12, 30, 0, 0) },
    { name: "Asr", time: "15:45", timestamp: new Date().setHours(15, 45, 0, 0) },
    { name: "Maghrib", time: "18:20", timestamp: new Date().setHours(18, 20, 0, 0) },
    { name: "Isha", time: "19:50", timestamp: new Date().setHours(19, 50, 0, 0) }
  ]);
  
  const [currentPrayer, setCurrentPrayer] = useState<PrayerTime | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState<string>("00:00:00");

  useEffect(() => {
    const calculateCurrentAndNextPrayer = () => {
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
  }, [prayerTimes]);
  
  if (!currentPrayer || !nextPrayer) {
    return <div>Loading prayer times...</div>;
  }

  return (
    <div className={cn("prayer-countdown p-4 text-center", className)}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">Current Prayer</p>
          <h3 className="text-xl font-bold">{currentPrayer.name} {currentPrayer.time}</h3>
        </div>
        <div className="pulse-animation">
          <p className="text-sm">Next Prayer</p>
          <h3 className="text-xl font-bold">{nextPrayer.name} {nextPrayer.time}</h3>
          <p className="text-xs mt-1">{nextPrayer.name} starts in <span className="font-bold">{countdown}</span></p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimer;
