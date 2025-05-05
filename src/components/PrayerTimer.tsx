
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2, MapPin, Volume2, VolumeX, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PrayerTimerProps {
  className?: string;
}

interface PrayerTime {
  name: string;
  time: string;
  timestamp: number;
  adhanEnabled?: boolean;
}

interface CustomLocation {
  name: string;
  lat: number;
  lng: number;
}

const PrayerTimer: React.FC<PrayerTimerProps> = ({ className }) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerTime | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [customLocation, setCustomLocation] = useState<CustomLocation | null>(null);
  const [locationInput, setLocationInput] = useState({ name: "", lat: "", lng: "" });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [playingAdhan, setPlayingAdhan] = useState<number | null>(null);
  const [adhanAudio, setAdhanAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Check if browser supports notifications
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  // Request notification permissions
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications enabled",
          description: "You will receive prayer time notifications.",
        });
      } else {
        setNotificationsEnabled(false);
        toast({
          title: "Notifications disabled",
          description: "Prayer time notifications were not enabled.",
          variant: "destructive",
        });
      }
    }
  };

  // Load saved location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('prayerLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setCustomLocation(parsedLocation);
        setLocation({
          lat: parsedLocation.lat,
          lng: parsedLocation.lng,
          name: parsedLocation.name
        });
        toast({
          title: "Using saved location",
          description: `Using prayer times for ${parsedLocation.name}`,
        });
      } catch (e) {
        console.error("Error parsing saved location:", e);
        // Fallback to geolocation
        getUserLocation();
      }
    } else {
      // No saved location, use geolocation
      getUserLocation();
    }

    // Load saved prayer time settings
    const savedSettings = localStorage.getItem('prayerSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setNotificationsEnabled(settings.notifications || false);
      } catch (e) {
        console.error("Error parsing saved settings:", e);
      }
    }
  }, []);

  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);
          
          // Attempt to get location name using reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`)
            .then(res => res.json())
            .then(data => {
              const locationName = data.address?.city || data.address?.town || data.address?.village || 'Current Location';
              setLocation({...userLocation, name: locationName});
            })
            .catch(err => {
              console.error("Error getting location name:", err);
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
          setLocation({ lat: 21.4225, lng: 39.8262, name: "Mecca (Default)" });
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      // Default to Mecca coordinates
      setLocation({ lat: 21.4225, lng: 39.8262, name: "Mecca (Default)" });
    }
  };

  // Save custom location
  const saveCustomLocation = () => {
    if (!locationInput.name || !locationInput.lat || !locationInput.lng) {
      toast({
        title: "Invalid input",
        description: "Please fill all fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    const newLocation: CustomLocation = {
      name: locationInput.name,
      lat: parseFloat(locationInput.lat),
      lng: parseFloat(locationInput.lng)
    };

    if (isNaN(newLocation.lat) || isNaN(newLocation.lng)) {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid latitude and longitude values.",
        variant: "destructive",
      });
      return;
    }

    // Save to state and localStorage
    setCustomLocation(newLocation);
    setLocation({
      lat: newLocation.lat,
      lng: newLocation.lng,
      name: newLocation.name
    });
    localStorage.setItem('prayerLocation', JSON.stringify(newLocation));
    
    // Reset form
    setLocationInput({ name: "", lat: "", lng: "" });
    
    toast({
      title: "Location saved",
      description: `Prayer times will now be shown for ${newLocation.name}.`,
    });
  };

  // Save prayer settings
  const savePrayerSettings = () => {
    const settings = {
      notifications: notificationsEnabled
    };
    localStorage.setItem('prayerSettings', JSON.stringify(settings));
    
    toast({
      title: "Settings saved",
      description: "Your prayer time settings have been saved.",
    });
  };

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
          { name: "Fajr", time: timings.Fajr, timestamp: getTimestamp(timings.Fajr), adhanEnabled: true },
          { name: "Dhuhr", time: timings.Dhuhr, timestamp: getTimestamp(timings.Dhuhr), adhanEnabled: true },
          { name: "Asr", time: timings.Asr, timestamp: getTimestamp(timings.Asr), adhanEnabled: true },
          { name: "Maghrib", time: timings.Maghrib, timestamp: getTimestamp(timings.Maghrib), adhanEnabled: true },
          { name: "Isha", time: timings.Isha, timestamp: getTimestamp(timings.Isha), adhanEnabled: true }
        ];
        
        setPrayerTimes(formattedPrayerTimes);
        setLoading(false);
        setError(null);

        // Show success toast
        toast({
          title: "Prayer Times Updated",
          description: `Prayer times for ${location.name || 'your location'} have been updated.`,
        });
      } catch (err) {
        console.error("Error fetching prayer times:", err);
        setError("Failed to fetch prayer times. Please try again later.");
        setLoading(false);
        
        // Use mock data as fallback
        const mockPrayerTimes: PrayerTime[] = [
          { name: "Fajr", time: "05:12", timestamp: new Date().setHours(5, 12, 0, 0), adhanEnabled: true },
          { name: "Dhuhr", time: "12:30", timestamp: new Date().setHours(12, 30, 0, 0), adhanEnabled: true },
          { name: "Asr", time: "15:45", timestamp: new Date().setHours(15, 45, 0, 0), adhanEnabled: true },
          { name: "Maghrib", time: "18:20", timestamp: new Date().setHours(18, 20, 0, 0), adhanEnabled: true },
          { name: "Isha", time: "19:50", timestamp: new Date().setHours(19, 50, 0, 0), adhanEnabled: true }
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

  // Play Adhan for a prayer time
  const playAdhan = (prayerIndex: number) => {
    // Stop any currently playing adhan
    if (adhanAudio) {
      adhanAudio.pause();
      adhanAudio.currentTime = 0;
    }

    // Create new audio element
    const audio = new Audio("/adhan.mp3");
    setAdhanAudio(audio);
    
    audio.play().then(() => {
      setPlayingAdhan(prayerIndex);
      
      // Reset when finished
      audio.onended = () => {
        setPlayingAdhan(null);
        setAdhanAudio(null);
      };
    }).catch(err => {
      console.error("Error playing adhan:", err);
      toast({
        title: "Error",
        description: "Could not play adhan. Check if your device allows audio playback.",
        variant: "destructive",
      });
    });
  };

  // Stop playing adhan
  const stopAdhan = () => {
    if (adhanAudio) {
      adhanAudio.pause();
      adhanAudio.currentTime = 0;
      setAdhanAudio(null);
      setPlayingAdhan(null);
    }
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

        // Send notification 5 minutes before prayer time
        if (notificationsEnabled && nextPrayer && distance <= 5 * 60 * 1000 && distance > 4.9 * 60 * 1000) {
          new Notification(`Prayer Time Soon: ${nextPrayer.name}`, {
            body: `${nextPrayer.name} prayer time will begin in 5 minutes at ${nextPrayer.time}`,
            icon: '/favicon.ico'
          });
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [prayerTimes, nextPrayer, notificationsEnabled]);
  
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
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Prayer Times</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Prayer Time Settings</DialogTitle>
                <DialogDescription>
                  Customize your prayer time settings and location
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Set Custom Location</h3>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="location-name">Location Name</Label>
                      <Input 
                        id="location-name"
                        placeholder="e.g., Home, Work, Mosque"
                        value={locationInput.name}
                        onChange={(e) => setLocationInput({...locationInput, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="location-lat">Latitude</Label>
                        <Input 
                          id="location-lat"
                          placeholder="e.g., 21.4225"
                          value={locationInput.lat}
                          onChange={(e) => setLocationInput({...locationInput, lat: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location-lng">Longitude</Label>
                        <Input 
                          id="location-lng"
                          placeholder="e.g., 39.8262"
                          value={locationInput.lng}
                          onChange={(e) => setLocationInput({...locationInput, lng: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={saveCustomLocation}>Save Location</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Notification Settings</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Prayer Time Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          requestNotificationPermission();
                        } else {
                          setNotificationsEnabled(false);
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Get notified 5 minutes before prayer times</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Current Location</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{location?.name || 'Unknown location'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Latitude: {location?.lat.toFixed(4)}, Longitude: {location?.lng.toFixed(4)}
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={getUserLocation} variant="outline">
                  Use My Location
                </Button>
                <Button onClick={savePrayerSettings}>
                  Save Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          {location?.name ? `For ${location.name}` : 'For your current location'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">Current Prayer</p>
            <div className="flex items-center">
              <h3 className="text-xl font-bold">{currentPrayer.name} {currentPrayer.time}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2" 
                onClick={() => playingAdhan === 0 ? stopAdhan() : playAdhan(0)}
              >
                {playingAdhan === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="pulse-animation text-center md:text-right">
            <p className="text-sm text-muted-foreground">Next Prayer</p>
            <div className="flex items-center">
              <h3 className="text-xl font-bold">{nextPrayer.name} {nextPrayer.time}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2" 
                onClick={() => playingAdhan === 1 ? stopAdhan() : playAdhan(1)}
              >
                {playingAdhan === 1 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs mt-1">{nextPrayer.name} starts in <span className="font-bold">{countdown}</span></p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          className="w-full text-xs" 
          onClick={() => {
            if (playingAdhan !== null) {
              stopAdhan();
            } else {
              // Play adhan for next prayer
              playAdhan(1);
            }
          }}
        >
          {playingAdhan !== null ? 
            <><VolumeX className="h-4 w-4 mr-2" /> Stop Adhan</> : 
            <><Volume2 className="h-4 w-4 mr-2" /> Play {nextPrayer.name} Adhan</>
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrayerTimer;
