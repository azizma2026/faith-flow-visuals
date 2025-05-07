import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, Volume2, VolumeX, MapPin, Bell, Settings, Calendar, CloudSun, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

interface PrayerTime {
  name: string;
  time: string;
  timestamp: number;
  notificationEnabled?: boolean;
  icon?: React.ReactNode;
}

interface PrayerCalendarEntry {
  date: string;
  prayers: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

const CALCULATION_METHODS = [
  { id: 2, name: "Islamic Society of North America (ISNA)" },
  { id: 1, name: "Muslim World League" },
  { id: 3, name: "Egyptian General Authority of Survey" },
  { id: 4, name: "Umm Al-Qura University, Makkah" },
  { id: 5, name: "University of Islamic Sciences, Karachi" },
  { id: 7, name: "Institute of Geophysics, University of Tehran" },
  { id: 0, name: "Shia Ithna-Ashari, Leva Institute, Qum" },
];

const MosqueIllustration = () => (
  <div className="relative h-40 w-full overflow-hidden rounded-lg mb-4">
    <div className="absolute inset-0 bg-gradient-to-b from-[#e2d1c3] to-[#b4d6e2] opacity-60"></div>
    <div className="absolute bottom-0 left-0 right-0 h-32">
      {/* Mosque silhouette */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-24 bg-[#564f47] opacity-70 rounded-t-3xl"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -ml-16 w-8 h-32 bg-[#564f47] opacity-70 rounded-t-lg"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 ml-16 w-8 h-32 bg-[#564f47] opacity-70 rounded-t-lg"></div>
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#d4af37] rounded-full opacity-90"></div>
    </div>
    {/* Stars */}
    <div className="absolute top-4 left-10 w-1 h-1 bg-white rounded-full"></div>
    <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-white rounded-full"></div>
    <div className="absolute top-16 left-1/4 w-1 h-1 bg-white rounded-full"></div>
    <div className="absolute top-6 right-1/4 w-1 h-1 bg-white rounded-full"></div>
  </div>
);

const PrayerTimesModule: React.FC = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [customLocation, setCustomLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [adhanVolume, setAdhanVolume] = useState(70);
  const [calculationMethod, setCalculationMethod] = useState(2); // ISNA default
  const [prayerCalendar, setPrayerCalendar] = useState<PrayerCalendarEntry[]>([]);
  const [activeTab, setActiveTab] = useState("times");
  const { toast } = useToast();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedSettings = localStorage.getItem('prayerTimesSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCalculationMethod(settings.calculationMethod || 2);
      setAdhanVolume(settings.adhanVolume || 70);
      
      if (settings.customLocation) {
        setCustomLocation(settings.customLocation);
      } else {
        requestLocation();
      }
    } else {
      requestLocation();
    }
  }, []);
  
  useEffect(() => {
    // Save settings to localStorage
    if (calculationMethod) {
      localStorage.setItem('prayerTimesSettings', JSON.stringify({
        calculationMethod,
        adhanVolume,
        customLocation
      }));
    }
  }, [calculationMethod, adhanVolume, customLocation]);

  const requestLocation = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      // Use default coordinates (Mecca)
      fetchPrayerTimes(21.4225, 39.8262, "Makkah (Default)");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        fetchLocationName(position.coords.latitude, position.coords.longitude)
          .then(name => {
            fetchPrayerTimes(position.coords.latitude, position.coords.longitude, name);
            fetchMonthlyCalendar(position.coords.latitude, position.coords.longitude);
          });
      },
      (error) => {
        toast({
          title: "Location Error",
          description: "Could not get your location. Using default location.",
          variant: "destructive",
        });
        // Use default coordinates (Mecca)
        fetchPrayerTimes(21.4225, 39.8262, "Makkah (Default)");
        fetchMonthlyCalendar(21.4225, 39.8262);
      }
    );
  };
  
  const fetchLocationName = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // In a real app, this would use a geocoding API
      // For now, we'll generate a mock location name based on coords
      return `Location at ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    } catch (error) {
      return "Unknown Location";
    }
  };

  const fetchPrayerTimes = async (latitude: number, longitude: number, locationName?: string) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=${calculationMethod}`
      );
      const data = await response.json();
      
      const timings = data.data.timings;
      // Load saved notification preferences
      const savedPreferences = localStorage.getItem('prayerNotifications');
      const notificationPreferences = savedPreferences ? JSON.parse(savedPreferences) : {
        Fajr: true,
        Dhuhr: true,
        Asr: true,
        Maghrib: true,
        Isha: true
      };
      
      const prayerTimesData: PrayerTime[] = [
        { name: "Fajr", time: timings.Fajr, timestamp: getTimestamp(timings.Fajr), notificationEnabled: notificationPreferences.Fajr, icon: <Moon className="h-4 w-4" /> },
        { name: "Sunrise", time: timings.Sunrise, timestamp: getTimestamp(timings.Sunrise), notificationEnabled: false, icon: <Sun className="h-4 w-4" /> },
        { name: "Dhuhr", time: timings.Dhuhr, timestamp: getTimestamp(timings.Dhuhr), notificationEnabled: notificationPreferences.Dhuhr, icon: <Sun className="h-4 w-4" /> },
        { name: "Asr", time: timings.Asr, timestamp: getTimestamp(timings.Asr), notificationEnabled: notificationPreferences.Asr, icon: <CloudSun className="h-4 w-4" /> },
        { name: "Maghrib", time: timings.Maghrib, timestamp: getTimestamp(timings.Maghrib), notificationEnabled: notificationPreferences.Maghrib, icon: <CloudSun className="h-4 w-4" /> },
        { name: "Isha", time: timings.Isha, timestamp: getTimestamp(timings.Isha), notificationEnabled: notificationPreferences.Isha, icon: <Moon className="h-4 w-4" /> }
      ];
      
      if (locationName) {
        setCustomLocation({
          lat: latitude,
          lng: longitude,
          name: locationName
        });
      }
      
      setPrayerTimes(prayerTimesData);
      setLoading(false);
      updateNextPrayer(prayerTimesData);
      
      // Check if we need to schedule notifications
      scheduleNotifications(prayerTimesData);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch prayer times. Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  const fetchMonthlyCalendar = async (latitude: number, longitude: number) => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // JavaScript months are 0-indexed
      
      const response = await fetch(
        `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${calculationMethod}`
      );
      const data = await response.json();
      
      if (data.data) {
        const calendarData = data.data.map((day: any) => ({
          date: day.date.gregorian.date,
          prayers: {
            fajr: day.timings.Fajr.split(" ")[0],
            sunrise: day.timings.Sunrise.split(" ")[0],
            dhuhr: day.timings.Dhuhr.split(" ")[0],
            asr: day.timings.Asr.split(" ")[0],
            maghrib: day.timings.Maghrib.split(" ")[0],
            isha: day.timings.Isha.split(" ")[0]
          }
        }));
        
        setPrayerCalendar(calendarData);
      }
    } catch (error) {
      console.error("Error fetching prayer calendar:", error);
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
  
  const scheduleNotifications = (prayers: PrayerTime[]) => {
    // In a real app, this would use the Notifications API
    // For this demo, we'll simulate notifications with a simple check
    const checkForNotifications = setInterval(() => {
      const now = new Date().getTime();
      
      // Find prayers that are coming up in the next minute
      prayers.forEach(prayer => {
        if (prayer.notificationEnabled) {
          const timeUntilPrayer = prayer.timestamp - now;
          
          // If prayer is within the next minute (and not passed)
          if (timeUntilPrayer > 0 && timeUntilPrayer <= 60000) {
            toast({
              title: `${prayer.name} Prayer Time`,
              description: `${prayer.name} prayer time is in less than a minute.`,
            });
            
            // Play Adhan for upcoming prayer
            if (prayer.name !== 'Sunrise') {
              toggleAdhan(true);
            }
          }
        }
      });
    }, 10000); // Check every 10 seconds
    
    // Clean up on unmount
    return () => clearInterval(checkForNotifications);
  };

  const toggleAdhan = (autoplay = false) => {
    if (isAdhanPlaying && !autoplay) {
      // Stop Adhan
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsAdhanPlaying(false);
    } else {
      // Play Adhan
      if (!audioRef.current) {
        audioRef.current = new Audio('/adhan.mp3');
        audioRef.current.volume = adhanVolume / 100;
        
        audioRef.current.onended = () => {
          setIsAdhanPlaying(false);
        };
      }
      
      audioRef.current.play().catch(error => {
        toast({
          title: "Audio Error",
          description: "Could not play Adhan. Please check your device settings.",
          variant: "destructive",
        });
      });
      setIsAdhanPlaying(true);
    }
  };
  
  useEffect(() => {
    // Update volume when the slider changes
    if (audioRef.current) {
      audioRef.current.volume = adhanVolume / 100;
    }
  }, [adhanVolume]);
  
  const toggleNotification = (name: string) => {
    const updatedTimes = prayerTimes.map(prayer => 
      prayer.name === name 
        ? { ...prayer, notificationEnabled: !prayer.notificationEnabled }
        : prayer
    );
    
    setPrayerTimes(updatedTimes);
    
    // Save notification preferences
    const preferences = updatedTimes.reduce((acc, prayer) => ({
      ...acc,
      [prayer.name]: prayer.notificationEnabled
    }), {});
    
    localStorage.setItem('prayerNotifications', JSON.stringify(preferences));
    
    const prayer = updatedTimes.find(p => p.name === name);
    toast({
      title: `Notifications ${prayer?.notificationEnabled ? 'Enabled' : 'Disabled'}`,
      description: `${name} prayer notifications have been ${prayer?.notificationEnabled ? 'enabled' : 'disabled'}.`
    });
  };
  
  const handleCalculationMethodChange = (value: string) => {
    const method = parseInt(value);
    setCalculationMethod(method);
    
    // Refetch prayer times with new method
    if (customLocation) {
      fetchPrayerTimes(customLocation.lat, customLocation.lng, customLocation.name);
      fetchMonthlyCalendar(customLocation.lat, customLocation.lng);
    } else if (location) {
      fetchPrayerTimes(
        location.coords.latitude,
        location.coords.longitude
      );
      fetchMonthlyCalendar(
        location.coords.latitude,
        location.coords.longitude
      );
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
      {/* Mosque illustration at the top */}
      <MosqueIllustration />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-[#e2d1c3] rounded-xl p-3 mr-4">
            <Clock className="h-8 w-8 text-[#564f47]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#564f47]">Prayer Times</h1>
            {customLocation && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{customLocation.name}</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => toggleAdhan()}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isAdhanPlaying ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 bg-[#f5f0e8]">
          <TabsTrigger value="times" className="data-[state=active]:bg-[#e2d1c3] data-[state=active]:text-[#564f47]">Times</TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-[#e2d1c3] data-[state=active]:text-[#564f47]">Calendar</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#e2d1c3] data-[state=active]:text-[#564f47]">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="times">
          {nextPrayer && (
            <Card className="mb-6 border-[#e2d1c3] bg-gradient-to-r from-[#f5f0e8] to-[#e8f0f5]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#564f47]">Next Prayer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#e2d1c3]/30 text-[#564f47] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">{nextPrayer.name}</h2>
                      <p className="text-sm">Time until: {countdown}</p>
                    </div>
                    <div className="text-2xl font-bold">{nextPrayer.time}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {prayerTimes.map((prayer) => (
              <motion.div
                key={prayer.name}
                className={`p-4 rounded-lg border ${
                  nextPrayer?.name === prayer.name
                    ? "bg-[#e2d1c3]/20 border-[#b4a89a]"
                    : "bg-card"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="bg-[#f5f0e8] p-2 rounded-full mr-2">
                      {prayer.icon}
                    </span>
                    <span className="font-medium">{prayer.name}</span>
                    {prayer.name !== 'Sunrise' && (
                      <Badge 
                        variant={prayer.notificationEnabled ? "default" : "outline"} 
                        className="ml-2 cursor-pointer bg-[#b4a89a]" 
                        onClick={() => toggleNotification(prayer.name)}
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        {prayer.notificationEnabled ? 'On' : 'Off'}
                      </Badge>
                    )}
                  </div>
                  <span className="font-arabic text-lg">{prayer.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card className="border-[#e2d1c3]">
            <CardHeader className="bg-[#f5f0e8]">
              <CardTitle className="flex items-center gap-2 text-[#564f47]">
                <Calendar className="h-5 w-5" />
                Prayer Times Calendar - {format(new Date(), 'MMMM yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gradient-to-r from-[#f5f0e8]/50 to-[#e8f0f5]/50">
              <div className="text-sm">
                <div className="border-b py-2 grid grid-cols-7 font-medium text-[#564f47]">
                  <div>Date</div>
                  <div>Fajr</div>
                  <div>Sunrise</div>
                  <div>Dhuhr</div>
                  <div>Asr</div>
                  <div>Maghrib</div>
                  <div>Isha</div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {prayerCalendar.map((day) => (
                    <div 
                      key={day.date} 
                      className="grid grid-cols-7 border-b py-2 hover:bg-[#f5f0e8]/30"
                    >
                      <div className="font-medium">{day.date}</div>
                      <div className="font-arabic">{day.prayers.fajr}</div>
                      <div className="font-arabic">{day.prayers.sunrise}</div>
                      <div className="font-arabic">{day.prayers.dhuhr}</div>
                      <div className="font-arabic">{day.prayers.asr}</div>
                      <div className="font-arabic">{day.prayers.maghrib}</div>
                      <div className="font-arabic">{day.prayers.isha}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="border-[#e2d1c3]">
            <CardHeader className="bg-[#f5f0e8]">
              <CardTitle className="flex items-center gap-2 text-[#564f47]">
                <Settings className="h-5 w-5" />
                Prayer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 bg-gradient-to-r from-[#f5f0e8]/50 to-[#e8f0f5]/50">
              <div className="space-y-2">
                <Label>Calculation Method</Label>
                <Select value={calculationMethod.toString()} onValueChange={handleCalculationMethodChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select calculation method" />
                  </SelectTrigger>
                  <SelectContent>
                    {CALCULATION_METHODS.map(method => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label>Adhan Volume</Label>
                <div className="flex items-center gap-2">
                  <VolumeX className="h-4 w-4" />
                  <Slider 
                    value={[adhanVolume]} 
                    onValueChange={(values) => setAdhanVolume(values[0])} 
                    min={0} 
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Volume2 className="h-4 w-4" />
                  <span className="w-8 text-right">{adhanVolume}%</span>
                </div>
                <Button onClick={() => toggleAdhan()} variant="outline" size="sm">
                  Test Adhan
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Prayer Notifications</Label>
                <div className="space-y-3">
                  {prayerTimes
                    .filter(prayer => prayer.name !== 'Sunrise')
                    .map(prayer => (
                      <div key={prayer.name} className="flex items-center justify-between">
                        <Label htmlFor={`${prayer.name}-notification`} className="cursor-pointer">
                          {prayer.name} Prayer Alert
                        </Label>
                        <Switch
                          id={`${prayer.name}-notification`}
                          checked={prayer.notificationEnabled}
                          onCheckedChange={() => toggleNotification(prayer.name)}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex items-center justify-between">
                  <div>
                    {customLocation ? (
                      <span className="text-sm text-muted-foreground">
                        {customLocation.name}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Using device location
                      </span>
                    )}
                  </div>
                  <Button onClick={requestLocation} variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Update Location
                  </Button>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Advanced Prayer Settings</DialogTitle>
                    <DialogDescription>
                      Configure additional prayer calculation parameters.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>School (Asr Calculation)</Label>
                      <Select defaultValue="0">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Asr calculation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Shafi'i, Maliki, Hanbali</SelectItem>
                          <SelectItem value="1">Hanafi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Midnight Mode</Label>
                      <Select defaultValue="0">
                        <SelectTrigger>
                          <SelectValue placeholder="Select midnight mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Standard (Mid Sunset to Sunrise)</SelectItem>
                          <SelectItem value="1">Jafari (Mid Sunset to Fajr)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>High Latitude Adjustment</Label>
                      <Select defaultValue="0">
                        <SelectTrigger>
                          <SelectValue placeholder="Select adjustment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No adjustment</SelectItem>
                          <SelectItem value="1">Middle of night</SelectItem>
                          <SelectItem value="2">One-seventh</SelectItem>
                          <SelectItem value="3">Angle-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden audio element for playing adhan */}
      <audio ref={audioRef} className="hidden" />
    </motion.div>
  );
};

export default PrayerTimesModule;
